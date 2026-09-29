---
title: Generate images with Imagen
provider: Google
product: Imagen (Gemini API)
description: Four images from one English prompt, through the Gen AI SDKs or REST.
model_types: [image]
source: https://ai.google.dev/gemini-api/docs/imagen
verified: 2026-09-21
packages:
  python: google-genai==2.24.0
  typescript: "@google/genai@2.23.0"
resources:
  - label: Imagen docs
    url: https://ai.google.dev/gemini-api/docs/imagen
  - label: API reference
    url: https://ai.google.dev/api
  - label: Python SDK
    url: https://github.com/googleapis/python-genai
  - label: JavaScript SDK
    url: https://github.com/googleapis/js-genai
prerequisites: ["Install the Google Gen AI SDK for your chosen language or use cURL.", "Configure Gemini API credentials and access to Imagen."]
expected_output: "Generated image results for the supplied text prompt."
caveat: "Rendering or saving the returned images depends on the SDK and runtime shown in the source."
tags: ["generation", "multimodal"]
---

```python
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

client = genai.Client()

response = client.models.generate_images(
    model='imagen-4.0-generate-001',
    prompt='Robot holding a red skateboard',
    config=types.GenerateImagesConfig(
        number_of_images= 4,
    )
)
for generated_image in response.generated_images:
  generated_image.image.show()
```

```javascript
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: 'Robot holding a red skateboard',
    config: {
      numberOfImages: 4,
    },
  });

  let idx = 1;
  for (const generatedImage of response.generatedImages) {
    let imgBytes = generatedImage.image.imageBytes;
    const buffer = Buffer.from(imgBytes, "base64");
    fs.writeFileSync(`imagen-${idx}.png`, buffer);
    idx++;
  }
}

main();
```

```bash
curl -X POST \
    "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "instances": [
          {
            "prompt": "Robot holding a red skateboard"
          }
        ],
        "parameters": {
          "sampleCount": 4
        }
      }'
```
