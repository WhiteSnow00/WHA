import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import vercel from '@astrojs/vercel/static';

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";

export default defineConfig({
  site: 'http://localhost:3000',
  adapter: vercel(),
  integrations: [tailwind(), sitemap(), mdx(), pagefind()],
  markdown: {
  },
});