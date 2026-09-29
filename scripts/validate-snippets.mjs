#!/usr/bin/env node
/**
 * Checks every file under snippets/ against the rules in the README before it
 * reaches a pull request: correct folder, complete frontmatter, a real source
 * link, a date that is not in the future, at least one code block, and no
 * hard-coded API keys.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SNIPPETS = join(ROOT, 'snippets');

// Same list the site builds from, so the two cannot drift apart.
const taxonomy = JSON.parse(readFileSync(join(ROOT, 'src', 'taxonomy.json'), 'utf8'));
const CATEGORIES = taxonomy.categories.map((c) => c.id);
const MODEL_TYPES = taxonomy.modelTypes;

/** Literal keys that must never be committed. Placeholders are fine. */
const KEY_PATTERNS = [
  /\bsk-[A-Za-z0-9]{20,}/,
  /\bsk-ant-[A-Za-z0-9-]{20,}/,
  /\bAIza[0-9A-Za-z_-]{30,}/,
  /\bgsk_[A-Za-z0-9]{20,}/,
  /\bxai-[A-Za-z0-9]{20,}/,
  /\bhf_[A-Za-z0-9]{30,}/,
  /\bAKIA[0-9A-Z]{16}\b/,
];

const PLACEHOLDER = /(YOUR|MY|EXAMPLE|PLACEHOLDER|XXXX|\.\.\.|<|\$\{|process\.env|os\.environ|getenv)/i;

/** The site turns neighbouring code blocks into one tabbed widget, and the CSS
    that drives the tabs covers this many positions. */
const MAX_TABS_PER_GROUP = 14;

/**
 * Splits a body into code blocks, recording whether each one directly follows
 * the previous with nothing but blank lines between them -- the same rule the
 * site uses to decide what becomes one tab group.
 */
function codeBlocks(body) {
  const lines = body.split('\n');
  const blocks = [];
  let fence = null;
  let lang = '';
  let openedAt = 0;
  let lastCloseLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (fence === null) {
      const open = line.match(/^\s*(`{3,}|~{3,})\s*([A-Za-z0-9+#._-]*)/);
      if (open) {
        fence = open[1];
        lang = open[2] ?? '';
        openedAt = i;
      }
      continue;
    }
    const close = line.match(/^\s*(`{3,}|~{3,})\s*$/);
    if (close && close[1][0] === fence[0] && close[1].length >= fence.length) {
      const gap = lastCloseLine === -1 ? null : lines.slice(lastCloseLine + 1, openedAt);
      blocks.push({
        lang,
        line: openedAt + 1,
        adjacent: gap !== null && gap.every((l) => l.trim() === ''),
      });
      lastCloseLine = i;
      fence = null;
    }
  }
  return { blocks, unclosed: fence !== null };
}

const problems = [];
const warnings = [];
let checked = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith('.md')) check(full);
  }
}

