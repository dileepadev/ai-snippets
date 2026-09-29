---
title: Start a video generation job with Veo
provider: Google
product: Veo (Gemini API)
description: Video generation returns a long-running operation you poll, shown here through the OpenAI-compatible endpoint.
model_types: [video]
source: https://ai.google.dev/gemini-api/docs/openai
verified: 2026-09-21
packages:
  python: openai==3.16.2
  typescript: openai@7.20.0
resources:
  - label: Veo docs
    url: https://ai.google.dev/gemini-api/docs/video
  - label: OpenAI compatibility
    url: https://ai.google.dev/gemini-api/docs/openai
  - label: API reference
    url: https://ai.google.dev/api
prerequisites: ["Install the OpenAI SDK for the compatibility endpoint, or use cURL.", "Configure Gemini credentials and access to the named Veo model."]
expected_output: "An operation ID and processing status, rather than a finished video."
caveat: "The SDK examples contain a literal GEMINI_API_KEY placeholder. Load your actual key securely; then follow the source’s polling and download steps to retrieve the video."
tags: ["generation", "multimodal"]
---

```python
from openai import OpenAI

client = OpenAI(
    api_key="GEMINI_API_KEY",
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

# Returns a Long Running Operation (status: processing)
response = client.videos.create(
    model="veo-3.1-generate-preview",
    prompt="A cinematic drone shot of a waterfall",
)

print(f"Operation ID: {response.id}")
print(f"Status: {response.status}")
```

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "GEMINI_API_KEY",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function main() {
    // Returns a Long Running Operation (status: processing)
    const response = await openai.videos.create({
        model: "veo-3.1-generate-preview",
        prompt: "A cinematic drone shot of a waterfall",
    });

    console.log(`Operation ID: ${response.id}`);
    console.log(`Status: ${response.status}`);
}

main();
```

```bash
curl "https://generativelanguage.googleapis.com/v1beta/openai/videos" \
  -H "Authorization: Bearer $GEMINI_API_KEY" \
  -F "model=veo-3.1-generate-preview" \
  -F "prompt=A cinematic drone shot of a waterfall"
```
