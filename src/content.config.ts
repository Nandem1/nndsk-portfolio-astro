import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      stack: z.array(z.string()).optional(),
      highlights: z.array(z.string()).optional(),
      year: z.string().optional(),
      thumbnail: image().optional(),
      gallery: z.array(image()).optional(),
      link: z.string().url().optional(),
      github: z.string().url().optional(),
      featured: z.boolean().default(false),
      order: z.number().int().default(0),
    }),
});

const timeline = defineCollection({
  type: 'data',
  schema: z.object({
    year: z.string(),
    title: z.string(),
    description: z.string(),
    order: z.number().int(),
  }),
});

export const collections = { projects, timeline };
