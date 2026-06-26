import { existsSync, readFileSync, writeFileSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { ComponentIndex, ComponentInfo, TypeInterface } from "../types.js";
import {
  discoverComponents,
  readComponent,
  readSharedTypes,
} from "./component-reader.js";
import { getDocPath, parseDemos } from "./docs-parser.js";

const CACHE_FILE = "node_modules/.ioca-mcp-cache.json";

type SerializableIndex = {
  version: string;
  indexedAt: string;
  hash: string;
  components: [string, ComponentInfo][];
  sharedTypes: TypeInterface[];
};

function computeFileHash(rootPath: string): string {
  const hash = createHash("md5");
  const dirs = [
    join(rootPath, "packages", "components"),
    join(rootPath, "packages", "type"),
    join(rootPath, "packages", "index.ts"),
  ];
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    if (dir.endsWith(".ts")) {
      hash.update(readFileSync(dir));
    } else {
      const items = readdirRecursive(dir);
      for (const f of items.sort()) {
        try {
          const s = statSync(f);
          hash.update(`${f}:${s.mtimeMs}`);
        } catch { /* skip */ }
      }
    }
  }
  return hash.digest("hex");
}

function readdirRecursive(dir: string): string[] {
  const result: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const e of entries) {
      const full = join(dir, e);
      const s = statSync(full);
      if (s.isDirectory()) {
        result.push(...readdirRecursive(full));
      } else if (e.endsWith(".ts") || e.endsWith(".tsx") || e.endsWith(".css")) {
        result.push(full);
      }
    }
  } catch { /* ignore */ }
  return result;
}

function loadCache(rootPath: string, hash: string): ComponentIndex | null {
  try {
    const cachePath = join(rootPath, CACHE_FILE);
    if (!existsSync(cachePath)) return null;
    const raw = JSON.parse(readFileSync(cachePath, "utf-8")) as SerializableIndex;
    if (raw.hash !== hash || raw.version !== "1.0.0") return null;
    return {
      version: raw.version,
      indexedAt: raw.indexedAt,
      components: new Map(raw.components),
      sharedTypes: raw.sharedTypes,
    };
  } catch {
    return null;
  }
}

function saveCache(rootPath: string, hash: string, index: ComponentIndex): void {
  try {
    const cachePath = join(rootPath, CACHE_FILE);
    const serializable: SerializableIndex = {
      version: index.version,
      indexedAt: index.indexedAt,
      hash,
      components: Array.from(index.components.entries()),
      sharedTypes: index.sharedTypes,
    };
    writeFileSync(cachePath, JSON.stringify(serializable));
  } catch {
    // cache write failure is non-critical
  }
}

const HELPER_CLASSES = [
  { name: "flex", type: "display: flex", desc: "Flexbox container" },
  { name: "flex-1", type: "flex: 1", desc: "Flex grow item" },
  { name: "flex-column", type: "flex-direction: column", desc: "Vertical flex layout" },
  { name: "flex-wrap", type: "flex-wrap: wrap", desc: "Wrap flex items" },
  { name: "grid", type: "display: grid", desc: "Grid container" },
  { name: "relative", type: "position: relative", desc: "Relative positioning" },
  { name: "absolute", type: "position: absolute", desc: "Absolute positioning" },
  { name: "fixed", type: "position: fixed", desc: "Fixed positioning" },
  { name: "justify-center", type: "justify-content: center", desc: "Center flex items horizontally" },
  { name: "justify-between", type: "justify-content: space-between", desc: "Distribute flex items evenly" },
  { name: "justify-evenly", type: "justify-content: space-evenly", desc: "Even spacing between flex items" },
  { name: "justify-start", type: "justify-content: flex-start", desc: "Align flex items to start" },
  { name: "justify-end", type: "justify-content: flex-end", desc: "Align flex items to end" },
  { name: "items-start", type: "align-items: start", desc: "Align items to start" },
  { name: "items-center", type: "align-items: center", desc: "Center items vertically" },
  { name: "items-end", type: "align-items: end", desc: "Align items to end" },
  { name: "self-center", type: "align-self: center", desc: "Center self in cross axis" },
  { name: "bordered", type: "", desc: "Add border to element" },
  { name: "round", type: "border-radius: 50%", desc: "Fully rounded corners" },
  { name: "round-0", type: "", desc: "Slight border-radius" },
  { name: "roundless", type: "border-radius: 0", desc: "No border-radius" },
  { name: "text-center", type: "text-align: center", desc: "Center text" },
  { name: "text-right", type: "text-align: right", desc: "Right-align text" },
  { name: "font-bold", type: "font-weight: 600", desc: "Bold text" },
  { name: "font-italic", type: "font-style: italic", desc: "Italic text" },
  { name: "font-lg", type: "font-size: 1.2em", desc: "Large text" },
  { name: "font-sm", type: "font-size: .8em", desc: "Small text" },
  { name: "ellipsis", type: "", desc: "Text overflow ellipsis" },
  { name: "overflow-auto", type: "overflow: auto", desc: "Auto overflow scroll" },
  { name: "overflow-hidden", type: "overflow: hidden", desc: "Hide overflow" },
  { name: "h-100vh", type: "height: 100vh", desc: "Full viewport height" },
  { name: "shadow", type: "", desc: "Box shadow" },
  { name: "hover-shadow", type: "", desc: "Shadow on hover" },
  { name: "bg-blur", type: "", desc: "Background blur" },
  { name: "bg-transparent", type: "background: transparent", desc: "Transparent background" },
  { name: "disabled", type: "", desc: "Disabled element style" },
  { name: "hidden", type: "display: none", desc: "Hide element" },
  { name: "no-transition", type: "transition: none", desc: "Remove transitions" },
  { name: "hover-opacity", type: "", desc: "Opacity becomes 1 on hover" },
  { name: "sticky-top", type: "", desc: "Stick to top" },
  { name: "sticky-bottom", type: "", desc: "Stick to bottom" },
  { name: "code", type: "", desc: "Code snippet style" },
  { name: "chip", type: "", desc: "Capsule/badge style" },
  { name: "link", type: "", desc: "Link style" },
  { name: "kbd", type: "", desc: "Keyboard key style" },
];

