---
title: Run a one-shot agent query
provider: Anthropic
product: Claude Agent SDK
description: The query entry point that drives the agent loop, with tools pre-approved and a turn limit.
model_types: [llm]
source: https://code.claude.com/docs/en/agent-sdk/streaming-vs-single-mode
verified: 2026-09-21
packages:
  python: claude-agent-sdk==0.2.157
  typescript: "@anthropic-ai/claude-agent-sdk@0.3.278"
resources:
  - label: Agent SDK docs
    url: https://code.claude.com/docs/en/agent-sdk/overview
  - label: Quickstart
    url: https://code.claude.com/docs/en/agent-sdk/quickstart
  - label: Python SDK
    url: https://github.com/anthropics/claude-agent-sdk-python
  - label: TypeScript SDK
    url: https://github.com/anthropics/claude-agent-sdk-typescript
tags: [agents]
prerequisites: ["Install and authenticate the Claude Agent SDK using its official quickstart.", "Run inside a project whose authentication flow the agent can inspect."]
expected_output: "The agent explains the project’s authentication flow and continues the conversation."
caveat: "The first query allows Read and Grep tools. Review the selected workspace and the continuation behavior before using it on another project."
---

```python
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage
import asyncio


async def single_message_example():
    # Simple one-shot query using query() function
    # query() raises ResultError after an error result, such as error_max_turns
    try:
        async for message in query(
            prompt="Explain the authentication flow",
            options=ClaudeAgentOptions(max_turns=5, allowed_tools=["Read", "Grep"]),
        ):
            if isinstance(message, ResultMessage) and message.subtype == "success":
                print(message.result)
    except Exception as e:
        print(f"Query failed: {e}")

    # Continue conversation with session management
    try:
        async for message in query(
            prompt="Now explain the authorization process",
            options=ClaudeAgentOptions(continue_conversation=True, max_turns=5),
        ):
            if isinstance(message, ResultMessage) and message.subtype == "success":
                print(message.result)
    except Exception as e:
        print(f"Query failed: {e}")


asyncio.run(single_message_example())
```

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Simple one-shot query
// query() throws after an error result, such as error_max_turns
try {
  for await (const message of query({
    prompt: "Explain the authentication flow",
    options: {
      maxTurns: 5,
      allowedTools: ["Read", "Grep"]
    }
  })) {
    if (message.type === "result" && message.subtype === "success") {
      console.log(message.result);
    }
  }
} catch (error) {
  console.error(`Query failed: ${error}`);
}

// Continue conversation with session management
try {
  for await (const message of query({
    prompt: "Now explain the authorization process",
    options: {
      continue: true,
      maxTurns: 5
    }
  })) {
    if (message.type === "result" && message.subtype === "success") {
      console.log(message.result);
    }
  }
} catch (error) {
  console.error(`Query failed: ${error}`);
}
```
