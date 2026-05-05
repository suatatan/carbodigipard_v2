import { authRouter } from "./auth-router";
import { adminAuthRouter } from "./admin-auth-router";
import { newsRouter } from "./news-router";
import { categoryRouter } from "./category-router";
import { partnerRouter } from "./partner-router";
import { trainingRouter } from "./training-router";
import { settingsRouter } from "./settings-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  adminAuth: adminAuthRouter,
  news: newsRouter,
  category: categoryRouter,
  partner: partnerRouter,
  training: trainingRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
