export const SAVED_KEY = 'ai-snippets-saved';
export function readSaved(storage?: Pick<Storage, 'getItem'>): Set<string> {
  try {
    const value: unknown = JSON.parse((storage ?? globalThis.localStorage).getItem(SAVED_KEY) ?? '[]');
    return new Set(Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []);
  } catch { return new Set(); }
}
