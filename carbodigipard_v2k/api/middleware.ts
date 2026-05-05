import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});

function requireRole(role: string) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== role) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: ErrorMessages.insufficientRole,
      });
    }

    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}

export const authedQuery = t.procedure.use(requireAuth);
export const adminQuery = authedQuery.use(requireRole("admin"));

// Local admin auth via x-admin-token header
const requireLocalAdmin = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  const token = ctx.req.headers.get("x-admin-token");
  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }
  const { verifyAdminToken } = await import("./admin-auth-router");
  const payload = await verifyAdminToken(token);
  if (!payload) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired admin token",
    });
  }
  return next({ ctx: { ...ctx, adminUser: payload } });
});

export const adminLocalQuery = t.procedure.use(requireLocalAdmin);
