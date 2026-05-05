// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://carbodigipard.netlify.app',
  integrations: [mdx()],
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});