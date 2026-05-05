import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { createRouter, publicQuery, adminLocalQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { categories } from "@db/schema";

export const categoryRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(categories)
      .where(eq(categories.isActive, "active"))
      .orderBy(asc(categories.sortOrder));
  }),

  adminList: adminLocalQuery.query(async () => {
    const db = getDb();
    return db.select().from(categories).orderBy(asc(categories.sortOrder));
  }),

  create: adminLocalQuery
    .input(
      z.object({
        nameTr: z.string().min(1),
        nameEn: z.string().optional(),
        slug: z.string().min(1),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(categories).values({
        nameTr: input.nameTr,
        nameEn: input.nameEn,
        slug: input.slug,
        sortOrder: input.sortOrder,
      });
      return { id: Number(result.insertId) };
    }),

  update: adminLocalQuery
    .input(
      z.object({
        id: z.number(),
        nameTr: z.string().min(1).optional(),
        nameEn: z.string().optional(),
        slug: z.string().min(1).optional(),
        sortOrder: z.number().optional(),
        isActive: z.enum(["active", "inactive"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...fields } = input;
      const updateFields: Record<string, unknown> = {};
      if (fields.nameTr !== undefined) updateFields.nameTr = fields.nameTr;
      if (fields.nameEn !== undefined) updateFields.nameEn = fields.nameEn;
      if (fields.slug !== undefined) updateFields.slug = fields.slug;
      if (fields.sortOrder !== undefined) updateFields.sortOrder = fields.sortOrder;
      if (fields.isActive !== undefined) updateFields.isActive = fields.isActive;

      await db.update(categories).set(updateFields).where(eq(categories.id, id));
      return { success: true };
    }),

  delete: adminLocalQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});
