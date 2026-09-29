import { readSaved, SAVED_KEY } from '../lib/saved';
import { freshnessOf } from '../lib/freshness';

function refreshDates() {
  document.querySelectorAll<HTMLElement>('.freshness[data-verified]').forEach(element => {
    const iso = element.dataset.verified!;
    const freshness = freshnessOf(new Date(iso));
    element.dataset.state = freshness.state;
    const time = element.querySelector('time');
    if (time) time.textContent = element.dataset.long === 'true' ? `${freshness.phrase}, on ${iso}` : freshness.phrase;
  });
  document.querySelectorAll<HTMLElement>('.row[data-verified]').forEach(element => {
    element.dataset.freshness = freshnessOf(new Date(element.dataset.verified!)).state;
  });
  document.querySelectorAll<HTMLElement>('[data-check-warning]').forEach(element => {
    element.hidden = freshnessOf(new Date(element.dataset.verified!)).state === 'current';
  });
  document.dispatchEvent(new Event('freshness-update'));
}
refreshDates();
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshDates(); });

let timer: ReturnType<typeof setTimeout>;
function toast(message: string) {
  const element = document.querySelector<HTMLElement>('[data-toast]');
  if (!element) return;
  clearTimeout(timer);
  element.textContent = message;
  element.hidden = false;
  timer = setTimeout(() => { element.hidden = true; }, 3000);
}

function paintSaved() {
  const ids = readSaved();
  document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach((button) => {
    const saved = ids.has(button.dataset.save!);
    button.setAttribute('aria-pressed', String(saved));
    button.setAttribute('aria-label', `${saved ? 'Unsave' : 'Save'} ${button.dataset.saveTitle}`);
    button.title = saved ? 'Remove from saved snippets' : 'Save snippet';
    const label = button.querySelector('[data-save-label]');
    if (label) label.textContent = saved ? 'Saved' : 'Save snippet';
  });
  document.querySelectorAll('[data-saved-count]').forEach((el) => { el.textContent = String(ids.size); });
}
paintSaved();
window.addEventListener('storage', (event) => {
  if (event.key === SAVED_KEY || event.key === null) {
    paintSaved();
    document.dispatchEvent(new Event('saved-change'));
  }
});

document.addEventListener('click', async (event) => {
  if (!(event.target instanceof Element)) return;
  const save = event.target.closest<HTMLButtonElement>('[data-save]');
  if (save) {
    const ids = readSaved();
    const id = save.dataset.save!;
    const wasSaved = ids.has(id);
    wasSaved ? ids.delete(id) : ids.add(id);
    try { localStorage.setItem(SAVED_KEY, JSON.stringify([...ids])); }
    catch { toast('Saving is unavailable because browser storage is blocked.'); return; }
    paintSaved();
    document.dispatchEvent(new Event('saved-change'));
    toast(wasSaved ? 'Removed from saved snippets' : 'Saved to your library on this browser');
  }
  const button = event.target.closest<HTMLButtonElement>('[data-copy], [data-download]');
  if (!button) return;
  const group = button.closest('.codegroup');
  const inputs = [...(group?.querySelectorAll<HTMLInputElement>(':scope > input[type="radio"]') ?? [])];
  const selected = Math.max(0, inputs.findIndex(input => input.checked));
  const panel = group?.querySelectorAll<HTMLElement>('.codegroup__panel')[selected];
  const pre = panel?.querySelector('pre');
  const code = pre?.textContent;
  if (!code) return;
  if (button.hasAttribute('data-download')) {
    const extensions: Record<string, string> = { Python: 'py', TypeScript: 'ts', JavaScript: 'js', 'cURL': 'sh', Bash: 'sh', Go: 'go', Java: 'java', 'C#': 'cs' };
    const language = panel?.dataset.language?.replace(/ \(\d+\)$/, '') ?? '';
    const url = URL.createObjectURL(new Blob([code + '\n'], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${location.pathname.split('/').filter(Boolean).pop() ?? 'snippet'}.${extensions[language] ?? 'txt'}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  try {
    await navigator.clipboard.writeText(code);
    button.textContent = 'Copied!';
    button.dataset.copied = 'true';
    toast('Code copied to clipboard');
  } catch {
    if (pre) {
      const range = document.createRange();
      range.selectNodeContents(pre);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    toast('Code selected. Press Ctrl+C or ⌘C to copy.');
  }
  setTimeout(() => { button.textContent = 'Copy'; delete button.dataset.copied; }, 1800);
});

document.querySelector<HTMLButtonElement>('[data-menu]')?.addEventListener('click', (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(open));
  document.querySelector('.sidebar')?.classList.toggle('is-open', open);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelector('.sidebar')?.classList.remove('is-open');
    document.querySelector('[data-menu]')?.setAttribute('aria-expanded', 'false');
  }
  const target = event.target;
  if (target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable)) return;
  if ((event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) || ((event.metaKey || event.ctrlKey) && event.key === 'k')) {
    event.preventDefault();
    const search = document.querySelector<HTMLInputElement>('[data-search-input]');
    if (search) { search.focus(); search.scrollIntoView({ block: 'center' }); }
    else document.querySelector<HTMLAnchorElement>('.header-search')?.click();
  }
});
