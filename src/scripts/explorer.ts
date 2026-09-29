import { filterKeys, matchesSnippet, compareSnippets, type FilterKey, type FilterState, type SearchRecord } from '../lib/filters';
import { readSaved } from '../lib/saved';

const explorer = document.querySelector<HTMLElement>('[data-explorer]');
if (explorer) {
  const form = explorer.querySelector<HTMLFormElement>('[data-filters]')!;
  const container = explorer.querySelector<HTMLElement>('[data-rows]')!;
  const controls = new Map([...explorer.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-filter]')].map(control => [control.dataset.filter as FilterKey, control]));
  const records = [...container.querySelectorAll<HTMLElement>('.row')].map(element => ({ element, data: { ...element.dataset } as unknown as SearchRecord }));
  const count = explorer.querySelector('[data-count]')!;
  const empty = explorer.querySelector<HTMLElement>('[data-empty]')!;
  const chips = explorer.querySelector('[data-active-filters]')!;
  const heading = document.querySelector('[data-browse-heading]');
  const intro = document.querySelector('[data-browse-intro]');
  const defaultIntro = intro?.textContent;
  let updateTimer: ReturnType<typeof setTimeout>;

  function readState(): FilterState {
    return Object.fromEntries(filterKeys.map(key => {
      const control = controls.get(key)!;
      return [key, control instanceof HTMLInputElement && control.type === 'checkbox' ? (control.checked ? '1' : '') : control.value.trim()];
    })) as FilterState;
  }
  function loadURL() {
    const params = new URLSearchParams(location.search);
    controls.forEach((control, key) => {
      const value = params.get(key) ?? (key === 'category' ? explorer!.dataset.initialCategory ?? '' : '');
      if (control instanceof HTMLInputElement && control.type === 'checkbox') control.checked = value === '1';
      else { control.value = value; if (control instanceof HTMLSelectElement && control.selectedIndex < 0) control.value = ''; }
    });
    if (params.get('freshness') || params.get('modelType')) explorer!.querySelector('details')!.open = true;
    render();
  }
  function syncURL(push: boolean) {
    const url = new URL(location.href);
    const state = readState();
    // An explicit empty category overrides a category page's default.
    for (const key of filterKeys) {
      if (state[key] || (key === 'category' && explorer!.dataset.initialCategory)) url.searchParams.set(key, state[key]);
      else url.searchParams.delete(key);
    }
    if (url.href !== location.href) history[push ? 'pushState' : 'replaceState'](null, '', url);
  }
  function render() {
    const state = readState();
    const saved = readSaved();
    let visible = 0;
    records.sort((a, b) => compareSnippets(a.data, b.data, state.sort));
    const fragment = document.createDocumentFragment();
    for (const record of records) {
      record.element.hidden = !matchesSnippet(record.data, state, saved);
      if (!record.element.hidden) visible++;
      fragment.append(record.element);
    }
    container.append(fragment);
    count.textContent = `${visible} ${visible === 1 ? 'snippet' : 'snippets'}${visible !== records.length ? ` of ${records.length}` : ''}`;
    empty.hidden = visible > 0;
    const savedEmpty = state.saved === '1' && saved.size === 0;
    explorer!.querySelector('[data-empty-title]')!.textContent = savedEmpty ? 'Your next useful snippet belongs here' : 'No snippets found';
    explorer!.querySelector('[data-empty-description]')!.textContent = savedEmpty ? 'Use the bookmark button on any snippet to save it here. Your library stays in this browser.' : 'Try a broader search or remove a filter to see more examples.';
    if (heading) heading.textContent = state.saved === '1' ? 'Your saved snippets' : 'Find your next building block.';
    if (intro) intro.textContent = state.saved === '1' ? 'Your personal shortlist, saved on this browser. Pick up where you left off.' : defaultIntro ?? '';
    const savedNav = document.querySelector('[data-saved-nav]');
    const allNav = document.querySelector('.side-link[href$="/browse"]');
    if (heading) {
      savedNav?.toggleAttribute('aria-current', state.saved === '1');
      allNav?.toggleAttribute('aria-current', state.saved !== '1');
      if (state.saved === '1') savedNav?.setAttribute('aria-current', 'page');
      else allNav?.setAttribute('aria-current', 'page');
    }
    chips.replaceChildren();
    for (const key of filterKeys.filter(k => k !== 'sort')) {
      if (!state[key]) continue;
      const control = controls.get(key)!;
      const label = control instanceof HTMLSelectElement ? control.selectedOptions[0]?.textContent : key === 'saved' ? 'Saved only' : `“${state[key]}”`;
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = `${label} ×`; button.setAttribute('aria-label', `Remove ${label} filter`);
      button.addEventListener('click', () => {
        if (control instanceof HTMLInputElement && control.type === 'checkbox') control.checked = false;
        else control.value = '';
        clearTimeout(updateTimer); syncURL(true); render(); controls.get('q')?.focus();
      });
      chips.append(button);
    }
  }
  controls.forEach((control, key) => control.addEventListener(key === 'q' ? 'input' : 'change', () => {
    clearTimeout(updateTimer);
    render();
    if (key === 'q') updateTimer = setTimeout(() => syncURL(false), 180);
    else syncURL(true);
  }));
  function reset() {
    clearTimeout(updateTimer);
    controls.forEach(control => { if (control instanceof HTMLInputElement && control.type === 'checkbox') control.checked = false; else control.value = ''; });
    syncURL(true); render(); controls.get('q')?.focus();
  }
  form.addEventListener('reset', (event) => { event.preventDefault(); reset(); });
  form.addEventListener('submit', (event) => { event.preventDefault(); clearTimeout(updateTimer); syncURL(true); render(); });
  explorer.querySelector('[data-clear-all]')?.addEventListener('click', reset);
  window.addEventListener('popstate', () => { clearTimeout(updateTimer); loadURL(); });
  document.addEventListener('saved-change', render);
  document.addEventListener('freshness-update', () => {
    records.forEach(record => { record.data.freshness = record.element.dataset.freshness ?? 'stale'; });
    render();
  });
  loadURL();
}
