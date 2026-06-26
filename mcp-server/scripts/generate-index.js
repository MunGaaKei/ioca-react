import { buildIndex } from "../dist/indexer/index.js";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..", "..");

if (!existsSync(resolve(projectRoot, "packages", "components"))) {
  console.error(
    `[@ioca/react-mcp] ERROR: packages/components not found at ${projectRoot}. Cannot build index.`,
  );
  process.exit(1);
}

const index = buildIndex(projectRoot);

const dataDir = resolve(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });

const cachePath = resolve(dataDir, "index.json");
writeFileSync(
  cachePath,
  JSON.stringify({
    version: index.version,
    indexedAt: index.indexedAt,
    components: Array.from(index.components.entries()),
    sharedTypes: index.sharedTypes,
  }),
);

console.error(
  `[@ioca/react-mcp] Pre-built index saved (${index.components.size} components, ${index.sharedTypes.length} shared types)`,
);
