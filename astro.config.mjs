// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Project site on GitHub Pages: https://dileepadev.github.io/ai-snippets
export default defineConfig({
  site: 'https://dileepadev.github.io',
  base: '/ai-snippets',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
  build: { format: 'directory' },
});
