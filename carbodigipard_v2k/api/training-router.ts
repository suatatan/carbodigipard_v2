import { z } from "zod";
import { eq, asc, and } from "drizzle-orm";
import { createRouter, publicQuery, adminLocalQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { trainingMaterials, categories } from "@db/schema";

export const trainingRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        type: z.enum(["video", "document"]).optional(),
        language: z.enum(["tr", "en"]).default("tr"),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const params = input ?? { language: "tr" };

      const conditions = [eq(trainingMaterials.isActive, "active")];
      if (params.type) {
        conditions.push(eq(trainingMaterials.materialType, params.type));
      }

      const items = await db
        .select({
          id: trainingMaterials.id,
          titleTr: trainingMaterials.titleTr,
          titleEn: trainingMaterials.titleEn,
          descriptionTr: trainingMaterials.descriptionTr,
          descriptionEn: trainingMaterials.descriptionEn,
          materialType: trainingMaterials.materialType,
          videoUrl: trainingMaterials.videoUrl,
          documentPath: trainingMaterials.documentPath,
          thumbnailPath: trainingMaterials.thumbnailPath,
          duration: trainingMaterials.duration,
          sortOrder: trainingMaterials.sortOrder,
          createdAt: trainingMaterials.createdAt,
          categoryId: trainingMaterials.categoryId,
          categoryNameTr: categories.nameTr,
          categoryNameEn: categories.nameEn,
        })
        .from(trainingMaterials)
        .leftJoin(categories, eq(trainingMaterials.categoryId, categories.id))
        .where(and(...conditions))
        .orderBy(asc(trainingMaterials.sortOrder));

      return items.map((item) => ({
        ...item,
        title: params.language === "en" && item.titleEn ? item.titleEn : item.titleTr,
        description: params.language === "en" && item.descriptionEn
          ? item.descriptionEn
          : item.descriptionTr,
        categoryName: params.language === "en" && item.categoryNameEn
          ? item.categoryNameEn
          : item.categoryNameTr,
      }));
    }),

  adminList: adminLocalQuery.query(async () => {
    const db = getDb();
    return db
      .select({
        id: trainingMaterials.id,
        titleTr: trainingMaterials.titleTr,
        titleEn: trainingMaterials.titleEn,
        descriptionTr: trainingMaterials.descriptionTr,
        descriptionEn: trainingMaterials.descriptionEn,
        materialType: trainingMaterials.materialType,
        videoUrl: trainingMaterials.videoUrl,
        documentPath: trainingMaterials.documentPath,
        thumbnailPath: trainingMaterials.thumbnailPath,
        duration: trainingMaterials.duration,
        sortOrder: trainingMaterials.sortOrder,
        isActive: trainingMaterials.isActive,
        categoryId: trainingMaterials.categoryId,
        categoryName: categories.nameTr,
        createdAt: trainingMaterials.createdAt,
      })
      .from(trainingMaterials)
      .leftJoin(categories, eq(trainingMaterials.categoryId, categories.id))
      .orderBy(asc(trainingMaterials.sortOrder));
  }),

  create: adminLocalQuery
    .input(
      z.object({
        titleTr: z.string().min(1),
        titleEn: z.string().optional(),
        descriptionTr: z.string().optional(),
        descriptionEn: z.string().optional(),
        materialType: z.enum(["video", "document"]),
        videoUrl: z.string().optional(),
        documentPath: z.string().optional(),
        thumbnailPath: z.string().optional(),
        duration: z.string().optional(),
        categoryId: z.number().optional(),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(trainingMaterials).values(input);
      return { id: Number(result.insertId) };
    }),

  update: adminLocalQuery
    .input(
      z.object({
        id: z.number(),
        titleTr: z.string().min(1).optional(),
        titleEn: z.string().optional(),
        descriptionTr: z.string().optional(),
        descriptionEn: z.string().optional(),
        materialType: z.enum(["video", "document"]).optional(),
        videoUrl: z.string().optional(),
        documentPath: z.string().optional(),
        thumbnailPath: z.string().optional(),
        duration: z.string().optional(),
        categoryId: z.number().optional(),
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
      await db.update(trainingMaterials).set(updateFields).where(eq(trainingMaterials.id, id));
      return { success: true };
    }),

  delete: adminLocalQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(trainingMaterials).where(eq(trainingMaterials.id, input.id));
      return { success: true };
    }),
});
