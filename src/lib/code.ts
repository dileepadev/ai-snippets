import { languageLabel, sortLanguages } from './languages';

const PRE = /<pre\b[^>]*>[\s\S]*?<\/pre>/g;

function textOf(preHtml: string): string {
  return preHtml
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function langOf(preHtml: string): string {
  return preHtml.match(/data-language="([^"]*)"/)?.[1] ?? 'text';
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

interface Block {
  start: number;
  end: number;
  html: string;
  label: string;
}

/**
 * Rewrites a run of neighbouring code blocks into one widget with a tab per
 * language. The tabs are radio inputs styled with CSS, so switching language
 * works with no JavaScript, every block stays in the page for find-in-page and
 * for search engines, and printing reveals all of them at once.
 */
export function withLanguageTabs(html: string, idPrefix: string): { html: string; languages: string[] } {
  const blocks: Block[] = [];
  for (const m of html.matchAll(PRE)) {
    const raw = m[0];
    blocks.push({
      start: m.index,
      end: m.index + raw.length,
      html: raw,
      label: languageLabel(langOf(raw), textOf(raw)),
    });
  }
  if (blocks.length === 0) return { html, languages: [] };

  // Group blocks that are adjacent in the source, separated only by whitespace.
  const groups: Block[][] = [];
  let current: Block[] = [blocks[0]!];
  for (let i = 1; i < blocks.length; i++) {
    const gap = html.slice(blocks[i - 1]!.end, blocks[i]!.start);
    if (gap.trim() === '') current.push(blocks[i]!);
    else {
      groups.push(current);
      current = [blocks[i]!];
    }
  }
  groups.push(current);

  let out = '';
  let cursor = 0;
  groups.forEach((group, gi) => {
    const first = group[0]!;
    const last = group[group.length - 1]!;
    out += html.slice(cursor, first.start);
    out += renderGroup(group, `${idPrefix}-${gi}`);
    cursor = last.end;
  });
  out += html.slice(cursor);

  return { html: out, languages: sortLanguages(blocks.map((b) => b.label)) };
}

function renderGroup(group: Block[], id: string): string {
  const labels = dedupeLabels(group.map((b) => b.label));
  const single = group.length === 1;

  const inputs = single
    ? ''
    : group
        .map(
          (_, i) =>
            `<input type="radio" name="cg-${id}" id="cg-${id}-${i}" aria-controls="cg-${id}-panel-${i}"${i === 0 ? ' checked' : ''}>`,
        )
        .join('');

  const tabs = single
    ? `<span class="codegroup__static">${escapeAttr(labels[0]!)}</span>`
    : labels
        .map((label, i) => `<label class="codegroup__tab" for="cg-${id}-${i}">${escapeAttr(label)}</label>`)
        .join('');

  const panels = group
    .map(
      (b, i) =>
        `<div class="codegroup__panel" id="cg-${id}-panel-${i}" data-language="${escapeAttr(labels[i] ?? b.label)}">${b.html}</div>`,
    )
    .join('');

  return (
    `<div class="codegroup" role="group" aria-label="Code examples by language" data-languages="${escapeAttr(labels.join(', '))}">` +
    inputs +
    `<div class="codegroup__bar">${tabs}` +
    `<button type="button" class="codegroup__copy" data-copy>Copy</button>` +
    `<button type="button" class="codegroup__download" data-download aria-label="Download visible code">Download</button>` +
    `</div>` +
    `<div class="codegroup__panels">${panels}</div>` +
    `</div>`
  );
}

/** Two Python blocks in one group become "Python" and "Python (2)". */
function dedupeLabels(labels: string[]): string[] {
  const seen = new Map<string, number>();
  return labels.map((label) => {
    const n = (seen.get(label) ?? 0) + 1;
    seen.set(label, n);
    return n === 1 ? label : `${label} (${n})`;
  });
}

/** Languages a snippet covers, read straight from its Markdown fences. */
export function languagesFromBody(body: string): string[] {
  const labels: string[] = [];
  const lines = body.split('\n');
  let fence: string | null = null;
  let lang = '';
  let buffer: string[] = [];

  for (const line of lines) {
    const open = line.match(/^(\s*)(`{3,}|~{3,})\s*([A-Za-z0-9+#._-]*)/);
    if (fence === null) {
      if (open) {
        fence = open[2]!;
        lang = open[3] ?? '';
        buffer = [];
      }
      continue;
    }
    const close = line.match(/^\s*(`{3,}|~{3,})\s*$/);
    if (close && close[1]![0] === fence[0] && close[1]!.length >= fence.length) {
      labels.push(languageLabel(lang, buffer.join('\n')));
      fence = null;
      continue;
    }
    buffer.push(line);
  }

  return sortLanguages(labels);
}