const SPACING_VALUES = [0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 36, 40, 60, 80, 100, 120, 160, 200];
const SPACING_SUFFIXES = [
  { cls: "mg-[n]", css: "margin: [n]px", desc: "Margin all sides" },
  { cls: "mx-[n]", css: "margin-inline: [n]px", desc: "Margin left and right" },
  { cls: "my-[n]", css: "margin-block: [n]px", desc: "Margin top and bottom" },
  { cls: "mt-[n]", css: "margin-top: [n]px", desc: "Margin top" },
  { cls: "mb-[n]", css: "margin-bottom: [n]px", desc: "Margin bottom" },
  { cls: "ml-[n]", css: "margin-left: [n]px", desc: "Margin left" },
  { cls: "mr-[n]", css: "margin-right: [n]px", desc: "Margin right" },
  { cls: "pd-[n]", css: "padding: [n]px", desc: "Padding all sides" },
  { cls: "px-[n]", css: "padding-inline: [n]px", desc: "Padding left and right" },
  { cls: "py-[n]", css: "padding-block: [n]px", desc: "Padding top and bottom" },
  { cls: "pt-[n]", css: "padding-top: [n]px", desc: "Padding top" },
  { cls: "pb-[n]", css: "padding-bottom: [n]px", desc: "Padding bottom" },
  { cls: "pl-[n]", css: "padding-left: [n]px", desc: "Padding left" },
  { cls: "pr-[n]", css: "padding-right: [n]px", desc: "Padding right" },
  { cls: "gap-[n]", css: "gap: [n]px", desc: "Gap between flex/grid items" },
];

