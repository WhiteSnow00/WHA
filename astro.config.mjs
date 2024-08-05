import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  site: "https://facebook.com/F.Ena2001",
  integrations: [tailwind(), sitemap(), mdx(), pagefind()],
  markdown: {
  },
});