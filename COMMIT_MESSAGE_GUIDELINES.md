# Commit Message Guidelines

A good commit message says what changed and where, so the history is easy to scan.

## Format

```text
<type>(<scope>): <short message> (<issue references>)

<longer description>

<footer>
```

Only `<type>` and `<short message>` are required.

### Type

| Type | Use it for |
| --- | --- |
| `feat` | A new snippet or a new site feature |
| `fix` | A correction to a snippet, the site, or the tooling |
| `docs` | Documentation and community files |
| `style` | Formatting only, with no change in behavior |
| `refactor` | Restructuring code without changing behavior |
| `perf` | Performance improvements |
| `test` | Adding or changing tests |
| `chore` | Re-checks that only update `verified` or `packages`, dependencies, CI, releases, and other maintenance |

A snippet change is `feat` when it adds a snippet, `fix` when it changes the code to match the source again, and `chore` when a re-check found nothing to change.

### Scope

The scope is optional and names the area you changed. For a snippet, use its category folder. Leave it out when the type already says it all, as in `docs: Fix typo`.

| Scope | Covers |
| --- | --- |
| `model-apis`, `local-models`, `agent-sdks`, `frameworks`, `embeddings`, `vision`, `speech`, `image-video`, `protocols` | Snippets in that `snippets/` folder |
| `site` | Pages, components, and styles in `src/` |
| `scripts` | `scripts/` |
| `ci` | `.github/workflows/` |
| `deps` | Dependency updates |
| `repo` | Anything that spans the repository |

### Short message

- Use the imperative mood: "Add", not "Added".
- Start with a capital letter and leave off the final period.
- Keep the whole header to 72 characters or fewer, references included.
- Be specific: "Add OpenAI streaming snippet" beats "Update snippets".

### Issue references

- To close an issue when the commit reaches `main`, use `fixes`, `closes`, or `resolves`. Repeat the keyword for each issue: `(fixes #12, fixes #13)`. A bare `(fixes #12, #13)` closes only #12.
- To mention an issue without closing it, use `refs #12`.
- Don't add the pull request number yourself. Pull requests are squash-merged, and GitHub appends `(#<number>)` to the header.

### Longer description

Optional. Separate it from the header with a blank line and explain why the change was needed. For a re-check, note the date you compared against the source and whether you ran the code.

### Breaking changes

For a change that counts as MAJOR in [VERSIONING.md](VERSIONING.md), add `!` after the scope and explain it in a footer:

```text
feat(site)!: Rename the vision category to image-input

BREAKING CHANGE: Snippet URLs under /vision/ now live under /image-input/.
```

## Examples

These show the header as it lands on `main`, with the PR number GitHub adds on merge.

```text
feat(model-apis): Add OpenAI streaming snippet (#31)
```

```text
fix(vision): Match YOLO snippet to current docs (fixes #42) (#45)

The source changed the predict call. Compared on 2026-09-21; not executed.
```

```text
chore(model-apis): Re-check Anthropic create message snippet (#47)
```

```text
fix(site): Keep provider filter in the URL (fixes #12) (#100)
```

```text
docs: Clarify frontmatter fields (#50)
```

```text
chore(deps): Bump Astro (#52)
```
