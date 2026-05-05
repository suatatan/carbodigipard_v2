import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newsSchema = z.object({
  title: z.string(),
  date: z.string(),
  summary: z.string(),
  category: z.string().optional(),
  image: z.string().optional(),
  featured: z.boolean().optional().default(false),
});

const trainingSchema = z.object({
  title: z.string(),
  date: z.string(),
  summary: z.string(),
  videoUrl: z.string().optional(),
  duration: z.string().optional(),
  category: z.string().optional(),
  image: z.string().optional(),
});

export const collections = {
  'tr-news': defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './content/tr/news' }),
    schema: newsSchema,
  }),
  'en-news': defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './content/en/news' }),
    schema: newsSchema,
  }),
  'tr-training': defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './content/tr/training' }),
    schema: trainingSchema,
  }),
  'en-training': defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './content/en/training' }),
    schema: trainingSchema,
  }),
};
