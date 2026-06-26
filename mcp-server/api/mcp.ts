import type { IncomingMessage, ServerResponse } from "node:http";
import { buildIndex } from "../dist/indexer/index.js";
import { dispatch } from "./handler.js";
import type { JSONRPCRequest } from "./handler.js";
import type { ComponentIndex, ComponentInfo } from "../dist/types.js";
import { generatedIndex as raw } from "./generated-index.js";

let indexCache: ComponentIndex | null = null;

function getIndex(): ComponentIndex {
  if (indexCache) return indexCache;

  // Use pre-built index (embedded in api/generated-index.ts by build)
  indexCache = {
    version: raw.version,
    indexedAt: raw.indexedAt,
    components: new Map(raw.components as [string, ComponentInfo][]),
    sharedTypes: raw.sharedTypes,
  };

  // Fallback: build from source (local dev without build step)
  if (!indexCache.components.size) {
    indexCache = buildIndex(process.cwd());
  }

  return indexCache;
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed. Use POST." }));
    return;
  }

  try {
    const index = getIndex();

    const body = await readBody(req);
    const response = dispatch(body as JSONRPCRequest, index);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32603,
          message: err instanceof Error ? err.message : "Internal error",
        },
      }),
    );
  }
}
