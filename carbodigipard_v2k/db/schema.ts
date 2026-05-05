import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
} from "drizzle-orm/mysql-core";

// ─── Users (Kimi OAuth) ───────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Admin Users (local username/password auth) ───────────────────
export const adminUsers = mysqlTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["admin", "editor"]).default("editor").notNull(),
  isActive: mysqlEnum("is_active", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type AdminUser = typeof adminUsers.$inferSelect;

// ─── Categories ───────────────────────────────────────────────────
export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  nameTr: varchar("name_tr", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sortOrder: int("sort_order").default(0).notNull(),
  isActive: mysqlEnum("is_active", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Category = typeof categories.$inferSelect;

// ─── News ─────────────────────────────────────────────────────────
export const news = mysqlTable("news", {
  id: serial("id").primaryKey(),
  categoryId: bigint("category_id", { mode: "number", unsigned: true }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  featuredImage: varchar("featured_image", { length: 500 }),
  isActive: mysqlEnum("is_active", ["active", "inactive"]).default("active").notNull(),
  viewCount: int("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type News = typeof news.$inferSelect;

// ─── News Translations ────────────────────────────────────────────
export const newsTranslations = mysqlTable("news_translations", {
  id: serial("id").primaryKey(),
  newsId: bigint("news_id", { mode: "number", unsigned: true }).notNull(),
  language: mysqlEnum("language", ["tr", "en"]).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  summary: varchar("summary", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type NewsTranslation = typeof newsTranslations.$inferSelect;

// ─── News Images (gallery) ────────────────────────────────────────
export const newsImages = mysqlTable("news_images", {
  id: serial("id").primaryKey(),
  newsId: bigint("news_id", { mode: "number", unsigned: true }).notNull(),
  imagePath: varchar("image_path", { length: 500 }).notNull(),
  thumbnailPath: varchar("thumbnail_path", { length: 500 }),
  altText: varchar("alt_text", { length: 255 }),
  sortOrder: int("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type NewsImage = typeof newsImages.$inferSelect;

// ─── Partner Logos ────────────────────────────────────────────────
export const partnerLogos = mysqlTable("partner_logos", {
  id: serial("id").primaryKey(),
  nameTr: varchar("name_tr", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }),
  logoPath: varchar("logo_path", { length: 500 }).notNull(),
  websiteUrl: varchar("website_url", { length: 500 }),
  sortOrder: int("sort_order").default(0).notNull(),
  isActive: mysqlEnum("is_active", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type PartnerLogo = typeof partnerLogos.$inferSelect;

// ─── Training Materials ───────────────────────────────────────────
export const trainingMaterials = mysqlTable("training_materials", {
  id: serial("id").primaryKey(),
  titleTr: varchar("title_tr", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }),
  descriptionTr: text("description_tr"),
  descriptionEn: text("description_en"),
  materialType: mysqlEnum("material_type", ["video", "document"]).notNull(),
  videoUrl: varchar("video_url", { length: 500 }),
  documentPath: varchar("document_path", { length: 500 }),
  thumbnailPath: varchar("thumbnail_path", { length: 500 }),
  duration: varchar("duration", { length: 50 }),
  categoryId: bigint("category_id", { mode: "number", unsigned: true }),
  isActive: mysqlEnum("is_active", ["active", "inactive"]).default("active").notNull(),
  sortOrder: int("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type TrainingMaterial = typeof trainingMaterials.$inferSelect;

// ─── Site Settings ────────────────────────────────────────────────
export const siteSettings = mysqlTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SiteSetting = typeof siteSettings.$inferSelect;

// ─── Social Links ─────────────────────────────────────────────────
export const socialLinks = mysqlTable("social_links", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 100 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  isActive: mysqlEnum("is_active", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SocialLink = typeof socialLinks.$inferSelect;
