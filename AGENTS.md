# AGENTS.md

Instructions for AI coding agents working in this repository. This is the single source of agent instructions. `CLAUDE.md` and `.github/copilot-instructions.md` only point here, so put any new guidance in this file.

## Project

ai-snippets is a static [Astro](https://astro.build) site that collects code snippets for AI model APIs, agent SDKs, and frameworks. Every snippet is copied from an official source, links to that source, and records the date it was last compared. The site is deployed to GitHub Pages at <https://dileepadev.github.io/ai-snippets>.

## Layout

| Path | Contents |
| --- | --- |
| `snippets/<category>/<provider>-<what-it-does>.md` | One snippet per file: YAML frontmatter plus one code block per language |
| `snippets/_TEMPLATE.md` | Template used by `npm run new`; skipped by the site |
| `src/taxonomy.json` | The single list of categories and model types, shared by the site and the scripts |
| `src/content.config.ts` | Frontmatter schema for the site build |
| `src/pages/`, `src/components/`, `src/layouts/`, `src/lib/`, `src/scripts/`, `src/styles/` | Site code |
| `scripts/validate-snippets.mjs`, `scripts/new-snippet.mjs` | Snippet validator and generator |
| `tests/library.test.mjs` | Tests that run against the built site in `dist/` |
| `.github/workflows/` | CI (`ci.yml`) and Pages deployment (`deploy.yml`) |

## Commands

```bash
npm install
npm run dev                            # http://localhost:4321/ai-snippets
npm run new -- <category> <file-name>  # create a snippet from the template
npm run validate                       # check every snippet file
npm run build                          # astro check, then build to dist/
npm test                               # needs a fresh `npm run build` first
```

CI runs `validate`, `build`, and `test`. Run all three before you call a change done, and report failures as they are.

## Snippet rules

These rules are the point of the project. Breaking them makes a snippet wrong even if it builds.

- **Never write snippet code.** Don't generate, reconstruct from memory, complete, refactor, restyle, or fix code inside a snippet's code blocks. Code comes only from vendor docs, official SDK repos, or official cookbooks.
- **Copy from a page you actually read.** When adding or updating a snippet, fetch the source page in this session and copy its code exactly. If you can't fetch it, stop and say so; don't fill in from memory.
- **`source` is the exact page**, anchor included, over https.
- **`verified` is a comparison date, not a test result.** Set it to today only when you compared the snippet against its source in this session. Never advance it for metadata-only edits. Never claim the code was run unless it was.
- **Don't invent package versions.** Record `packages` only from what the source or a real install shows. Otherwise explain the gap in `package_notes`.
- **No real keys.** Keep the environment variables and placeholders that the source uses.
- Editorial fields (`description`, `prerequisites`, `expected_output`, `caveat`) are written by us and should be derived from the source page and its linked docs.

The frontmatter fields are listed in [CONTRIBUTING.md](CONTRIBUTING.md#frontmatter). To add a category or model type, edit `src/taxonomy.json`; a new model type also needs a label in `MODEL_TYPE_LABELS` in `src/consts.ts`.

## Site code

- TypeScript in strict mode. Match the style of the file you're editing.
- Keep the site static: no server, accounts, or tracking. Saved lists live in the browser and must keep working when storage is blocked.
- Add or update a test in `tests/library.test.mjs` when you change how the site behaves.

## Git and pull requests

- Don't commit to `main`. Branch as in [BRANCH_NAMING_GUIDELINES.md](BRANCH_NAMING_GUIDELINES.md).
- Write commit messages and PR titles as in [COMMIT_MESSAGE_GUIDELINES.md](COMMIT_MESSAGE_GUIDELINES.md) and [PULL_REQUEST_GUIDELINES.md](PULL_REQUEST_GUIDELINES.md).
- Fill in [the PR template](.github/PULL_REQUEST_TEMPLATE.md), including whether the code was run.
- Report security problems through [SECURITY.md](SECURITY.md), never in a public issue.
