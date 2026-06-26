import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { buildIndex } from "./indexer/index.js";
import { listResources, readResource } from "./resources/registry.js";
import { registerTools } from "./tools/registry.js";

async function main() {
  // Determine root path
  const rootArg = process.argv.find((a) => a.startsWith("--root="));
  let rootPath: string;
  if (rootArg) {
    rootPath = resolve(rootArg.slice("--root=".length));
  } else {
    // Try cwd or parent directories up to 3 levels
    let dir = process.cwd();
    for (let i = 0; i < 3; i++) {
      if (
        existsSync(dir) &&
        existsSync(`${dir}/packages/components`) &&
        existsSync(`${dir}/packages/index.ts`)
      ) {
        rootPath = dir;
        break;
      }
      const parent = resolve(dir, "..");
      if (parent === dir) {
        rootPath = process.cwd();
        break;
      }
      dir = parent;
    }
    rootPath ??= process.cwd();
  }

  console.error(`[@ioca/react-mcp] Indexing from: ${rootPath}`);

  // Build index
  const index = buildIndex(rootPath);
  const compCount = index.components.size;
  const demoCount = Array.from(index.components.values()).reduce(
    (sum, c) => sum + c.demos.length,
    0,
  );
  console.error(
    `[@ioca/react-mcp] Indexed ${compCount} components, ${demoCount} demos, ${index.sharedTypes.length} shared types`,
  );

  // Create MCP server
  const server = new Server(
    {
      name: "@ioca/react-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    },
  );

  // Resources
  server.setRequestHandler(ListResourcesRequestSchema, () => ({
    resources: listResources(index),
  }));

  server.setRequestHandler(
    ReadResourceRequestSchema,
    (request) => {
      const result = readResource(request.params.uri, index);
      if (!result) {
        throw new Error(`Resource not found: ${request.params.uri}`);
      }
      return {
        contents: [result],
      };
    },
  );

  // Tools
  registerTools(server, index);

  // Connect transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[@ioca/react-mcp] Server running on stdio");
}

main().catch((err) => {
  console.error("[@ioca/react-mcp] Fatal error:", err);
  process.exit(1);
});
