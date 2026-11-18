import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Giuseppe Zileni'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    lang: z.enum(['it', 'en']).default('it'),
    /** Rubrica a cui appartiene l'articolo (es. 'opendata'). Facoltativo. */
    series: z.string().optional(),
    /** Progetto open source raccontato dall'articolo: repository e sito GitHub Pages. */
    project: z.object({
      name: z.string(),
      repo: z.string().url(),
      docs: z.string().url().optional(),
    }).optional(),
  }),
});

export const collections = { blog };
