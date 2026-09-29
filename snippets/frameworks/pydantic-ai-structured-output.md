---
title: Extract typed output with an agent
provider: Pydantic
product: Pydantic AI
description: Combine a function tool with a validated sentiment schema for structured agent output.
model_types: [llm]
source: https://github.com/pydantic/pydantic-ai/blob/main/README.md#data-extraction
verified: 2026-09-29
packages: {}
package_notes: The upstream example does not pin a version. Source reviewed only; no package version or runtime test recorded.
prerequisites:
  - Install the pydantic-ai Python package and its provider dependencies.
  - Configure credentials and model access for the provider named in the example.
expected_output: A Sentiment object with a positive, negative, or neutral label and a score between -1 and 1.
caveat: The review tool returns a fixed demonstration review. The output comment is the source’s example result, not a guaranteed response. No runtime test or package version is recorded.
tags: [agents, tool-use, structured-output, extraction, validation]
resources:
  - label: Documentation
    url: https://pydantic.dev/docs/ai/
  - label: Structured output guide
    url: https://pydantic.dev/docs/ai/core-concepts/output/
  - label: Repository
    url: https://github.com/pydantic/pydantic-ai
  - label: Source license
    url: https://github.com/pydantic/pydantic-ai/blob/main/LICENSE
---

```python
from typing import Literal

from pydantic import BaseModel, Field

from pydantic_ai import Agent, RunContext


class Sentiment(BaseModel):
    label: Literal['positive', 'negative', 'neutral']
    score: float = Field(ge=-1, le=1)

agent = Agent('openai:gpt-5.6-sol', output_type=Sentiment)


@agent.tool
def recent_reviews(ctx: RunContext, product: str) -> list[str]:
    """Fetch recent review snippets for a product."""
    return ['The new release fixed everything I complained about!']


result = agent.run_sync('How are people feeling about the Extract app?')
print(result.output)
#> label='positive' score=0.9
```
