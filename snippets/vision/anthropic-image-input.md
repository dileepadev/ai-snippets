---
title: Send an image to a model
provider: Anthropic
product: Messages API
description: An image block from a public URL, alongside the text question about it.
model_types: [vision, llm]
source: https://platform.claude.com/docs/en/build-with-claude/vision
verified: 2026-09-21
packages:
  python: anthropic==1.7.0
  typescript: "@anthropic-ai/sdk@0.127.0"
resources:
  - label: Vision guide
    url: https://platform.claude.com/docs/en/build-with-claude/vision
  - label: Messages API reference
    url: https://platform.claude.com/docs/en/api/messages/create
  - label: Python SDK
    url: https://github.com/anthropics/anthropic-sdk-python
  - label: TypeScript SDK
    url: https://github.com/anthropics/anthropic-sdk-typescript
tags: [multimodal]
prerequisites: ["Install the Anthropic SDK, or use cURL, and configure ANTHROPIC_API_KEY.", "Add the SDK imports and surrounding program setup required by your chosen language.", "Use an image URL the model provider can access."]
expected_output: "A model message describing the supplied image."
caveat: "Several blocks are excerpts and omit imports. The cURL alternative downloads and base64-encodes the image first."
---

```python
client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "url",
                        "url": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
                    },
                },
                {"type": "text", "text": "Describe this image."},
            ],
        }
    ],
)
print(message)
```

```typescript
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const message = await anthropic.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "url",
            url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
          }
        },
        {
          type: "text",
          text: "Describe this image."
        }
      ]
    }
  ]
});

console.log(message);
```

```go
client := anthropic.NewClient()

message, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
	Model:     anthropic.ModelClaudeOpus5,
	MaxTokens: 1024,
	Messages: []anthropic.MessageParam{
		anthropic.NewUserMessage(
			anthropic.NewImageBlock(anthropic.URLImageSourceParam{
				URL: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg",
			}),
			anthropic.NewTextBlock("Describe this image."),
		),
	},
})
if err != nil {
	log.Fatal(err)
}

fmt.Println(message)
```

The base64 form, for a local file, from
[working-with-messages](https://platform.claude.com/docs/en/build-with-claude/working-with-messages):

```bash
#!/bin/sh

# Option 1: Base64-encoded image
IMAGE_URL="https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
IMAGE_MEDIA_TYPE="image/jpeg"
IMAGE_BASE64=$(curl "$IMAGE_URL" | base64 | tr -d '\n')

curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d @- <<EOF
{
  "model": "claude-opus-5",
  "max_tokens": 1024,
  "messages": [
    {"role": "user", "content": [
      {"type": "image", "source": {
        "type": "base64",
        "media_type": "$IMAGE_MEDIA_TYPE",
        "data": "$IMAGE_BASE64"
      }},
      {"type": "text", "text": "What is in the above image?"}
    ]}
  ]
}
EOF
```
