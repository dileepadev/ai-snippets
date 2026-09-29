---
title: Stream a response as it is generated
provider: OpenAI
product: Responses API
description: Server-sent events from the Responses API, iterated as they arrive.
model_types: [llm]
source: https://developers.openai.com/api/docs/quickstart
verified: 2026-09-21
packages:
  python: openai==3.16.2
  typescript: openai@7.20.0
resources:
  - label: API reference
    url: https://developers.openai.com/api/reference
  - label: Python SDK
    url: https://github.com/openai/openai-python
  - label: JavaScript SDK
    url: https://github.com/openai/openai-node
tags: [streaming]
prerequisites: ["Install the OpenAI SDK and configure OPENAI_API_KEY.", "Use a runtime that can iterate a streaming response."]
expected_output: "A sequence of response events as the model generates its answer."
caveat: "Streaming examples may print event objects rather than only text. Inspect the event type before rendering it in a UI."
---

```python
from openai import OpenAI

client = OpenAI()

stream = client.responses.create(
    model="gpt-5.6",
    input=[
        {
            "role": "user",
            "content": "Say 'double bubble bath' ten times fast.",
        },
    ],
    stream=True,
)

for event in stream:
    print(event)
```

```javascript
import { OpenAI } from "openai";
const client = new OpenAI();

const stream = await client.responses.create({
  model: "gpt-5.6",
  input: [
    {
      role: "user",
      content: "Say 'double bubble bath' ten times fast.",
    },
  ],
  stream: true,
});

for await (const event of stream) {
  console.log(event);
}
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	stream := client.Responses.NewStreaming(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Say 'double bubble bath' ten times fast.")},
	})
	for stream.Next() {
		fmt.Println(stream.Current().Type)
	}
	if err := stream.Err(); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.StreamResponse;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseStreamEvent;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Say 'double bubble bath' ten times fast.")
        .build();

try (StreamResponse<ResponseStreamEvent> stream = client.responses().createStreaming(params)) {
  stream.stream().forEach(System.out::println);
}
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

var responses = client.CreateResponseStreamingAsync(
    "gpt-5.6",
    "Say 'double bubble bath' ten times fast."
);

await foreach (StreamingResponseUpdate response in responses)
{
    if (response is StreamingResponseOutputTextDeltaUpdate delta)
    {
        Console.Write(delta.Delta);
    }
}
```
