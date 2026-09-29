# ai-snippets

[![Last commit](https://img.shields.io/github/last-commit/dileepadev/ai-snippets)](https://github.com/dileepadev/ai-snippets/commits/main)
[![License](https://img.shields.io/github/license/dileepadev/ai-snippets)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](#contributing)

Official code snippets for AI model APIs, agent SDKs, and frameworks, in one place.

It covers LLMs, SLMs, vision, speech, embeddings, and image and video generation. Every snippet is copied from an official source, links back to it, and shows when it was last checked.

**[Browse the site →](https://dileepadev.github.io/ai-snippets)**

## Using the library

- Search by task, provider, SDK, language, or setup requirement. Combine category,
  provider, language, model type, and source-check filters; the URL keeps your selection.
- Save snippets to a personal shortlist in your browser. No account is required;
  saved items do not sync between devices.
- Follow six task-based collections: first API calls, local models, agents, document
  search, streaming, and multimodal examples.
- Read prerequisites, expected output, and excerpt caveats before copying code.
  Copy or download the selected language directly from each code group.
- Press `/` or `Ctrl/⌘ K` to focus search. Light, dark, and system themes are supported.

Source-check dates update their displayed age when a page is opened. A source check
is not a runtime test; recorded package versions are shown separately. New entries
without observed version pins explicitly explain that gap.

## Why this exists

Every AI provider documents its SDKs on its own site, in its own layout, and the code changes often. Tutorials and blog posts copy those examples and then fall out of date. This repo keeps the official versions side by side. Each one links to the page it came from and records the last time someone checked it against that page.

## What's inside

Snippets live under `snippets/`, with one folder per category.

| Category | Folder | Examples |
| --- | --- | --- |
| Model APIs | `model-apis/` | OpenAI, Anthropic, Google Gemini, Mistral, Cohere, Groq |
| SLMs and local models | `local-models/` | Ollama, Hugging Face Transformers, vLLM |
| Agent SDKs | `agent-sdks/` | OpenAI Agents SDK, Claude Agent SDK, Google ADK |
| Frameworks | `frameworks/` | LangChain, LangGraph, LlamaIndex, Pydantic AI, Vercel AI SDK |
| Embeddings | `embeddings/` | OpenAI, Sentence Transformers |
| Vision | `vision/` | Anthropic image input, Ultralytics YOLO |
| Speech | `speech/` | OpenAI speech and transcription, ElevenLabs |
| Image and video generation | `image-video/` | OpenAI image generation, Google Imagen and Veo |
| Protocols | `protocols/` | Model Context Protocol (MCP) Python and TypeScript SDKs |

Each snippet lists the languages actually included in its source excerpts. That's usually Python, TypeScript, and cURL, plus C#, Java, or Go where available. Entries also link to the official docs, API reference, SDK repo, and cookbook where they exist.

## Ground rules

1. **Official sources only.** Snippets come from vendor docs, official SDK repos, and official cookbooks. No blog posts, third-party tutorials, or AI-written code.
2. **Copied as published.** Don't refactor, restyle, or fix a snippet. If the official version is broken, report it upstream instead of patching it here.
3. **Always linked.** Every snippet points to the exact page it came from.
4. **Always dated.** Every snippet records its last source comparison. Package versions are recorded when available; unknown versions are stated explicitly. Source review does not imply execution.
5. **No real keys.** Use environment variables or placeholders, the way the official docs do.

## Contributing

1. Find the example in the provider's official docs, SDK repo, or cookbook.
2. Create a Markdown file in the matching category folder, named `<provider>-<what-it-does>.md`. For example: `snippets/model-apis/openai-streaming.md`.
3. Fill it in using the template below, with one code block per language the source shows.
4. Open a pull request with the source link in the description.

````markdown
---
title: Stream a chat response
provider: Example AI
product: Example API
description: Send a chat request and consume the text stream.
prerequisites:
  - Install the SDK and configure its API key.
expected_output: Text chunks printed as they arrive.
model_types: [llm]          # any of: llm, slm, vision, speech, embeddings, image, video
source: https://docs.example.com/quickstart#streaming
verified: 2026-09-21        # date you last checked this against the source
packages:                   # versions the code was checked with
  python: example-ai==1.4.0
  typescript: "@example/ai@2.1.0"
resources:
  - label: API reference
    url: https://docs.example.com/api
  - label: Python SDK
    url: https://github.com/example/example-python
---

```python
# Python code, exactly as it appears at the source
```

```typescript
// TypeScript code, exactly as it appears at the source
```

```bash
# cURL command, exactly as it appears at the source
```
````

Re-checking an existing snippet helps just as much. Confirm it still matches its source, update `verified` and `packages`, and open a PR. If an SDK is missing or a snippet is out of date, [open an issue](https://github.com/dileepadev/ai-snippets/issues) with a link to the official docs.

Longer version, including every frontmatter field: [CONTRIBUTING.md](CONTRIBUTING.md).

## Running the site

The site is [Astro](https://astro.build), built to static files and deployed to GitHub Pages by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `main`.

```bash
npm install
npm run dev       # http://localhost:4321/ai-snippets
npm run validate  # check every snippet file against the rules above
npm run build     # type-check and build to dist/
npm test          # interaction and link checks against the built site
npm run preview   # serve the build
```

`npm run new -- <category> <provider>-<what-it-does>` creates a snippet file from the template with today's date filled in. `npm run validate` also runs in CI on every pull request.

## License

The site code in this repo is released under the [MIT License](LICENSE).

Snippets belong to their original authors and remain under the license of their source. Each one links back to where it came from. If you own a snippet and want it changed or removed, [open an issue](https://github.com/dileepadev/ai-snippets/issues).

This project isn't affiliated with or endorsed by any company or project listed here. Product names and trademarks belong to their owners.

---

Maintained by [@dileepadev](https://github.com/dileepadev).
