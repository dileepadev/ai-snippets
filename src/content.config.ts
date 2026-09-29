import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES, MODEL_TYPES } from './consts';

const categoryIds = CATEGORIES.map((c) => c.id) as [string, ...string[]];

const resource = z.object({
  label: z.string().min(1),
  url: z.url(),
});

/**
 * Snippets live in /snippets/<category>/<provider>-<what-it-does>.md so that the
 * path a contributor types is the path the README documents. Files beginning
 * with an underscore (the template) are skipped.
 */
const snippets = defineCollection({
  loader: glob({ pattern: '*/[!_]*.md', base: './snippets' }),
  schema: z.object({
    title: z.string().min(1),
    provider: z.string().min(1),
    product: z.string().min(1),
    description: z.string().min(1),
    prerequisites: z.array(z.string().min(1)).min(1),
    expected_output: z.string().min(1),
    caveat: z.string().optional(),
    model_types: z.array(z.enum(MODEL_TYPES)).min(1),
    source: z.url(),
    verified: z.coerce.date(),
    packages: z.record(z.string(), z.string()).default({}),
    package_notes: z.string().optional(),
    resources: z.array(resource).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { snippets };
export { categoryIds };
