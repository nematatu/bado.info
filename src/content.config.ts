import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(true),
    sources: z.array(z.object({
      title: z.string().trim().min(1),
      url: z.url({ protocol: /^https?$/ }),
    })).default([]),
  }),
});

export const collections = { articles };
