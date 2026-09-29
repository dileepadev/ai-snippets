export const FRESH_DAYS = 120;
export const AGING_DAYS = 240;
export type FreshnessState = 'current' | 'aging' | 'stale';
export interface Freshness { state: FreshnessState; days: number; phrase: string; }
const DAY = 86_400_000;
export function freshnessOf(verified: Date, now: Date = new Date()): Freshness {
  // Compare UTC calendar days so labels do not change halfway through a day.
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const checked = Date.UTC(verified.getUTCFullYear(), verified.getUTCMonth(), verified.getUTCDate());
  const days = Math.max(0, Math.floor((today - checked) / DAY));
  const state: FreshnessState = days <= FRESH_DAYS ? 'current' : days <= AGING_DAYS ? 'aging' : 'stale';
  const phrase = days === 0 ? 'checked today' : days === 1 ? 'checked yesterday' : `checked ${days} days ago`;
  return { state, days, phrase };
}
