---
title: Create an agent with a tool
provider: LangChain
product: LangChain (Python)
description: create_agent wiring a plain function up as a tool, with the model named as a string.
model_types: [llm]
source: https://docs.langchain.com/oss/python/langchain/quickstart
verified: 2026-09-21
packages:
  python: langchain==1.4.2
resources:
  - label: Documentation
    url: https://docs.langchain.com/oss/python/langchain/overview
  - label: API reference
    url: https://reference.langchain.com
  - label: Repository
    url: https://github.com/langchain-ai/langchain
tags: [agents, tool-use]
prerequisites: ["Install LangChain and the provider integration for the example you choose.", "Configure the corresponding provider API key."]
expected_output: "The final agent message content blocks after a tool-assisted weather question."
caveat: "The weather tool returns a fixed demonstration string; it does not retrieve live weather."
---

```python
from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="openai:gpt-5.5",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's the weather in San Francisco?"}]}
)
print(result["messages"][-1].content_blocks)
```

The same agent against Anthropic, from the same page:

```python
# pip install -qU langchain "langchain[anthropic]"
from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="claude-sonnet-4-6",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's the weather in San Francisco?"}]}
)
print(result["messages"][-1].content_blocks)
```
