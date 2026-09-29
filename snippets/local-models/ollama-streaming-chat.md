---
title: Stream a chat response from a local model
provider: Ollama
product: Ollama Python library
description: Iterating chunks as the local model produces them.
model_types: [slm, llm]
source: https://github.com/ollama/ollama-python/blob/main/_autodocs/api-reference/streaming.md
verified: 2026-09-21
packages:
  python: ollama==0.6.2
resources:
  - label: Python library
    url: https://github.com/ollama/ollama-python
  - label: Ollama docs
    url: https://docs.ollama.com
tags: [streaming]
prerequisites: ["Start Ollama and pull the llama3.2 model used in these examples.", "Install the ollama Python package."]
expected_output: "Response chunks are printed as the local model generates them."
---

```python
from ollama import Client

client = Client()

messages = [
    {'role': 'user', 'content': 'Why is the sky blue?'}
]

# Stream chat
for chunk in client.chat(
    model='llama3.2',
    messages=messages,
    stream=True
):
    print(chunk.message.content, end='', flush=True)
print()
```

The async client, from
[AsyncClient.md](https://github.com/ollama/ollama-python/blob/main/_autodocs/api-reference/AsyncClient.md):

```python
import asyncio
from ollama import AsyncClient

async def main():
    client = AsyncClient()
    
    # Basic chat
    response = await client.chat(
        model='llama3.2',
        messages=[{'role': 'user', 'content': 'Hello!'}]
    )
    print(response.message.content)
    
    # Streaming chat
    async for chunk in await client.chat(
        model='llama3.2',
        messages=[{'role': 'user', 'content': 'Tell me a story'}],
        stream=True
    ):
        print(chunk.message.content, end='', flush=True)
    
    await client.close()

asyncio.run(main())
```
