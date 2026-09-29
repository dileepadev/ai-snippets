---
title: Create a chat completion with Mistral
provider: Mistral AI
product: Mistral Python SDK
description: Use a context-managed SDK client to request a text response from Mistral.
model_types: [llm]
source: https://github.com/mistralai/client-python/blob/main/README.md#create-chat-completions
verified: 2026-09-29
packages: {}
package_notes: The upstream example does not pin a version. Source reviewed only; no package version or runtime test recorded.
prerequisites:
  - Install the mistralai Python SDK following its current installation guide.
  - Set MISTRAL_API_KEY and confirm model access on your account.
expected_output: A chat completion response object printed to the console.
caveat: This is the source’s synchronous example. The README also includes an asynchronous variant. No runtime test or package version is recorded here.
tags: [chat, text-generation]
resources:
  - label: Documentation
    url: https://docs.mistral.ai
  - label: Python SDK
    url: https://github.com/mistralai/client-python
  - label: Source license
    url: https://github.com/mistralai/client-python/blob/main/LICENSE
---

```python
# Synchronous Example
from mistralai.client import Mistral
import os


with Mistral(
    api_key=os.getenv("MISTRAL_API_KEY", ""),
) as mistral:
    res = mistral.chat.complete(model="mistral-large-latest", messages=[
        {
            "role": "user",
            "content": "Who is the best French painter? Answer in one short sentence.",
        },
    ], stream=False, response_format={
        "type": "text",
    })

    # Handle response
    print(res)
```
