import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery, adminLocalQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { siteSettings, socialLinks } from "@db/schema";

export const settingsRouter = createRouter({
  // ─── Public: Get all settings as key-value map ──────────────────
  getAll: publicQuery.query(async () => {
    const db = getDb();
    const settings = await db.select().from(siteSettings);
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value ?? "";
    }
    return map;
  }),

  // ─── Public: Get a single setting ───────────────────────────────
  get: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [setting] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, input.key))
        .limit(1);
      return setting?.value ?? null;
    }),

  // ─── Admin: Set a setting ───────────────────────────────────────
  set: adminLocalQuery
    .input(z.object({ key: z.string(), value: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [existing] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, input.key))
        .limit(1);

      if (existing) {
        await db
          .update(siteSettings)
          .set({ value: input.value })
          .where(eq(siteSettings.id, existing.id));
      } else {
        await db.insert(siteSettings).values({ key: input.key, value: input.value });
      }
      return { success: true };
    }),

  // ─── Public: Social Links ───────────────────────────────────────
  socialLinks: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(socialLinks)
      .where(eq(socialLinks.isActive, "active"));
  }),

  // ─── Admin: Social Links CRUD ───────────────────────────────────
  adminSocialLinks: adminLocalQuery.query(async () => {
    const db = getDb();
    return db.select().from(socialLinks);
  }),

  createSocialLink: adminLocalQuery
    .input(
      z.object({
        platform: z.string().min(1),
        url: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(socialLinks).values(input);
      return { id: Number(result.insertId) };
    }),

  updateSocialLink: adminLocalQuery
    .input(
      z.object({
        id: z.number(),
        platform: z.string().optional(),
        url: z.string().optional(),
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
      await db.update(socialLinks).set(updateFields).where(eq(socialLinks.id, id));
      return { success: true };
    }),

  deleteSocialLink: adminLocalQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(socialLinks).where(eq(socialLinks.id, input.id));
      return { success: true };
    }),
});
