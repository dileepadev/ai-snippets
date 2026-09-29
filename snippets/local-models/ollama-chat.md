---
title: Chat with a local model
provider: Ollama
product: Ollama Python library
description: A chat call against a model running on localhost, and the same thing over the OpenAI-compatible endpoint.
model_types: [slm, llm]
source: https://github.com/ollama/ollama-python/blob/main/README.md
verified: 2026-09-21
packages:
  python: ollama==0.6.2
resources:
  - label: Ollama docs
    url: https://docs.ollama.com
  - label: API reference
    url: https://docs.ollama.com/api
  - label: Python library
    url: https://github.com/ollama/ollama-python
  - label: JavaScript library
    url: https://github.com/ollama/ollama-js
prerequisites: ["Install and start Ollama on your machine.", "Pull gemma3 for the Python example and install the ollama Python package."]
expected_output: "The local model response is printed to the console."
caveat: "The cURL excerpt uses the model name gpt-3.5-turbo from the source. Create that local alias or choose a model installed in Ollama before running it; this is not a hosted OpenAI request."
tags: ["local", "inference"]
---

```python
from ollama import chat
from ollama import ChatResponse

response: ChatResponse = chat(model='gemma3', messages=[
  {
    'role': 'user',
    'content': 'Why is the sky blue?',
  },
])
print(response['message']['content'])
# or access fields directly from the response object
print(response.message.content)
```

The same request through the OpenAI-compatible endpoint, from
[docs.ollama.com/api/openai-compatibility](https://docs.ollama.com/api/openai-compatibility):

```bash
curl http://localhost:11434/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "user",
                "content": "Hello!"
            }
        ]
    }'
```
