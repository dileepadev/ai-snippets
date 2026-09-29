---
title: Expose tools and resources from a Python MCP server
provider: Model Context Protocol
product: Python SDK
description: A server with a resource template, a tool that notifies subscribers, and a tool registered at runtime.
model_types: [llm]
source: https://github.com/modelcontextprotocol/python-sdk/blob/main/examples/stories/subscriptions/server.py
verified: 2026-09-21
packages:
  python: mcp==2.2.0
resources:
  - label: Specification
    url: https://modelcontextprotocol.io/specification
  - label: Python SDK docs
    url: https://modelcontextprotocol.github.io/python-sdk
  - label: Repository
    url: https://github.com/modelcontextprotocol/python-sdk
  - label: Examples
    url: https://github.com/modelcontextprotocol/python-sdk/tree/main/examples
tags: [mcp, tool-use]
prerequisites: ["Install the MCP Python SDK and open the complete linked server example.", "Include the imports and run_server_from_args helper supplied by that example.", "Connect a compatible MCP client to inspect and invoke the tools."]
expected_output: "An MCP server exposing note resources and tools for editing and searching them."
caveat: "The first block is a function excerpt, not a standalone script. MCPServer, Context, and run_server_from_args are defined or imported outside the copied block."
---

```python
def build_server() -> MCPServer:
    mcp = MCPServer("subscriptions-example")
    notes = {"todo": "buy milk", "journal": "day one"}

    @mcp.resource("note://{name}")
    def note(name: str) -> str:
        return notes[name]

    @mcp.tool()
    async def edit_note(name: str, text: str, ctx: Context) -> str:
        """Replace a note's text and tell subscribers that URI changed."""
        notes[name] = text
        await ctx.notify_resource_updated(f"note://{name}")
        return "saved"

    def search(query: str) -> list[str]:
        return [name for name, text in notes.items() if query in text]

    enabled = False

    @mcp.tool()
    async def enable_search(ctx: Context) -> str:
        """Register the `search` tool at runtime and tell subscribers the list changed."""
        nonlocal enabled
        if not enabled:
            enabled = True
            mcp.add_tool(search)
            await ctx.notify_tools_changed()
        return "search is live"

    return mcp


if __name__ == "__main__":
    run_server_from_args(build_server)
```

The low-level server API, where tool listing and dispatch are handled by hand, from
[docs/whats-new.md](https://github.com/modelcontextprotocol/python-sdk/blob/main/docs/whats-new.md):

```python
from typing import Any

import mcp.types as types
from mcp.server.lowlevel import Server

server = Server("Bookshop")


@server.list_tools()  # (1)!
async def list_tools() -> list[types.Tool]:
    return [  # (2)!
        types.Tool(
            name="search_books",
            description="Search the catalog by title or author.",
            inputSchema={  # (3)!
                "type": "object",
                "properties": {"query": {"type": "string"}},
                "required": ["query"],
            },
        )
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[types.ContentBlock]:  # (4)!
    if name != "search_books":
        raise ValueError(f"Unknown tool: {name}")  # (5)!
    ctx = server.request_context  # (6)!
    return [types.TextContent(type="text", text=f"Found 3 books matching {arguments['query']!r}.")]  # (7)!
```
