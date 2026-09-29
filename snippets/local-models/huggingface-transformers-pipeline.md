---
title: Generate text with the pipeline API
provider: Hugging Face
product: Transformers
description: The high-level pipeline running a chat-formatted prompt through a small local model.
model_types: [slm, llm]
source: https://github.com/huggingface/transformers/blob/main/docs/source/en/model_doc/smollm3.md
verified: 2026-09-21
packages:
  python: transformers==5.17.0
resources:
  - label: Transformers docs
    url: https://huggingface.co/docs/transformers
  - label: Pipeline reference
    url: https://huggingface.co/docs/transformers/main_classes/pipelines
  - label: Repository
    url: https://github.com/huggingface/transformers
prerequisites: ["Install Transformers and the runtime dependencies documented for the chosen model.", "The Python example targets device 0; provide a compatible accelerator and enough memory for SmolLM3-3B.", "Allow the initial download of model weights."]
expected_output: "A generated assistant response from the local pipeline."
caveat: "The CLI example uses a different, smaller Qwen model. Hardware and memory needs depend on the example you choose."
tags: ["local", "inference"]
---

```python
from transformers import pipeline


pipe = pipeline(
    task="text-generation",
    model="HuggingFaceTB/SmolLM3-3B",
    device_map=0
)

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Tell me about yourself."},
]
outputs = pipe(messages, max_new_tokens=256, do_sample=True, temperature=0.7, top_k=50, top_p=0.95)
print(outputs[0]["generated_text"][-1]['content'])
```

The same library ships a chat CLI, from
[conversations.md](https://github.com/huggingface/transformers/blob/main/docs/source/en/conversations.md):

```bash
transformers chat Qwen/Qwen2.5-0.5B-Instruct do_sample=False max_new_tokens=10
```
