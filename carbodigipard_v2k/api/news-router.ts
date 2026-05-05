import { z } from "zod";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminLocalQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { news, newsTranslations, newsImages, categories } from "@db/schema";

export const newsRouter = createRouter({
  // ─── Public: List news (carousel, filters) ──────────────────────
  list: publicQuery
    .input(
      z.object({
        language: z.enum(["tr", "en"]).default("tr"),
        categoryId: z.number().optional(),
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const params = input ?? { language: "tr", limit: 10, offset: 0 };

      const conditions = [eq(news.isActive, "active")];
      if (params.categoryId) {
        conditions.push(eq(news.categoryId, params.categoryId));
      }

      const items = await db
        .select({
          id: news.id,
          slug: news.slug,
          featuredImage: news.featuredImage,
          viewCount: news.viewCount,
          createdAt: news.createdAt,
          categoryId: news.categoryId,
          categoryNameTr: categories.nameTr,
          categoryNameEn: categories.nameEn,
          title: newsTranslations.title,
          summary: newsTranslations.summary,
        })
        .from(news)
        .leftJoin(categories, eq(news.categoryId, categories.id))
        .leftJoin(
          newsTranslations,
          and(
            eq(news.id, newsTranslations.newsId),
            eq(newsTranslations.language, params.language)
          )
        )
        .where(and(...conditions))
        .orderBy(desc(news.createdAt))
        .limit(params.limit)
        .offset(params.offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(news)
        .where(and(...conditions));

      return {
        items,
        total: countResult[0]?.count ?? 0,
      };
    }),

  // ─── Public: Get single news with translations and gallery ──────
  getBySlug: publicQuery
    .input(z.object({ slug: z.string(), language: z.enum(["tr", "en"]).default("tr") }))
    .query(async ({ input }) => {
      const db = getDb();

      const [item] = await db
        .select({
          id: news.id,
          slug: news.slug,
          featuredImage: news.featuredImage,
          viewCount: news.viewCount,
          categoryId: news.categoryId,
          createdAt: news.createdAt,
          updatedAt: news.updatedAt,
        })
        .from(news)
        .where(and(eq(news.slug, input.slug), eq(news.isActive, "active")))
        .limit(1);

      if (!item) return null;

      // Get translation in requested language
      const [translation] = await db
        .select()
        .from(newsTranslations)
        .where(
          and(
            eq(newsTranslations.newsId, item.id),
            eq(newsTranslations.language, input.language)
          )
        )
        .limit(1);

      // Get all translations to check availability
      const allTranslations = await db
        .select()
        .from(newsTranslations)
        .where(eq(newsTranslations.newsId, item.id));

      const trTranslation = allTranslations.find((t) => t.language === "tr");
      const enTranslation = allTranslations.find((t) => t.language === "en");

      // Get gallery images
      const images = await db
        .select()
        .from(newsImages)
        .where(eq(newsImages.newsId, item.id))
        .orderBy(asc(newsImages.sortOrder));

      // Get category
      const [category] = item.categoryId
        ? await db
            .select()
            .from(categories)
            .where(eq(categories.id, item.categoryId))
            .limit(1)
        : [null];

      // Increment view count
      await db
        .update(news)
        .set({ viewCount: sql`${news.viewCount} + 1` })
        .where(eq(news.id, item.id));

      return {
        ...item,
        translation,
        hasTranslation: !!translation,
        trTitle: trTranslation?.title ?? null,
        enTitle: enTranslation?.title ?? null,
        trContent: trTranslation?.content ?? null,
        enContent: enTranslation?.content ?? null,
        images,
        category,
      };
    }),

  // ─── Public: Get related news ───────────────────────────────────
  related: publicQuery
    .input(z.object({ newsId: z.number(), language: z.enum(["tr", "en"]).default("tr"), limit: z.number().default(3) }))
    .query(async ({ input }) => {
      const db = getDb();

      const items = await db
        .select({
          id: news.id,
          slug: news.slug,
          featuredImage: news.featuredImage,
          createdAt: news.createdAt,
          title: newsTranslations.title,
        })
        .from(news)
        .leftJoin(
          newsTranslations,
          and(
            eq(news.id, newsTranslations.newsId),
            eq(newsTranslations.language, input.language)
          )
        )
        .where(and(eq(news.isActive, "active"), sql`${news.id} != ${input.newsId}`))
        .orderBy(desc(news.createdAt))
        .limit(input.limit);

      return items;
    }),

  // ─── Admin: List all news (with pagination) ─────────────────────
  adminList: adminLocalQuery
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
        categoryId: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const params = input ?? { limit: 20, offset: 0 };

      const conditions = [];
      if (params.categoryId) {
        conditions.push(eq(news.categoryId, params.categoryId));
      }

      const items = await db
        .select({
          id: news.id,
          slug: news.slug,
          featuredImage: news.featuredImage,
          isActive: news.isActive,
          viewCount: news.viewCount,
          createdAt: news.createdAt,
          categoryId: news.categoryId,
          categoryName: categories.nameTr,
        })
        .from(news)
        .leftJoin(categories, eq(news.categoryId, categories.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(news.createdAt))
        .limit(params.limit)
        .offset(params.offset);

      // Get translations for each news
      const itemsWithTranslations = await Promise.all(
        items.map(async (item) => {
          const translations = await db
            .select()
            .from(newsTranslations)
            .where(eq(newsTranslations.newsId, item.id));
          const tr = translations.find((t) => t.language === "tr");
          const en = translations.find((t) => t.language === "en");
          return {
            ...item,
            trTitle: tr?.title ?? "",
            enTitle: en?.title ?? "",
          };
        })
      );

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(news);

      return {
        items: itemsWithTranslations,
        total: countResult[0]?.count ?? 0,
      };
    }),

  // ─── Admin: Get single news for editing ─────────────────────────
  adminGet: adminLocalQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();

      const [item] = await db
        .select()
        .from(news)
        .where(eq(news.id, input.id))
        .limit(1);

      if (!item) return null;

      const translations = await db
        .select()
        .from(newsTranslations)
        .where(eq(newsTranslations.newsId, item.id));

      const images = await db
        .select()
        .from(newsImages)
        .where(eq(newsImages.newsId, item.id))
        .orderBy(asc(newsImages.sortOrder));

      return {
        ...item,
        translations,
        images,
      };
    }),

  // ─── Admin: Create news ─────────────────────────────────────────
  create: adminLocalQuery
    .input(
      z.object({
        slug: z.string().min(1),
        categoryId: z.number().optional(),
        featuredImage: z.string().optional(),
        isActive: z.enum(["active", "inactive"]).default("active"),
        tr: z.object({
          title: z.string().min(1),
          content: z.string().min(1),
          summary: z.string().optional(),
        }),
        en: z.object({
          title: z.string().optional(),
          content: z.string().optional(),
          summary: z.string().optional(),
        }).optional(),
        images: z.array(z.object({
          imagePath: z.string(),
          altText: z.string().optional(),
          sortOrder: z.number().optional()
        })).optional()
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const [result] = await db.insert(news).values({
        slug: input.slug,
        categoryId: input.categoryId,
        featuredImage: input.featuredImage,
        isActive: input.isActive,
      });

      const newsId = Number(result.insertId);

      // Insert Turkish translation
      await db.insert(newsTranslations).values({
        newsId,
        language: "tr",
        title: input.tr.title,
        content: input.tr.content,
        summary: input.tr.summary,
      });

      // Insert English translation if provided
      if (input.en?.title && input.en?.content) {
        await db.insert(newsTranslations).values({
          newsId,
          language: "en",
          title: input.en.title,
          content: input.en.content,
          summary: input.en.summary,
        });
      }

      // Insert gallery images if provided
      if (input.images && input.images.length > 0) {
        await db.insert(newsImages).values(
          input.images.map((img, idx) => ({
            newsId,
            imagePath: img.imagePath,
            altText: img.altText,
            sortOrder: img.sortOrder ?? idx,
          }))
        );
      }

      return { id: newsId };
    }),

  // ─── Admin: Update news ─────────────────────────────────────────
  update: adminLocalQuery
    .input(
      z.object({
        id: z.number(),
        slug: z.string().min(1).optional(),
        categoryId: z.number().optional(),
        featuredImage: z.string().optional(),
        isActive: z.enum(["active", "inactive"]).optional(),
        tr: z.object({
          title: z.string().min(1),
          content: z.string().min(1),
          summary: z.string().optional(),
        }).optional(),
        en: z.object({
          title: z.string().optional(),
          content: z.string().optional(),
          summary: z.string().optional(),
        }).optional(),
        images: z.array(z.object({
          imagePath: z.string(),
          altText: z.string().optional(),
          sortOrder: z.number().optional(),
        })).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, tr, en, images, ...updateData } = input;

      // Update news record
      const updateFields: Record<string, unknown> = {};
      if (updateData.slug !== undefined) updateFields.slug = updateData.slug;
      if (updateData.categoryId !== undefined) updateFields.categoryId = updateData.categoryId;
      if (updateData.featuredImage !== undefined) updateFields.featuredImage = updateData.featuredImage;
      if (updateData.isActive !== undefined) updateFields.isActive = updateData.isActive;

      if (Object.keys(updateFields).length > 0) {
        await db.update(news).set(updateFields).where(eq(news.id, id));
      }

      // Update or insert Turkish translation
      if (tr) {
        const [existing] = await db
          .select()
          .from(newsTranslations)
          .where(
            and(eq(newsTranslations.newsId, id), eq(newsTranslations.language, "tr"))
          )
          .limit(1);

        if (existing) {
          await db
            .update(newsTranslations)
            .set({ title: tr.title, content: tr.content, summary: tr.summary })
            .where(eq(newsTranslations.id, existing.id));
        } else {
          await db.insert(newsTranslations).values({
            newsId: id,
            language: "tr",
            title: tr.title,
            content: tr.content,
            summary: tr.summary,
          });
        }
      }

      // Update or insert English translation
      if (en) {
        const [existing] = await db
          .select()
          .from(newsTranslations)
          .where(
            and(eq(newsTranslations.newsId, id), eq(newsTranslations.language, "en"))
          )
          .limit(1);

        if (existing) {
          const updateEn: Record<string, unknown> = {};
          if (en.title !== undefined) updateEn.title = en.title;
          if (en.content !== undefined) updateEn.content = en.content;
          if (en.summary !== undefined) updateEn.summary = en.summary;
          if (Object.keys(updateEn).length > 0) {
            await db.update(newsTranslations).set(updateEn).where(eq(newsTranslations.id, existing.id));
          }
        } else if (en.title && en.content) {
          await db.insert(newsTranslations).values({
            newsId: id,
            language: "en",
            title: en.title,
            content: en.content,
            summary: en.summary,
          });
        }
      }

      // Update gallery images if provided
      if (images) {
        await db.delete(newsImages).where(eq(newsImages.newsId, id));
        if (images.length > 0) {
          await db.insert(newsImages).values(
            images.map((img, idx) => ({
              newsId: id,
              imagePath: img.imagePath,
              altText: img.altText,
              sortOrder: img.sortOrder ?? idx,
            }))
          );
        }
      }

      return { success: true };
    }),

  // ─── Admin: Delete news ─────────────────────────────────────────
  delete: adminLocalQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Delete translations first
      await db.delete(newsTranslations).where(eq(newsTranslations.newsId, input.id));
      // Delete images
      await db.delete(newsImages).where(eq(newsImages.newsId, input.id));
      // Delete news
      await db.delete(news).where(eq(news.id, input.id));

      return { success: true };
    }),

  // ─── Admin: Toggle news status ──────────────────────────────────
  toggleStatus: adminLocalQuery
    .input(z.object({ id: z.number(), isActive: z.enum(["active", "inactive"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(news)
        .set({ isActive: input.isActive })
        .where(eq(news.id, input.id));
      return { success: true };
    }),

  // ─── Admin: Add gallery image ───────────────────────────────────
  addImage: adminLocalQuery
    .input(
      z.object({
        newsId: z.number(),
        imagePath: z.string(),
        thumbnailPath: z.string().optional(),
        altText: z.string().optional(),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(newsImages).values({
        newsId: input.newsId,
        imagePath: input.imagePath,
        thumbnailPath: input.thumbnailPath,
        altText: input.altText,
        sortOrder: input.sortOrder,
      });
      return { id: Number(result.insertId) };
    }),

  // ─── Admin: Delete gallery image ────────────────────────────────
  deleteImage: adminLocalQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(newsImages).where(eq(newsImages.id, input.id));
      return { success: true };
    }),
});
