// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  // Dominio del sitio
  site: 'https://nndsk.dev',

  // Configuración de trailing slash para consistencia en URLs
  trailingSlash: 'always',

  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            display: 'swap',
            src: ['./src/assets/fonts/inter-latin.woff2'],
            unicodeRange: [
              'U+0000-00FF',
              'U+0131',
              'U+0152-0153',
              'U+02BB-02BC',
              'U+02C6',
              'U+02DA',
              'U+02DC',
              'U+0304',
              'U+0308',
              'U+0329',
              'U+2000-206F',
              'U+20AC',
              'U+2122',
              'U+2191',
              'U+2193',
              'U+2212',
              'U+2215',
              'U+FEFF',
              'U+FFFD',
            ],
          },
          {
            weight: '100 900',
            style: 'normal',
            display: 'swap',
            src: ['./src/assets/fonts/inter-latin-ext.woff2'],
            unicodeRange: [
              'U+0100-02BA',
              'U+02BD-02C5',
              'U+02C7-02CC',
              'U+02CE-02D7',
              'U+02DD-02FF',
              'U+0304',
              'U+0308',
              'U+0329',
              'U+1D00-1DBF',
              'U+1E00-1E9F',
              'U+1EF2-1EFF',
              'U+2020',
              'U+20A0-20AB',
              'U+20AD-20C0',
              'U+2113',
              'U+2C60-2C7F',
              'U+A720-A7FF',
            ],
          },
        ],
      },
    },
  ],

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        quality: 80,
        format: 'webp',
        avif: true,
      },
    },
    domains: ['avatars.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
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
          return { ...item, priority: 0.8, lastmod: '2026-09-18' };
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
        "img-src 'self' data: https://avatars.githubusercontent.com",
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
    plugins: [tailwindcss()],
  },
});
