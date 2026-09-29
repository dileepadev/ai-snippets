# Commit Message Guidelines

A good commit message says what changed and where, so the history of snippets and site changes is easy to scan and review.

Table of Contents:

- [Commit Message Guidelines](#commit-message-guidelines)
  - [Commit Message Format](#commit-message-format)
    - [`<type>`](#type)
    - [`<scope>`](#scope)
    - [`<short message>`](#short-message)
    - [`<optional issue references>`](#optional-issue-references)
    - [`<optional PR reference>`](#optional-pr-reference)
    - [`<optional longer description>`](#optional-longer-description)
  - [Issue and PR References](#issue-and-pr-references)
    - [Best Practices](#best-practices)
    - [Examples for Issue and PR References](#examples-for-issue-and-pr-references)
    - [Summary Table for Issue and PR Linking (with Scope)](#summary-table-for-issue-and-pr-linking-with-scope)
  - [✅ Summary Examples with All Fields](#-summary-examples-with-all-fields)

## Commit Message Format

Use the following format for commit messages:

```md
<type>(<scope>): <short message> (<optional issue references>) (<optional PR reference>)

<optional longer description>
```

### `<type>`

The `<type>` field indicates the nature of the changes made in the commit. Use one of the following values:

| Type     | Description                                                                              |
|----------|------------------------------------------------------------------------------------------|
| feat     | A new snippet or a new site feature.                                                     |
| fix      | A snippet changed to match its source again, or a bug fix in the site or scripts.        |
| docs     | Documentation updates (e.g., README, contributing guides, community files).              |
| style    | Formatting only, with no change in behavior.                                             |
| refactor | Restructuring site or script code without changing behavior.                             |
| perf     | Performance improvements.                                                                |
| test     | Adding or modifying tests.                                                               |
| chore    | A re-check that only updates `verified` or `packages`, dependencies, CI, or releases.    |

### `<scope>`

The `<scope>` is optional, but recommended. It names the part of the project the commit affects. For a snippet, use its category folder. For example:

| Scope         | Description                                                    |
|---------------|----------------------------------------------------------------|
| model-apis    | Snippets in `snippets/model-apis/` (same for other categories) |
| site          | Pages, components, and styles in `src/`                        |
| scripts       | The validator and generator in `scripts/`                      |
| ci            | Workflows in `.github/workflows/`                              |
| deps          | Dependency updates                                             |
| repo          | Project-wide configuration, setup, or releases                 |

The snippet category scopes are `model-apis`, `local-models`, `agent-sdks`, `frameworks`, `embeddings`, `vision`, `speech`, `image-video`, and `protocols`.

### `<short message>`

A concise summary of what the commit does.

Writing Tips:

- Use the imperative mood (e.g., “Add” not “Added”)
- Capitalize the first letter
- Don’t end with a period
- Keep the whole header under 72 characters, references included
- Be specific (e.g., “Add OpenAI streaming snippet” > “Update snippets”)
- Avoid "I", "this commit", or "fix" as vague verbs

### `<optional issue references>`

Optionally link the commit to relevant issues. Use `fixes`, `closes`, or `resolves` to close an issue when the commit reaches `main`, and `refs` to mention one without closing it. Repeat the keyword for each issue you close, e.g. `(fixes #12, fixes #13)`; `(fixes #12, #13)` closes only #12.

### `<optional PR reference>`

The pull request number, in the format `(#<number>)`, at the end of the header. Pull requests are squash-merged and GitHub appends this automatically, so don't add it to commits on your branch.

### `<optional longer description>`

An optional detailed description of the changes made in the commit. Explain why the change was needed. For a snippet, note the date you compared it against its source and whether you ran the code. Separate this section from the header with a blank line.

## Issue and PR References

Use GitHub keywords to link commits to issues, and let GitHub add the PR number on merge.

### Best Practices

- **Pull Requests**: The `(#<number>)` at the very end of the header is added by GitHub when the pull request is squash-merged.
  - ✅ `(#5)`
  - 🚫 `(pr #5)` or `refs #5` for the PR itself.
- **Issues**: Use `fixes`, `closes`, or `resolves` to close an issue and `refs` to mention one, in parentheses before the PR number. Repeat the closing keyword for each issue.

### Examples for Issue and PR References

**Straightforward PR reference:**

```md
feat(model-apis): Add OpenAI streaming snippet (#5)
```

**Issue + PR:**

```md
fix(vision): Match YOLO snippet to current docs (fixes #42) (#102)
```

**Multiple Issues + PR:**

```md
docs(repo): Add community standards files (refs #1, refs #2) (#5)
```

### Summary Table for Issue and PR Linking (with Scope)

| Purpose                | Example Commit Message                                                    | Result                              |
| ---------------------- | ------------------------------------------------------------------------- | ----------------------------------- |
| Close single issue     | `fix(site): Keep provider filter in the URL (fixes #12) (#100)`           | Closes #12, links PR #100           |
| Reference single issue | `docs(repo): Clarify frontmatter fields (refs #34) (#105)`                | Links issue #34, PR #105            |
| Reference PR Only      | `chore(deps): Bump Astro (#45)`                                           | Links PR #45                        |
| Close multiple issues  | `feat(speech): Add ElevenLabs snippets (fixes #56, fixes #57) (#200)`     | Closes #56, #57, links PR #200      |
| Mixed References       | `fix(scripts): Reject future verified dates (fixes #12, refs #23) (#150)` | Closes #12, refs #23, links PR #150 |
| Re-check only          | `chore(model-apis): Re-check Anthropic create message snippet (#48)`      | Links PR #48                        |

## ✅ Summary Examples with All Fields

```md
feat(model-apis): Add OpenAI streaming snippet (fixes #12) (#101)

Copied from the OpenAI streaming guide. Compared on 2026-09-21; not executed.
```

```md
fix(vision): Match YOLO snippet to current docs (fixes #42) (#102)
```

```md
chore(model-apis): Re-check Anthropic create message snippet (refs #30) (#48)
```

```md
chore(deps): Bump Astro (#45)
```
