---
title: Turn text into a vector
provider: OpenAI
product: Embeddings API
description: A single embeddings call, in every language the guide shows.
model_types: [embeddings]
source: https://developers.openai.com/api/docs/guides/embeddings
verified: 2026-09-21
packages:
  python: openai==3.16.2
  typescript: openai@7.20.0
resources:
  - label: Embeddings guide
    url: https://developers.openai.com/api/docs/guides/embeddings
  - label: API reference
    url: https://developers.openai.com/api/reference
  - label: Python SDK
    url: https://github.com/openai/openai-python
  - label: JavaScript SDK
    url: https://github.com/openai/openai-node
prerequisites: ["Install the OpenAI SDK for your language, or use cURL.", "Configure OPENAI_API_KEY."]
expected_output: "An embedding vector or embedding response; the Go example prints its length."
caveat: "Some language excerpts assume a client already exists. An embedding is a numeric representation, not a generated answer."
tags: ["semantic-search", "vectors", "rag"]
---

```python
from openai import OpenAI

client = OpenAI()

response = client.embeddings.create(
    input="Your text string goes here", model="text-embedding-3-small"
)

print(response.data[0].embedding)
```

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: "Your text string goes here",
  encoding_format: "float",
});

console.log(embedding);
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()

	embedding, err := client.Embeddings.New(context.Background(), openai.EmbeddingNewParams{
		Model: openai.EmbeddingModelTextEmbedding3Small,
		Input: openai.EmbeddingNewParamsInputUnion{
			OfString: openai.String("Your text string goes here."),
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(len(embedding.Data[0].Embedding))
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.embeddings.EmbeddingCreateParams;

var embedding =
    client
        .embeddings()
        .create(
            EmbeddingCreateParams.builder()
                .model("text-embedding-3-small")
                .input("The food was delicious and the waiter...")
                .build());

System.out.println(embedding.data().get(0).embedding());
```

```bash
curl https://api.openai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "Your text string goes here",
    "model": "text-embedding-3-small"
  }'
```
