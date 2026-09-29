---
title: Send a message to Claude
provider: Anthropic
product: Messages API
description: The first call from the Claude get-started guide, reading the text blocks off the response.
model_types: [llm]
source: https://platform.claude.com/docs/en/get-started
verified: 2026-09-21
packages:
  python: anthropic==1.7.0
  typescript: "@anthropic-ai/sdk@0.127.0"
resources:
  - label: Messages API reference
    url: https://platform.claude.com/docs/en/api/messages/create
  - label: Python SDK
    url: https://github.com/anthropics/anthropic-sdk-python
  - label: TypeScript SDK
    url: https://github.com/anthropics/anthropic-sdk-typescript
  - label: Cookbook
    url: https://github.com/anthropics/claude-cookbooks
prerequisites: ["Install the Anthropic SDK or use cURL, and configure ANTHROPIC_API_KEY.", "For Python, import anthropic and create client = anthropic.Anthropic() before the excerpt."]
expected_output: "Text content blocks from a Claude message are printed to the console."
caveat: "The Python block is a source excerpt; client initialization appears in the preceding step of the official guide."
tags: ["text-generation", "chat"]
---

The guide creates the client (`client = anthropic.Anthropic()`) in the step above this one.

```python
message = client.messages.create(
    model="claude-opus-5",
    max_tokens=1000,
    messages=[
        {
            "role": "user",
            "content": "What should I search for to find the latest developments in renewable energy?",
        }
    ],
)

for block in message.content:
    if block.type == "text":
        print(block.text)
```

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const message = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "What should I search for to find the latest developments in renewable energy?"
    }
  ]
});

for (const block of message.content) {
  if (block.type === "text") {
    console.log(block.text);
  }
}
```

```csharp
using Anthropic;
using Anthropic.Models.Messages;

var client = new AnthropicClient();

var message = await client.Messages.Create(new MessageCreateParams
{
    Model = Model.ClaudeOpus5,
    MaxTokens = 1000,
    Messages =
    [
        new()
        {
            Role = Role.User,
            Content = "What should I search for to find the latest developments in renewable energy?",
        },
    ],
});

foreach (var block in message.Content)
{
    if (block.TryPickText(out var textBlock))
    {
        Console.WriteLine(textBlock.Text);
    }
}
```

```bash
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-5",
    "max_tokens": 1000,
    "messages": [
      {
        "role": "user",
        "content": "What should I search for to find the latest developments in renewable energy?"
      }
    ]
  }'
```
