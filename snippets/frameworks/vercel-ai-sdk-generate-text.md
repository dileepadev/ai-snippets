---
title: Generate and stream text
provider: Vercel
product: AI SDK
description: generateText for a single response, streamText for token-by-token output.
model_types: [llm]
source: https://ai-sdk.dev/resources/recipes/node/generate-text
verified: 2026-09-21
packages:
  typescript: ai@7.0.107
resources:
  - label: Documentation
    url: https://ai-sdk.dev/docs
  - label: Core API reference
    url: https://ai-sdk.dev/docs/reference/ai-sdk-core
  - label: Repository
    url: https://github.com/vercel/ai
  - label: Cookbook
    url: https://ai-sdk.dev/cookbook
tags: [streaming]
prerequisites: ["Install the ai JavaScript package in a Node.js project.", "Configure the gateway or provider authentication required by the official recipe."]
expected_output: "A generation result or streamed text chunks."
caveat: "The snippets use a provider/model string. Follow the linked recipe for authentication and provider routing."
---

```javascript
import { generateText } from 'ai';

const result = await generateText({
  model: 'openai/gpt-4o',
  prompt: 'Why is the sky blue?',
});

console.log(result);
```

Streaming, from
[the stream-text recipe](https://ai-sdk.dev/resources/recipes/node/stream-text):

```javascript
import { streamText } from 'ai';

const result = streamText({
  model: 'openai/gpt-4o',
  maxOutputTokens: 512,
  prompt: 'Invent a new holiday and describe its traditions.',
});

for await (const textPart of result.textStream) {
  console.log(textPart);
}
```
