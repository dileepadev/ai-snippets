---
title: Configure an agent with function tools
provider: Google
product: Agent Development Kit (ADK)
description: Plain Python functions registered as tools on an ADK agent.
model_types: [llm]
source: https://github.com/google/adk-python/blob/main/contributing/samples/core/quickstart/README.md
verified: 2026-09-21
packages:
  python: google-adk==2.9.2
resources:
  - label: ADK documentation
    url: https://google.github.io/adk-docs
  - label: Python repository
    url: https://github.com/google/adk-python
  - label: Samples
    url: https://github.com/google/adk-python/tree/main/contributing/samples
tags: [agents, tool-use]
prerequisites: ["Install google-adk and configure the model provider as described in the ADK quickstart.", "Define get_weather and get_current_time before constructing root_agent."]
expected_output: "An agent configuration with two function tools; the runner excerpt demonstrates an invocation."
caveat: "These are excerpts from two separate examples. The runner requires an InMemoryRunner import and an agent variable; root_agent is not automatically assigned to agent."
---

```python
from google.adk.agents.llm_agent import Agent

root_agent = Agent(
    name="weather_time_agent",
    description=(
        "Agent to answer questions about the time and weather in a city."
    ),
    instruction=(
        "I can answer your questions about the time and weather in a city."
    ),
    tools=[get_weather, get_current_time],
)
```

Running it, from
[runner_debug_example](https://github.com/google/adk-python/blob/main/contributing/samples/core/runner_debug_example/README.md):

```python
runner = InMemoryRunner(agent=agent)
await runner.run_debug("Hi")
```
