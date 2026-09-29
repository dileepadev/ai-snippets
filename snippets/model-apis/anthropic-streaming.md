---
title: Stream a long request and keep the final message
provider: Anthropic
product: Messages API
description: The streaming helper the docs recommend for requests long enough to hit a timeout.
model_types: [llm]
source: https://platform.claude.com/docs/en/api/errors
verified: 2026-09-21
packages:
  python: anthropic==1.7.0
  typescript: "@anthropic-ai/sdk@0.127.0"
resources:
  - label: Streaming Messages
    url: https://platform.claude.com/docs/en/api/messages-streaming
  - label: Python SDK
    url: https://github.com/anthropics/anthropic-sdk-python
  - label: TypeScript SDK
    url: https://github.com/anthropics/anthropic-sdk-typescript
tags: [streaming]
prerequisites: ["Install the Anthropic SDK and configure ANTHROPIC_API_KEY.", "Allow enough output tokens and time for the long-running request in this example."]
expected_output: "Streamed content followed by the accumulated final message."
---

```python
client = anthropic.Anthropic()

with client.messages.stream(
    max_tokens=128000,
    messages=[{"role": "user", "content": "Write a detailed analysis..."}],
    model="claude-sonnet-5",
) as stream:
    message = stream.get_final_message()

print(next(block.text for block in message.content if block.type == "text"))
```

```typescript
const client = new Anthropic();

const stream = client.messages.stream({
  max_tokens: 128000,
  messages: [{ role: "user", content: "Write a detailed analysis..." }],
  model: "claude-sonnet-5"
});

const message = await stream.finalMessage();
const textBlock = message.content.find((block) => block.type === "text");
if (textBlock && textBlock.type === "text") {
  console.log(textBlock.text);
}
```

```go
client := anthropic.NewClient()

stream := client.Messages.NewStreaming(context.TODO(), anthropic.MessageNewParams{
	Model:     anthropic.ModelClaudeSonnet5,
	MaxTokens: 128000,
	Messages: []anthropic.MessageParam{
		anthropic.NewUserMessage(anthropic.NewTextBlock("Write a detailed analysis...")),
	},
})

message := anthropic.Message{}
for stream.Next() {
	event := stream.Current()
	if err := message.Accumulate(event); err != nil {
		log.Fatal(err)
	}
}
if err := stream.Err(); err != nil {
	log.Fatal(err)
}

for _, block := range message.Content {
	if textBlock, ok := block.AsAny().(anthropic.TextBlock); ok {
		fmt.Println(textBlock.Text)
		break
	}
}
```

```java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.helpers.MessageAccumulator;
import com.anthropic.models.messages.ContentBlock;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;

void main() {
    AnthropicClient client = AnthropicOkHttpClient.fromEnv();

    MessageCreateParams params = MessageCreateParams.builder()
        .model(Model.CLAUDE_SONNET_5)
        .maxTokens(128000L)
        .addUserMessage("Write a detailed analysis...")
        .build();

    MessageAccumulator accumulator = MessageAccumulator.create();
    try (var streamResponse = client.messages().createStreaming(params)) {
        streamResponse.stream().forEach(accumulator::accumulate);
    }

    Message message = accumulator.message();
    message.content().stream()
            .filter(ContentBlock::isText)
            .findFirst()
            .flatMap(ContentBlock::text)
            .ifPresent(textBlock -> IO.println(textBlock.text()));
}
```

```csharp
AnthropicClient client = new();

var parameters = new MessageCreateParams
{
    Model = Model.ClaudeSonnet5,
    MaxTokens = 128000,
    Messages = [new() { Role = Role.User, Content = "Write a detailed analysis..." }]
};

var message = await client.Messages.CreateStreaming(parameters).Aggregate();
Console.WriteLine(message);
```
