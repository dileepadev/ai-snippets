---
title: Build and run a state graph
provider: LangChain
product: LangGraph
description: Nodes, edges, and a compiled graph that carries a message list as state.
model_types: [llm]
source: https://docs.langchain.com/oss/python/langgraph/overview
verified: 2026-09-21
packages:
  python: langgraph==1.2.11
resources:
  - label: Documentation
    url: https://docs.langchain.com/oss/python/langgraph/overview
  - label: API reference
    url: https://reference.langchain.com/python/langgraph
  - label: Repository
    url: https://github.com/langchain-ai/langgraph
tags: [agents, orchestration]
prerequisites: ["Install the langgraph Python package."]
expected_output: "The first graph returns message state containing a mock assistant response."
caveat: "The nodes use fixed Python functions. These examples do not call a model or require an API key; the second block defines and compiles a graph without invoking it."
---

```python
from langgraph.graph import StateGraph, MessagesState, START, END

def mock_llm(state: MessagesState):
    return {"messages": [{"role": "ai", "content": "hello world"}]}

graph = StateGraph(MessagesState)
graph.add_node(mock_llm)
graph.add_edge(START, "mock_llm")
graph.add_edge("mock_llm", END)
graph = graph.compile()

graph.invoke({"messages": [{"role": "user", "content": "hi!"}]})
```

A graph with a typed state and two sequential nodes, from
[the streaming guide](https://docs.langchain.com/oss/python/langgraph/streaming):

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END


class State(TypedDict):
  topic: str
  joke: str


def refine_topic(state: State):
    return {"topic": state["topic"] + " and cats"}


def generate_joke(state: State):
    return {"joke": f"This is a joke about {state['topic']}"}

graph = (
  StateGraph(State)
  .add_node(refine_topic)
  .add_node(generate_joke)
  .add_edge(START, "refine_topic")
  .add_edge("refine_topic", "generate_joke")
  .add_edge("generate_joke", END)
  .compile()
)
```
