---
title: Define an agent and run it
provider: OpenAI
product: Agents SDK
description: An agent with instructions, a function tool, and a Runner call.
model_types: [llm]
source: https://github.com/openai/openai-agents-python/blob/main/docs/quickstart.md
verified: 2026-09-21
packages:
  python: openai-agents==0.22.3
  typescript: "@openai/agents@0.18.0"
resources:
  - label: Documentation
    url: https://openai.github.io/openai-agents-python
  - label: Python SDK
    url: https://github.com/openai/openai-agents-python
  - label: JavaScript SDK
    url: https://github.com/openai/openai-agents-js
  - label: Examples
    url: https://github.com/openai/openai-agents-python/tree/main/examples
tags: [agents, tool-use]
prerequisites: ["Install the openai-agents Python package.", "Configure credentials and model access for the agent’s model provider."]
expected_output: "An agent answer printed from result.final_output."
caveat: "The function-tool and synchronous blocks are independent examples from separate source pages."
---

```python
import asyncio
from agents import Agent, Runner
from agents.decorators import tool


@tool
def history_fun_fact() -> str:
    """Return a short history fact."""
    return "Sharks are older than trees."


agent = Agent(
    name="History Tutor",
    instructions="Answer history questions clearly. Use history_fun_fact when it helps.",
    tools=[history_fun_fact],
)


async def main():
    result = await Runner.run(
        agent,
        "Tell me something surprising about ancient life on Earth.",
    )
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```

The synchronous form, from
[docs/index.md](https://github.com/openai/openai-agents-python/blob/main/docs/index.md):

```python
from agents import Agent, Runner

agent = Agent(name="Assistant", instructions="You are a helpful assistant")

result = Runner.run_sync(agent, "Write a haiku about recursion in programming.")
print(result.final_output)

# Code within the code,
# Functions calling themselves,
# Infinite loop's dance.
```
