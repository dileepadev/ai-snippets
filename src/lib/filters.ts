export const filterKeys = ['q', 'category', 'provider', 'language', 'modelType', 'freshness', 'saved', 'sort'] as const;
export type FilterKey = typeof filterKeys[number];
export type FilterState = Record<FilterKey, string>;
export interface SearchRecord {
  id: string; category: string; provider: string; languages: string; modelTypes: string;
  freshness: string; search: string; title: string; verified: string;
}
export function normalize(text: string): string {
  return text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[-_]/g, ' ');
}
export function matchesSnippet(record: SearchRecord, state: FilterState, saved: Set<string>): boolean {
  if (state.category && record.category !== state.category) return false;
  if (state.provider && record.provider !== state.provider) return false;
  if (state.language && !record.languages.split('|').includes(state.language)) return false;
  if (state.modelType && !record.modelTypes.split('|').includes(state.modelType)) return false;
  if (state.freshness && (state.freshness === 'due' ? record.freshness === 'current' : record.freshness !== state.freshness)) return false;
  if (state.saved === '1' && !saved.has(record.id)) return false;
  const haystack = normalize(record.search);
  return normalize(state.q).trim().split(/\s+/).filter(Boolean).every(term => haystack.includes(term));
}
export function compareSnippets(a: SearchRecord, b: SearchRecord, sort: string): number {
  if (sort === 'title') return a.title.localeCompare(b.title);
  if (sort === 'provider') return a.provider.localeCompare(b.provider) || a.title.localeCompare(b.title);
  return b.verified.localeCompare(a.verified) || a.title.localeCompare(b.title);
}