function check(file) {
  const rel = relative(ROOT, file).split(sep).join('/');
  const parts = relative(SNIPPETS, file).split(sep);
  const name = parts[parts.length - 1];

  if (name.startsWith('_')) return;
  const fail = (message) => problems.push(`${rel}: ${message}`);
  const warn = (message) => warnings.push(`${rel}: ${message}`);
  checked++;

  if (parts.length !== 2) {
    fail('must sit directly inside a category folder, as snippets/<category>/<file>.md');
    return;
  }
  if (!CATEGORIES.includes(parts[0])) {
    fail(`unknown category folder "${parts[0]}". Expected one of: ${CATEGORIES.join(', ')}`);
    return;
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(name)) {
    fail(`file name "${name}" should be lowercase words joined by hyphens, e.g. openai-streaming.md`);
  }

  const raw = readFileSync(file, 'utf8');
  let data;
  let body;
  try {
    ({ data, content: body } = matter(raw));
  } catch (error) {
    fail(`frontmatter will not parse: ${error.message}`);
    return;
  }

  for (const field of ['title', 'provider', 'product', 'description', 'model_types', 'source', 'verified', 'prerequisites', 'expected_output']) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      fail(`missing required frontmatter field "${field}"`);
    }
  }

  if (!Array.isArray(data.prerequisites) || data.prerequisites.length === 0 || data.prerequisites.some(item => typeof item !== 'string' || !item.trim())) {
    fail('prerequisites must be a non-empty list of setup requirements');
  }
  for (const field of ['description', 'expected_output']) {
    if (typeof data[field] !== 'string' || !data[field].trim()) fail(`${field} must be a non-empty string`);
  }
  for (const field of ['caveat', 'package_notes']) {
    if (data[field] !== undefined && (typeof data[field] !== 'string' || !data[field].trim())) fail(`${field} must be a non-empty string when provided`);
  }
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some(tag => typeof tag !== 'string'))) {
    fail('tags must be a list of strings');
  }

  if (data.model_types !== undefined) {
    if (!Array.isArray(data.model_types) || data.model_types.length === 0) {
      fail('model_types must be a non-empty list');
    } else {
      for (const type of data.model_types) {
        if (!MODEL_TYPES.includes(type)) {
          fail(`model_types has "${type}"; expected one of: ${MODEL_TYPES.join(', ')}`);
        }
      }
    }
  }

  if (typeof data.source === 'string') {
    try {
      const url = new URL(data.source);
      if (url.protocol !== 'https:') fail('source must be an https URL');
    } catch {
      fail(`source "${data.source}" is not a URL`);
    }
  }

  if (data.verified !== undefined) {
    const date = data.verified instanceof Date ? data.verified : new Date(String(data.verified));
    if (Number.isNaN(date.getTime())) fail(`verified "${data.verified}" is not a date (use YYYY-MM-DD)`);
    else if (date.getTime() > Date.now() + 86_400_000) fail('verified is in the future');
  }

  if (data.packages !== undefined && (!data.packages || typeof data.packages !== 'object' || Array.isArray(data.packages))) {
    fail('packages must be a map of language to version spec');
  }
  if ((!data.packages || Object.keys(data.packages).length === 0) && !data.package_notes) {
    warn('no packages recorded; record observed versions or explain the absence in package_notes');
  }
  if (data.packages && typeof data.packages === 'object' && !Array.isArray(data.packages)) {
    for (const spec of Object.values(data.packages)) if (typeof spec !== 'string' || !spec.trim()) fail('each package version must be a non-empty string');
  }

  if (data.resources !== undefined) {
    if (!Array.isArray(data.resources)) fail('resources must be a list');
    else
      for (const resource of data.resources) {
        if (!resource || typeof resource.label !== 'string' || typeof resource.url !== 'string') {
          fail('each resource needs a label and a url');
          break;
        }
        try { if (new URL(resource.url).protocol !== 'https:') fail('resource URLs must use https'); }
        catch { fail('resource URL is invalid'); }
      }
  }

  const { blocks, unclosed } = codeBlocks(body);
  if (blocks.length === 0) fail('has no code block');
  if (unclosed) fail('has an unclosed code block');

  if (blocks.some((b) => b.lang === '')) {
    warn('some code blocks have no language label, so they will be tabbed as "Text"');
  }

  // Runs of neighbouring blocks become one tab group on the site.
  let run = 0;
  for (const block of blocks) {
    run = block.adjacent ? run + 1 : 1;
    if (run > MAX_TABS_PER_GROUP) {
      fail(
        `line ${block.line}: more than ${MAX_TABS_PER_GROUP} code blocks in a row. ` +
          'The site renders a run of neighbouring blocks as one set of language tabs and ' +
          'only styles that many, so split the run with a line of prose.',
      );
      break;
    }
  }

  for (const line of raw.split('\n')) {
    for (const pattern of KEY_PATTERNS) {
      const hit = line.match(pattern);
      if (hit && !PLACEHOLDER.test(hit[0])) {
        fail(`looks like a real API key on this line: ${line.trim().slice(0, 60)}`);
      }
    }
  }
}

walk(SNIPPETS);

for (const warning of warnings) console.warn(`warning  ${warning}`);
for (const problem of problems) console.error(`error    ${problem}`);

const summary = `${checked} snippet${checked === 1 ? '' : 's'} checked, ${problems.length} error${
  problems.length === 1 ? '' : 's'
}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`;

if (problems.length > 0) {
  console.error(`\n${summary}`);
  process.exit(1);
}
console.log(summary);
