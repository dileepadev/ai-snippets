---
title: Create a chat completion with Groq
provider: Groq
product: Groq Python SDK
description: Send a message to a hosted open-weight model and read the generated text.
model_types: [llm]
source: https://github.com/groq/groq-python/blob/main/README.md#usage
verified: 2026-09-29
packages: {}
package_notes: The upstream example does not pin a version. Source reviewed only; no package version or runtime test recorded.
prerequisites:
  - Install the groq Python package in Python 3.10 or later.
  - Set GROQ_API_KEY and confirm access to the model named in the example.
expected_output: The assistant response is printed from the first completion choice.
caveat: Reviewed against the official README; not executed here and no package version has been recorded.
tags: [chat, text-generation, open-weights]
resources:
  - label: API documentation
    url: https://console.groq.com/docs
  - label: Python SDK
    url: https://github.com/groq/groq-python
  - label: Source license
    url: https://github.com/groq/groq-python/blob/main/LICENSE
---

```python
import os
from groq import Groq

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),  # This is the default and can be omitted
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Explain the importance of low latency LLMs",
        }
    ],
    model="openai/gpt-oss-20b",
)
print(chat_completion.choices[0].message.content)
```
