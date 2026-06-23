// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  legacy: {
    collectionsBackwardsCompat: true,
  },

  // Dominio del sitio
  site: 'https://nndsk.dev',

  // Configuración de trailing slash para consistencia en URLs
  trailingSlash: 'always',

  prefetch: false,

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        quality: 80,
        format: 'webp',
        avif: true,
      },
    },
    domains: ['avatars.githubusercontent.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  integrations: [
    sitemap({
      filter: page => !page.includes('/draft'),
      customPages: [],
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],

  compressHTML: true,

  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },

  devToolbar: {
    enabled: false,
  },

  // Nota: Sin adapter para output: 'static' puro
  // El sitio se despliega como archivos estáticos estáticos

  vite: {
    plugins: [tailwindcss()],
  },
});
