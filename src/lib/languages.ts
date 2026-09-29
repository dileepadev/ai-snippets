/** Display names for the fenced-code languages snippets actually use. */
const NAMES: Record<string, string> = {
  python: 'Python',
  py: 'Python',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  tsx: 'TypeScript',
  javascript: 'JavaScript',
  js: 'JavaScript',
  jsx: 'JavaScript',
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Shell',
  console: 'Shell',
  powershell: 'PowerShell',
  csharp: 'C#',
  cs: 'C#',
  java: 'Java',
  kotlin: 'Kotlin',
  go: 'Go',
  rust: 'Rust',
  ruby: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  dart: 'Dart',
  json: 'JSON',
  jsonc: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  toml: 'TOML',
  http: 'HTTP',
  sql: 'SQL',
  dockerfile: 'Dockerfile',
  text: 'Text',
  plaintext: 'Text',
};

/**
 * The README asks for the cURL call in a ```bash block, so a shell block whose
 * first command is curl is labelled cURL — that is what a reader is looking for.
 */
export function languageLabel(lang: string, code?: string): string {
  const key = (lang || 'text').toLowerCase();
  const name = NAMES[key];
  if ((name === 'Shell' || !name) && code && /(^|\n)\s*curl\b/.test(code)) return 'cURL';
  return name ?? key.charAt(0).toUpperCase() + key.slice(1);
}

/** Order used when listing the languages a snippet covers, so lists stay comparable. */
const RANK = ['Python', 'TypeScript', 'JavaScript', 'cURL', 'Shell', 'Go', 'Java', 'C#', 'Kotlin', 'Swift', 'Rust', 'Ruby', 'PHP'];

export function sortLanguages(labels: string[]): string[] {
  return [...new Set(labels)].sort((a, b) => {
    const ra = RANK.indexOf(a);
    const rb = RANK.indexOf(b);
    if (ra !== -1 && rb !== -1) return ra - rb;
    if (ra !== -1) return -1;
    if (rb !== -1) return 1;
    return a.localeCompare(b);
  });
}
