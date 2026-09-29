const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Prefix an in-site path with the configured base (`/ai-snippets` on GitHub Pages). */
export function href(path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean === '/' ? '/' : clean}`;
}

/** True when `pathname` is `path` or a page underneath it, ignoring trailing
    slashes. Used to mark the current section in the nav. */
export function isWithin(pathname: string, path: string): boolean {
  const a = pathname.replace(/\/+$/, '') || '/';
  const b = href(path).replace(/\/+$/, '') || '/';
  return a === b || a.startsWith(`${b}/`);
}
