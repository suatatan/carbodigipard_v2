import { relations } from "drizzle-orm";
import {
  news,
  newsTranslations,
  newsImages,
  categories,
  trainingMaterials,
} from "./schema";

export const newsRelations = relations(news, ({ one, many }) => ({
  category: one(categories, {
    fields: [news.categoryId],
    references: [categories.id],
  }),
  translations: many(newsTranslations),
  images: many(newsImages),
}));

export const newsTranslationsRelations = relations(newsTranslations, ({ one }) => ({
  news: one(news, {
    fields: [newsTranslations.newsId],
    references: [news.id],
  }),
}));

export const newsImagesRelations = relations(newsImages, ({ one }) => ({
  news: one(news, {
    fields: [newsImages.newsId],
    references: [news.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  news: many(news),
  trainingMaterials: many(trainingMaterials),
}));

export const trainingMaterialsRelations = relations(trainingMaterials, ({ one }) => ({
  category: one(categories, {
    fields: [trainingMaterials.categoryId],
    references: [categories.id],
  }),
}));