function buildHelperEntry(): ComponentInfo {
  const categories = [
    { name: "Layout", description: "Display and positioning utilities" },
    { name: "FlexAlignment", description: "Flexbox alignment utilities" },
    { name: "Border", description: "Border and border-radius utilities" },
    { name: "Text", description: "Typography utilities" },
    { name: "Other", description: "Other utility classes" },
  ];

  // Group helper classes into categories
  const layoutNames = ["flex", "flex-1", "flex-column", "flex-wrap", "grid", "relative", "absolute", "fixed"];
  const flexNames = ["justify-center", "justify-between", "justify-evenly", "justify-start", "justify-end", "items-start", "items-center", "items-end", "self-center"];
  const borderNames = ["bordered", "round", "round-0", "roundless"];
  const textNames = ["text-center", "text-right", "font-bold", "font-italic", "font-lg", "font-sm", "ellipsis"];
  const otherNames = ["overflow-auto", "overflow-hidden", "h-100vh", "shadow", "hover-shadow", "bg-blur", "bg-transparent", "disabled", "hidden", "no-transition", "hover-opacity", "sticky-top", "sticky-bottom", "code", "chip", "link", "kbd"];

  const categoryMap: Record<string, string[]> = {
    Layout: layoutNames,
    FlexAlignment: flexNames,
    Border: borderNames,
    Text: textNames,
    Other: otherNames,
  };

  const subComponents = categories.map((cat) => ({
    name: cat.name,
    accessPath: cat.name,
    type: cat.name,
    description: cat.description,
  }));

  const otherInterfaces = categories.map((cat) => ({
    name: cat.name,
    props: (categoryMap[cat.name] || [])
      .map((n) => HELPER_CLASSES.find((h) => h.name === n))
      .filter((h): h is typeof HELPER_CLASSES[number] => !!h)
      .map((h) => ({
        name: h.name,
        type: h.type,
        description: h.desc,
        required: false,
      })),
    sourceFile: "",
  }));

  // Add spacing category
  subComponents.push({ name: "Spacing", accessPath: "Spacing", type: "Spacing", description: "Margin, padding, and gap utilities" });
  otherInterfaces.push({
    name: "Spacing",
    props: SPACING_SUFFIXES.map((s) => ({
      name: s.cls,
      type: s.css,
      description: `${s.desc}. n = ${SPACING_VALUES.join(", ")}`,
      required: false,
    })),
    sourceFile: "",
  });

  // Add Width/Height category
  subComponents.push({ name: "WidthHeight", accessPath: "WidthHeight", type: "WidthHeight", description: "Width and height percentage utilities" });
  otherInterfaces.push({
    name: "WidthHeight",
    props: [
      { name: "w-[p]", type: "width: [p]%", description: "Width percentage. p = 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100", required: false },
      { name: "h-[p]", type: "height: [p]%", description: "Height percentage. p = 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100", required: false },
    ],
    sourceFile: "",
  });

  return {
    name: "Helper",
    description: "CSS utility classes for layout, spacing, typography, border, and more. Use these classes directly in className.",
    mainInterface: {
      name: "HelperClasses",
      props: HELPER_CLASSES.map((h) => ({
        name: h.name,
        type: h.type,
        description: h.desc,
        required: false,
      })),
      sourceFile: "",
    },
    subComponents,
    otherInterfaces,
    demos: [],
    sourcePath: "docs/pages/helper",
    exportName: "Helper",
  };
}

export function buildIndex(rootPath: string): ComponentIndex {
  const packagesDir = join(rootPath, "packages");
  const componentsDir = join(packagesDir, "components");
  const docsPagesDir = join(rootPath, "docs", "pages");

  if (!existsSync(componentsDir)) {
    throw new Error(
      `Components directory not found: ${componentsDir}. Make sure rootPath points to the @ioca/react project root.`,
    );
  }

  // Try cache first
  const hash = computeFileHash(rootPath);
  const cached = loadCache(rootPath, hash);
  if (cached) {
    return cached;
  }

  // Discover all exported components
  const componentNames = discoverComponents(packagesDir);
  const components = new Map<string, ComponentInfo>();
  const errors: string[] = [];

  for (const name of componentNames) {
    const compDir = join(componentsDir, name.toLowerCase());
    if (!existsSync(compDir)) {
      const pickerDir = join(componentsDir, "picker");
      if (existsSync(pickerDir)) {
        const info = readComponent(pickerDir, name, name);
        if (info) {
          const docPath = getDocPath(docsPagesDir, name);
          if (docPath) {
            info.docPath = docPath;
            info.demos = parseDemos(docPath);
          }
          components.set(name.toLowerCase(), info);
        }
      }
      continue;
    }

    const info = readComponent(compDir, name, name);
    if (info) {
      const docPath = getDocPath(docsPagesDir, name);
      if (docPath) {
        info.docPath = docPath;
        info.demos = parseDemos(docPath);
      }
      components.set(name.toLowerCase(), info);
    } else {
      errors.push(`Failed to read component: ${name}`);
    }
  }

  // Add synthetic "Helper" entry for CSS utility classes
  const helperClasses = buildHelperEntry();
  components.set("helper", helperClasses);

  const sharedTypes = readSharedTypes(packagesDir);

  if (errors.length > 0) {
    console.error("Index warnings:", errors.join(", "));
  }

  const index: ComponentIndex = {
    version: "1.0.0",
    indexedAt: new Date().toISOString(),
    components,
    sharedTypes,
  };

  // Save cache for next time
  saveCache(rootPath, hash, index);

  return index;
}
