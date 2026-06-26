import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ComponentIndex } from "../types.js";
import { searchComponents } from "./search.js";
import { getComponentInfo, getComponentDemos, listComponents } from "./query.js";

export function registerTools(server: Server, index: ComponentIndex) {
  server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: [
      {
        name: "get_component",
        description: "Get detailed information about a component",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Component name (e.g., 'Button', 'Modal')",
            },
            include: {
              type: "array",
              items: {
                type: "string",
                enum: ["props", "sub-components", "demos", "all"],
              },
              description: "What to include. Default: ['props', 'sub-components']",
            },
            format: {
              type: "string",
              enum: ["markdown", "json"],
              description: "Output format. Default: 'markdown'",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "search_components",
        description: "Search components by name, prop name, or description",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search keyword",
            },
            limit: {
              type: "number",
              description: "Max results (default: 10)",
              default: 10,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "list_components",
        description: "List all components in the library",
        inputSchema: {
          type: "object",
          properties: {
            detailed: {
              type: "boolean",
              description: "Include detailed info (sub-components, prop count)",
              default: false,
            },
          },
        },
      },
      {
        name: "get_demo",
        description: "Get usage demo code snippets for a component",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Component name",
            },
            demo: {
              type: "string",
              description: "Specific demo name (e.g., 'Basic', 'Color'). Omit to get all.",
            },
          },
          required: ["name"],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "get_component": {
        const { name: compName, include, format } = args as {
          name: string;
          include?: string[];
          format?: "markdown" | "json";
        };
        const result = getComponentInfo(
          index,
          compName,
          include ?? ["props", "sub-components"],
          format ?? "markdown",
        );
        if (!result) {
          return {
            content: [{ type: "text", text: `Component '${compName}' not found.` }],
            isError: true,
          };
        }
        return { content: [{ type: "text", text: result }] };
      }

      case "search_components": {
        const { query, limit } = args as { query: string; limit?: number };
        const results = searchComponents(index, query, limit ?? 10);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ results, total: results.length }, null, 2),
            },
          ],
        };
      }

      case "list_components": {
        const { detailed } = args as { detailed?: boolean };
        const result = listComponents(index, detailed ?? false);
        return { content: [{ type: "text", text: result }] };
      }

      case "get_demo": {
        const { name: compName, demo } = args as { name: string; demo?: string };
        const result = getComponentDemos(index, compName, demo);
        if (!result) {
          return {
            content: [
              {
                type: "text",
                text: `No demos found for '${compName}'${demo ? ` (demo '${demo}')` : ""}.`,
              },
            ],
            isError: true,
          };
        }
        return { content: [{ type: "text", text: result }] };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  });
}
