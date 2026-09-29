---
title: Build an MCP server over stdio
provider: Model Context Protocol
product: TypeScript SDK
description: A server that registers one tool with a Zod input schema and speaks over stdio.
model_types: [llm]
source: https://github.com/modelcontextprotocol/typescript-sdk/blob/main/README.md
verified: 2026-09-21
packages:
  typescript: "@modelcontextprotocol/server@2.0.0"
resources:
  - label: Specification
    url: https://modelcontextprotocol.io/specification
  - label: TypeScript SDK docs
    url: https://ts-sdk.modelcontextprotocol.io
  - label: Repository
    url: https://github.com/modelcontextprotocol/typescript-sdk
tags: [mcp, tool-use]
prerequisites: ["Install the MCP TypeScript server package and Zod.", "Use a TypeScript-capable Node.js setup and a client that can launch a stdio MCP server."]
expected_output: "A greet tool exposed over stdio; the separate prompt example registers a code-review prompt."
caveat: "The prompt registration block is independent and does not connect a transport. Follow the complete source to run it as a server."
---

```typescript
import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

const server = new McpServer({ name: 'greeting-server', version: '1.0.0' });

server.registerTool(
    'greet',
    {
        description: 'Greet someone by name',
        inputSchema: z.object({ name: z.string() })
    },
    async ({ name }) => ({
        content: [{ type: 'text', text: `Hello, ${name}!` }]
    })
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main();
```

Registering a prompt on the same server, from
[docs/servers/prompts.md](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/servers/prompts.md):

```typescript
import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

const server = new McpServer({ name: 'review', version: '1.0.0' });

server.registerPrompt(
    'review-code',
    {
        title: 'Code Review',
        description: 'Review code for best practices and potential issues',
        argsSchema: z.object({
            code: z.string().describe('The code to review')
        })
    },
    ({ code }) => ({
        messages: [
            {
                role: 'user' as const,
                content: { type: 'text' as const, text: `Review this code:\n\n${code}` }
            }
        ]
    })
);
```
