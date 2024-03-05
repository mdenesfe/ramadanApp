import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: 'https://ramazan.app',
  integrations: [tailwind(), sitemap()],
  vite: {
    optimizeDeps: {
      noDiscovery: true,
      include: []
    }
  }
});
