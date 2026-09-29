---
title: Generate text with generateContent
provider: Google
product: Gemini API
description: The stateless text-generation call, through the Google Gen AI SDKs and over REST.
model_types: [llm]
source: https://ai.google.dev/gemini-api/docs/migrate-to-interactions
verified: 2026-09-21
packages:
  python: google-genai==2.24.0
  typescript: "@google/genai@2.23.0"
resources:
  - label: Gemini API docs
    url: https://ai.google.dev/gemini-api/docs
  - label: API reference
    url: https://ai.google.dev/api
  - label: Python SDK
    url: https://github.com/googleapis/python-genai
  - label: JavaScript SDK
    url: https://github.com/googleapis/js-genai
  - label: Cookbook
    url: https://github.com/google-gemini/cookbook
prerequisites: ["Install google-genai for Python or @google/genai for JavaScript, or use cURL.", "Configure GEMINI_API_KEY and access to the model in the example."]
expected_output: "A generated joke, printed as text by the SDK examples."
tags: ["text-generation", "chat"]
---

```python
from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash-lite", contents="Tell me a joke."
)
print(response.text)
```

```javascript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite",
  contents: "Tell me a joke.",
});
console.log(response.text);
```

```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent" \
-H "Content-Type: application/json" \
-H "x-goog-api-key: $GEMINI_API_KEY" \
-d '{
    "contents": [{
        "parts": [{
            "text": "Tell me a joke."
        }]
    }]
}'
```
