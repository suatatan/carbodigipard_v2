import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { createRouter, publicQuery, adminLocalQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { partnerLogos } from "@db/schema";

export const partnerRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(partnerLogos)
      .where(eq(partnerLogos.isActive, "active"))
      .orderBy(asc(partnerLogos.sortOrder));
  }),

  adminList: adminLocalQuery.query(async () => {
    const db = getDb();
    return db.select().from(partnerLogos).orderBy(asc(partnerLogos.sortOrder));
  }),

  create: adminLocalQuery
    .input(
      z.object({
        nameTr: z.string().min(1),
        nameEn: z.string().optional(),
        logoPath: z.string().min(1),
        websiteUrl: z.string().optional(),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(partnerLogos).values(input);
      return { id: Number(result.insertId) };
    }),

  update: adminLocalQuery
    .input(
      z.object({
        id: z.number(),
        nameTr: z.string().min(1).optional(),
        nameEn: z.string().optional(),
        logoPath: z.string().optional(),
        websiteUrl: z.string().optional(),
        sortOrder: z.number().optional(),
        isActive: z.enum(["active", "inactive"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...fields } = input;
      const updateFields: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(fields)) {
        if (val !== undefined) updateFields[key] = val;
      }
      await db.update(partnerLogos).set(updateFields).where(eq(partnerLogos.id, id));
      return { success: true };
    }),

  delete: adminLocalQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(partnerLogos).where(eq(partnerLogos.id, input.id));
      return { success: true };
    }),
});
