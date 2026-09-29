---
title: Run offline batched inference
provider: vLLM
product: vLLM
description: The LLM class generating completions for a list of prompts, with no server involved.
model_types: [llm, slm]
source: https://docs.vllm.ai/en/stable/examples/basic/offline_inference
verified: 2026-09-21
packages:
  python: vllm==0.29.0
resources:
  - label: Quickstart
    url: https://docs.vllm.ai/en/stable/getting_started/quickstart
  - label: Repository
    url: https://github.com/vllm-project/vllm
  - label: Examples
    url: https://docs.vllm.ai/en/stable/examples
prerequisites: ["Install vLLM in an environment supported by its official installation guide.", "Provide compatible inference hardware and download access for facebook/opt-125m."]
expected_output: "One generated completion for each of four prompts."
caveat: "The example runs inference in the Python process. It does not start an HTTP API server."
tags: ["local", "inference"]
---

```python
# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project

from vllm import LLM, SamplingParams

# Sample prompts.
prompts = [
    "Hello, my name is",
    "The president of the United States is",
    "The capital of France is",
    "The future of AI is",
]
# Create a sampling params object.
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)


def main():
    # Create an LLM.
    llm = LLM(model="facebook/opt-125m")
    # Generate texts from the prompts.
    # The output is a list of RequestOutput objects
    # that contain the prompt, generated text, and other information.
    outputs = llm.generate(prompts, sampling_params)
    # Print the outputs.
    print("\nGenerated Outputs:\n" + "-" * 60)
    for output in outputs:
        prompt = output.prompt
        generated_text = output.outputs[0].text
        print(f"Prompt:    {prompt!r}")
        print(f"Output:    {generated_text!r}")
        print("-" * 60)


if __name__ == "__main__":
    main()
```
