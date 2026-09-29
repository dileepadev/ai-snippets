# Contributing

Thanks for helping keep this library accurate. A snippet is one Markdown file. The frontmatter records where the code came from and when it was last checked; the body holds one code block per language the source shows.

By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Add a snippet

1. Find the example in the provider's official docs, SDK repo, or cookbook.
2. Create the file:

   ```bash
   npm run new -- model-apis openai-streaming
   ```

   That writes `snippets/model-apis/openai-streaming.md` from the template with today's date filled in. Name files `<provider>-<what-it-does>`, in lowercase words joined by hyphens. Category folders are `model-apis`, `local-models`, `agent-sdks`, `frameworks`, `embeddings`, `vision`, `speech`, `image-video`, and `protocols`.

3. Fill in the frontmatter and paste the code, one block per language.
4. Check it:

   ```bash
   npm run validate
   ```

5. Open a pull request with the source link in the description.

## Re-check an existing snippet

This helps as much as adding a new one. Open the snippet's source and compare the code. If it still matches, update `verified` and `packages`. If it changed, copy the new code as published, then update them. Either way, open a pull request. The site flags snippets that have not been checked in a while and lists them on the [Contribute page](https://dileepadev.github.io/ai-snippets/contribute).

## Frontmatter

| Field | Required | What it holds |
| --- | --- | --- |
| `title` | yes | What the snippet does, in plain words |
| `provider` | yes | Who publishes it, e.g. `Anthropic` |
| `product` | yes | Which product or SDK, e.g. `Messages API` |
| `description` | yes | One line describing what the example does |
| `prerequisites` | yes | Non-empty list of SDK, credentials, hardware, files, and setup requirements |
| `expected_output` | yes | What the code returns, prints, or creates |
| `caveat` | no | Omitted imports, placeholders, or other limits of an excerpt |
| `model_types` | yes | Any of `llm`, `slm`, `vision`, `speech`, `embeddings`, `image`, `video` |
| `source` | yes | The exact page the code came from, anchor included |
| `verified` | yes | The day you last checked it, as `YYYY-MM-DD` |
| `packages` | no | Map of language to version spec |
| `package_notes` | if unrecorded | Explain why package versions have not been recorded; do not invent pins |
| `resources` | no | List of `{ label, url }` for docs, API reference, SDK repo, cookbook |
| `tags` | no | Free-form list, e.g. `[streaming, tool-use]` |
| `draft` | no | `true` keeps the file out of the built site |

## What gets rejected

Setup notes and expected results are editorial context, separate from the official code. Derive them from the example and linked documentation, and keep the source code unchanged. `verified` means the source was compared, not that the code was executed. Record runtime testing separately in your pull request, and never advance a check date just because you edited the page's metadata.

- **Code from anywhere but an official source.** Vendor docs, official SDK repos, and official cookbooks only. No blog posts, no tutorials, no AI-written code.
- **Snippets tidied up on the way in.** Don't refactor, restyle, or fix a snippet. If the official version is broken, report it upstream and say so in the pull request.
- **A missing or approximate source link.** The link goes to the exact page the code was copied from.
- **Real API keys.** Use environment variables or placeholders, the way the official docs do.

## Changing the site

The site is [Astro](https://astro.build), with code in `src/` and helper scripts in `scripts/`.

```bash
npm install
npm run dev       # http://localhost:4321/ai-snippets
npm run validate  # check every snippet file
npm run build     # type-check and build to dist/
npm test          # test filtering, saved state, code controls, and generated links
npm run preview   # serve the build
```

Run `npm run validate`, `npm run build`, and `npm test` before opening a pull request; CI runs the same three. Keep pull requests focused, and add or update a test when you change how the site behaves.

## Pull request workflow

1. Fork the repository and clone your fork.
2. Create a branch from `main`, named as in the [branch naming guidelines](BRANCH_NAMING_GUIDELINES.md).
3. Commit using the [commit message guidelines](COMMIT_MESSAGE_GUIDELINES.md).
4. Push, then open a pull request titled as in the [pull request guidelines](PULL_REQUEST_GUIDELINES.md). The [template](.github/PULL_REQUEST_TEMPLATE.md) asks for the source link and check date.

## Other ways to help

Use the issue templates to report a [missing snippet](https://github.com/dileepadev/ai-snippets/issues/new?template=missing-snippet.md), flag an [out-of-date snippet](https://github.com/dileepadev/ai-snippets/issues/new?template=out-of-date.md), report a [site bug](https://github.com/dileepadev/ai-snippets/issues/new?template=bug_report.md), or suggest a [site feature](https://github.com/dileepadev/ai-snippets/issues/new?template=feature_request.md). Security problems go through [SECURITY.md](SECURITY.md), not a public issue.

## Questions

Open an issue, or email **<contact@dileepa.dev>**.
