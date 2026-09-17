// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
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
    react(),
    sitemap({
      filter: page => !page.includes('/draft'),
      customPages: [],
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        if (item.url.includes('/projects/nndsk-ro-launcher')) {
          return { ...item, priority: 0.8 };
        }
        return item;
      },
    }),
  ],

  compressHTML: true,

  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "font-src 'self'",
        "img-src 'self' data: https://avatars.githubusercontent.com https://images.unsplash.com",
        "manifest-src 'self'",
        "connect-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'"],
      },
    },
  },

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
    plugins: [
      // @ts-expect-error @tailwindcss/vite uses root Vite Plugin types; Astro bundles its own Vite
      tailwindcss(),
    ],
  },
});
