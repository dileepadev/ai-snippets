---
title: Encode sentences locally
provider: Hugging Face
product: Sentence Transformers
description: Loading a pretrained model and encoding a list of sentences on your own machine.
model_types: [embeddings]
source: https://github.com/huggingface/sentence-transformers/blob/main/docs/sentence_transformer/usage/usage.rst
verified: 2026-09-21
packages:
  python: sentence-transformers==6.1.0
resources:
  - label: Documentation
    url: https://sbert.net
  - label: Repository
    url: https://github.com/huggingface/sentence-transformers
  - label: Pretrained models
    url: https://sbert.net/docs/sentence_transformer/pretrained_models.html
prerequisites: ["Install sentence-transformers in a Python environment.", "Allow the first run to download the specified model weights."]
expected_output: "The first example prints a 3 × 384 embedding shape; the second computes query-to-passage similarity."
caveat: "The examples use different embedding models. Compare vectors produced by the same model."
tags: ["semantic-search", "vectors", "rag"]
---

```python
from sentence_transformers import SentenceTransformer

# 1. Load a pretrained Sentence Transformer model
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# The sentences to encode
sentences = [
    "The weather is lovely today.",
    "It's so sunny outside!",
    "He drove to the stadium.",
]

# 2. Calculate embeddings by calling model.encode()
embeddings = model.encode(sentences)
print(embeddings.shape)
# [3, 384]
```

Scoring a query against passages, from
[pretrained_models.md](https://github.com/huggingface/sentence-transformers/blob/main/docs/sentence_transformer/pretrained_models.md):

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("sentence-transformers/multi-qa-mpnet-base-cos-v1")

query_embedding = model.encode("How big is London")
passage_embeddings = model.encode([
    "London is known for its financial district",
    "London has 9,787,426 inhabitants at the 2011 census",
    "The United Kingdom is the fourth largest exporter of goods in the world",
])

similarity = model.similarity(query_embedding, passage_embeddings)
# => tensor([[0.4659, 0.6142, 0.2697]])
```
