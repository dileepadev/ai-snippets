import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORY_BY_ID, type Category } from '../consts';
import { languagesFromBody } from './code';
import { href } from './url';

export type SnippetEntry = CollectionEntry<'snippets'>;

export { freshnessOf } from './freshness';
export type { Freshness, FreshnessState } from './freshness';
import { freshnessOf, type Freshness } from './freshness';

export interface Snippet {
  id: string;
  slug: string;
  category: Category;
  url: string;
  file: string;
  sourceHost: string;
  languages: string[];
  freshness: Freshness;
  entry: SnippetEntry;
  data: SnippetEntry['data'];
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function toSnippet(entry: SnippetEntry): Snippet {
  const [categoryId, ...rest] = entry.id.split('/');
  const slug = rest.join('/');
  const category = CATEGORY_BY_ID[categoryId ?? ''];
  if (!category) {
    throw new Error(
      `snippets/${entry.id}.md sits in an unknown category folder "${categoryId}". ` +
        'Add the folder to CATEGORIES in src/consts.ts, or move the file.',
    );
  }
  return {
    id: entry.id,
    slug,
    category,
    url: href(`/${entry.id}`),
    file: `snippets/${entry.id}.md`,
    sourceHost: hostOf(entry.data.source),
    languages: languagesFromBody(entry.body ?? ''),
    freshness: freshnessOf(entry.data.verified),
    entry,
    data: entry.data,
  };
}

let cache: Snippet[] | null = null;

/** Every published snippet, newest check first. */
export async function allSnippets(): Promise<Snippet[]> {
  if (cache) return cache;
  const entries = await getCollection('snippets', ({ data }) => !data.draft);
  cache = entries
    .map(toSnippet)
    .sort(
      (a, b) =>
        b.data.verified.getTime() - a.data.verified.getTime() || a.data.title.localeCompare(b.data.title),
    );
  return cache;
}

export interface ProviderGroup {
  provider: string;
  snippets: Snippet[];
}

export function groupByProvider(snippets: Snippet[]): ProviderGroup[] {
  const map = new Map<string, Snippet[]>();
  for (const s of snippets) {
    const list = map.get(s.data.provider) ?? [];
    list.push(s);
    map.set(s.data.provider, list);
  }
  return [...map.entries()]
    .map(([provider, list]) => ({
      provider,
      snippets: list.sort((a, b) => a.data.title.localeCompare(b.data.title)),
    }))
    .sort((a, b) => a.provider.localeCompare(b.provider));
}

export function countByCategory(snippets: Snippet[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of snippets) counts[s.category.id] = (counts[s.category.id] ?? 0) + 1;
  return counts;
}

export function allLanguages(snippets: Snippet[]): string[] {
  const set = new Set<string>();
  for (const s of snippets) for (const l of s.languages) set.add(l);
  return [...set].sort();
}

/**
 * The glob loader stores the Markdown body already rendered to HTML. Reading it
 * directly (rather than using `render()`) lets the code blocks be regrouped into
 * language tabs before they reach the page.
 */
export function renderedHtmlOf(entry: SnippetEntry): string {
  const html = (entry as unknown as { rendered?: { html?: string } }).rendered?.html;
  if (typeof html !== 'string') {
    throw new Error(`snippets/${entry.id}.md has no rendered body.`);
  }
  return html;
}
