// astro.config.mjs

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
  },
  serviceWorker: {
    url: '/service-worker.js'
  },
  manifest: {
    fileName: '/manifest.json'
  }
});
