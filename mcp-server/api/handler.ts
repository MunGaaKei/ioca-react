import { ComponentIndex } from "../dist/types.js";
import { listResources, readResource } from "../dist/resources/index.js";
import {
  searchComponents,
  getComponentInfo,
  getComponentDemos,
  listComponents,
} from "../dist/tools/index.js";

type JSONRPCRequest = {
  jsonrpc: "2.0";
  id?: string | number;
  method: string;
  params?: Record<string, unknown>;
};

type JSONRPCResponse = {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string };
};

const TOOL_DEFINITIONS = [
  {
    name: "get_component",
    description: "Get detailed information about a component",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Component name (e.g., 'Button', 'Modal')" },
        include: {
          type: "array",
          items: { type: "string", enum: ["props", "sub-components", "demos", "all"] },
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
        query: { type: "string", description: "Search keyword" },
        limit: { type: "number", description: "Max results (default: 10)" },
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
        detailed: { type: "boolean", description: "Include detailed info" },
      },
    },
  },
  {
    name: "get_demo",
    description: "Get usage demo code snippets for a component",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Component name" },
        demo: { type: "string", description: "Specific demo name (e.g., 'Basic')" },
      },
      required: ["name"],
    },
  },
];

const RESOURCE_DEFINITIONS = [
  {
    uri: "ioca-react://components",
    name: "Component Library Components",
    description: "List all available components in @ioca/react",
    mimeType: "application/json",
  },
];

function buildError(id: string | number | null, code: number, message: string): JSONRPCResponse {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function buildResult(id: string | number | null, result: unknown): JSONRPCResponse {
  return { jsonrpc: "2.0", id, result };
}

function handleToolCall(name: string, args: Record<string, unknown>, index: ComponentIndex): unknown {
  switch (name) {
    case "get_component": {
      const { name: compName, include, format } = args as {
        name: string; include?: string[]; format?: "markdown" | "json";
      };
      const result = getComponentInfo(
        index, compName,
        include ?? ["props", "sub-components"],
        format ?? "markdown",
      );
      if (!result) throw new Error(`Component '${compName}' not found.`);
      return { content: [{ type: "text", text: result }] };
    }
    case "search_components": {
      const { query, limit } = args as { query: string; limit?: number };
      const results = searchComponents(index, query, limit ?? 10);
      return { content: [{ type: "text", text: JSON.stringify({ results, total: results.length }) }] };
    }
    case "list_components": {
      const { detailed } = args as { detailed?: boolean };
      return { content: [{ type: "text", text: listComponents(index, detailed ?? false) }] };
    }
    case "get_demo": {
      const { name: compName, demo } = args as { name: string; demo?: string };
      const result = getComponentDemos(index, compName, demo);
      if (!result) throw new Error(`No demos found for '${compName}'.`);
      return { content: [{ type: "text", text: result }] };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function handleResourceRead(uri: string, index: ComponentIndex): unknown {
  const result = readResource(uri, index);
  if (!result) throw new Error(`Resource not found: ${uri}`);
  return { contents: [result] };
}

export function dispatch(req: JSONRPCRequest, index: ComponentIndex): JSONRPCResponse {
  const id = req.id ?? null;
  const method = req.method;
  const params = req.params ?? {};

  try {
    switch (method) {
      case "resources/list":
        return buildResult(id, { resources: [...RESOURCE_DEFINITIONS, ...listResources(index).filter(
          r => r.uri !== "ioca-react://components",
        )] });

      case "resources/read": {
        const { uri } = params as { uri: string };
        return buildResult(id, handleResourceRead(uri, index));
      }

      case "tools/list":
        return buildResult(id, { tools: TOOL_DEFINITIONS });

      case "tools/call": {
        const { name, arguments: args } = params as {
          name: string; arguments: Record<string, unknown>;
        };
        return buildResult(id, handleToolCall(name, args ?? {}, index));
      }

      case "initialize":
        return buildResult(id, {
          protocolVersion: "2025-03-26",
          capabilities: { resources: {}, tools: {} },
          serverInfo: { name: "@ioca/react-mcp", version: "1.0.0" },
        });

      case "notifications/initialized":
        return buildResult(id, {});

      default:
        return buildError(id, -32601, `Method not found: ${method}`);
    }
  } catch (err) {
    return buildError(id, -32603, err instanceof Error ? err.message : "Internal error");
  }
}
