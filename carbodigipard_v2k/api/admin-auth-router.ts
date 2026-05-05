import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { adminUsers } from "@db/schema";
import { env } from "./lib/env";
import { TRPCError } from "@trpc/server";

const secret = new TextEncoder().encode(env.adminJwtSecret);

export async function createAdminToken(userId: number, username: string, role: string) {
  return new SignJWT({ userId, username, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 60 });
    return payload as { userId: number; username: string; role: string };
  } catch {
    return null;
  }
}

export const adminAuthRouter = createRouter({
  login: publicQuery
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [user] = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.username, input.username))
        .limit(1);

      if (!user || user.isActive !== "active") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const token = await createAdminToken(user.id, user.username, user.role);

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("x-admin-token");
    if (!authHeader) {
      return null;
    }

    const payload = await verifyAdminToken(authHeader);
    if (!payload) {
      return null;
    }

    const db = getDb();
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, payload.userId))
      .limit(1);

    if (!user || user.isActive !== "active") {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    };
  }),
});
