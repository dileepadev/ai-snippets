---
title: Send a message with Cohere
provider: Cohere
product: Cohere Python SDK
description: Create a message with ClientV2 and inspect the complete response object.
model_types: [llm]
source: https://github.com/cohere-ai/cohere-python/blob/main/README.md#usage
verified: 2026-09-29
packages: {}
package_notes: The upstream example does not pin a version. Source reviewed only; no package version or runtime test recorded.
prerequisites:
  - Install the cohere Python package.
  - Set CO_API_KEY and confirm availability of the model in the example.
expected_output: A Cohere chat response object printed to the console.
caveat: The model ID is preserved from the official README. Source review does not establish current account availability; no runtime test or package version is recorded.
tags: [chat, text-generation]
resources:
  - label: Documentation
    url: https://docs.cohere.com
  - label: Python SDK
    url: https://github.com/cohere-ai/cohere-python
  - label: Source license
    url: https://github.com/cohere-ai/cohere-python/blob/main/LICENSE
---

```python
import cohere

co = cohere.ClientV2()

response = co.chat(
    model="command-r-plus-08-2024",
    messages=[{"role": "user", "content": "hello world!"}],
)

print(response)
```
