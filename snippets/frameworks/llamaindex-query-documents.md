---
title: Index a folder and query it
provider: LlamaIndex
product: LlamaIndex (Python)
description: The five-line starter that reads a directory, builds a vector index, and asks a question.
model_types: [llm, embeddings]
source: https://github.com/run-llama/llama_index/blob/main/docs/src/content/docs/framework/index.md
verified: 2026-09-21
packages:
  python: llama-index==0.14.24
resources:
  - label: Documentation
    url: https://developers.llamaindex.ai/python/framework
  - label: Repository
    url: https://github.com/run-llama/llama_index
  - label: Examples
    url: https://github.com/run-llama/llama_index/tree/main/docs/examples
tags: [rag]
prerequisites: ["Install llama-index and configure its model and embedding provider credentials.", "Create a data directory containing documents the directory reader can load."]
expected_output: "An answer to a question about the indexed documents."
caveat: "The starter uses the library’s configured defaults. Check its embedding and model settings before indexing private documents."
---

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("Some question about the data should go here")
print(response)
```
