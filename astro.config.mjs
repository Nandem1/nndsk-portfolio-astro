// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://nande.dev", // Actualizar con tu dominio real cuando esté disponible

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        quality: 80,
      },
    },
    domains: ["avatars.githubusercontent.com", "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes("/draft"),
      customPages: [],
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  compressHTML: true,

  build: {
    inlineStylesheets: "auto",
    format: "directory",
  },

  devToolbar: {
    enabled: false,
  },

  adapter: vercel({
    imageService: true,
  }),
});
