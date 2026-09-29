#!/usr/bin/env node
/**
 * Creates a snippet file from the template with today's date already filled in.
 *
 *   npm run new -- model-apis openai-streaming
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const [category, name] = process.argv.slice(2);

// Same list the site builds from, so the two cannot drift apart.
const taxonomy = JSON.parse(readFileSync(join(ROOT, 'src', 'taxonomy.json'), 'utf8'));
const CATEGORIES = taxonomy.categories.map((c) => c.id);

if (!category || !name) {
  console.error('Usage: npm run new -- <category> <provider>-<what-it-does>');
  console.error(`Categories: ${CATEGORIES.join(', ')}`);
  process.exit(1);
}

if (!CATEGORIES.includes(category)) {
  console.error(`Unknown category "${category}". Expected one of: ${CATEGORIES.join(', ')}`);
  process.exit(1);
}

const file = name.endsWith('.md') ? name : `${name}.md`;
const target = join(ROOT, 'snippets', category, file);

if (existsSync(target)) {
  console.error(`${target} already exists.`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const template = readFileSync(join(ROOT, 'snippets', '_TEMPLATE.md'), 'utf8').replace(
  /^verified: .*$/m,
  `verified: ${today}        # date you last checked this against the source`,
);

writeFileSync(target, template);
console.log(`Created snippets/${category}/${file}`);
console.log('Fill in the frontmatter, paste the official code, then run: npm run validate');
