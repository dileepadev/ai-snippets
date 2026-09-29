# Pull Request Guidelines

## Title

Use the same format as a [commit message](COMMIT_MESSAGE_GUIDELINES.md) header:

```text
<type>(<scope>): <message>
```

Pull requests are squash-merged, so the title becomes the commit message on `main`. Leave the PR number out; GitHub adds it.

- `<type>` is one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, or `chore`. For snippets: `feat` to add one, `fix` to change its code to match the source, `chore` for a re-check that changed nothing but dates or versions.
- `<scope>` is optional and names the area you changed. For a snippet, use its category folder; otherwise use `site`, `scripts`, `ci`, `deps`, or `repo`.
- `<message>` is a short imperative summary, starting with a capital letter and without a final period.

Examples:

- `feat(model-apis): Add OpenAI streaming snippet`
- `fix(vision): Match YOLO snippet to current docs`
- `fix(site): Keep provider filter in the URL`
- `chore(model-apis): Re-check Anthropic create message snippet`
- `docs: Clarify frontmatter fields`
- `chore(deps): Bump Astro`

## Description

To close an issue on merge, write `Fixes #12` in the description, once per issue. Then fill in the [pull request template](.github/PULL_REQUEST_TEMPLATE.md). For a snippet, that means:

- the exact official page the code came from,
- the date you compared it, and the package versions if you know them,
- whether you ran the code. A source check is not a runtime test, so say so if you did not.

## Before you open it

- `npm run validate`, `npm run build`, and `npm test` pass. CI runs all three.
- The change is focused. Put unrelated changes in a separate pull request.
- One snippet per pull request is easiest to review, but a batch from one provider is fine.

## Review

A maintainer checks that the source is official, the code matches it, and no keys are included. Expect requests to fix the source link or dates before merging.
