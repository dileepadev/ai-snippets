import taxonomy from './taxonomy.json';

export const SITE = {
  name: 'ai-snippets',
  title: 'ai-snippets',
  tagline: 'Official code snippets for AI model APIs, agent SDKs, and frameworks, in one place.',
  description:
    'A catalogue of AI SDK code snippets copied from official sources. Every snippet links to the page it came from and records when it was last checked.',
  repo: 'https://github.com/dileepadev/ai-snippets',
  issues: 'https://github.com/dileepadev/ai-snippets/issues',
  author: 'dileepadev',
  authorUrl: 'https://github.com/dileepadev',
} as const;

/** Category folder names. The list itself lives in taxonomy.json so that the
    site and the scripts in scripts/ cannot drift apart. */
export type CategoryId = string;

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
  examples: string[];
}

/** Order matches the table in README.md. */
export const CATEGORIES: Category[] = taxonomy.categories;

export const CATEGORY_BY_ID: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

export type ModelType = 'llm' | 'slm' | 'vision' | 'speech' | 'embeddings' | 'image' | 'video';

export const MODEL_TYPES = taxonomy.modelTypes as unknown as readonly [ModelType, ...ModelType[]];

export const MODEL_TYPE_LABELS: Record<ModelType, string> = {
  llm: 'LLM',
  slm: 'SLM',
  vision: 'Vision',
  speech: 'Speech',
  embeddings: 'Embeddings',
  image: 'Image',
  video: 'Video',
};

// taxonomy.json is untyped at runtime, so make a mismatch fail the build rather
// than render an empty label on a snippet page.
for (const type of MODEL_TYPES) {
  if (!(type in MODEL_TYPE_LABELS)) {
    throw new Error(
      `src/taxonomy.json lists the model type "${type}", which has no label in MODEL_TYPE_LABELS in src/consts.ts.`,
    );
  }
}
if (CATEGORIES.length === 0) {
  throw new Error('src/taxonomy.json lists no categories.');
}

/** A snippet checked more than this many days ago is flagged for a re-check. */
export { FRESH_DAYS, AGING_DAYS } from './lib/freshness';
