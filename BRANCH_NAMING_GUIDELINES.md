# Branch Naming Guidelines

Name a branch `<type>/<short-description>`, in lowercase with hyphens between words.

## Protected branch

`main` is the only long-lived branch. It is what gets deployed to GitHub Pages, so changes reach it through pull requests only. Don't commit to it directly.

## Branch types

| Branch | Use it for |
| --- | --- |
| `snippet/x` | Adding a new snippet |
| `recheck/x` | Re-checking an existing snippet against its source, or updating it to match |
| `fix/x` | Fixing a bug in the site, scripts, or a snippet's metadata |
| `feat/x` | Adding or changing site functionality |
| `docs/x` | Documentation and community files |
| `test/x` | Adding or changing tests |
| `chore/x` | Dependencies, CI, and other maintenance |

The other commit types, `style`, `refactor`, and `perf`, work as prefixes too.

## Examples

- `snippet/openai-streaming` - Add the OpenAI streaming snippet.
- `recheck/anthropic-create-message` - Re-check a snippet against its source.
- `fix/search-filter-url` - Fix a filter that dropped its URL parameter.
- `feat/saved-list-export` - Add a site feature.
- `docs/contributing` - Update the contributing guide.
- `chore/astro-upgrade` - Upgrade a dependency.
