import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { Demo } from "../types.js";

function createSourceFile(filePath: string): ts.SourceFile | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    return ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
    );
  } catch {
    return null;
  }
}

function extractStringLiteral(node: ts.Node): string | undefined {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) {
    return node.head.text;
  }
  return undefined;
}

function extractDemoFromExport(sourceFile: ts.SourceFile): Demo[] {
  const demos: Demo[] = [];

  function visit(node: ts.Node) {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (
          ts.isIdentifier(decl.name) &&
          decl.name.text.startsWith("D") &&
          decl.initializer &&
          ts.isObjectLiteralExpression(decl.initializer)
        ) {
          const title = decl.name.text.slice(1); // "Basic", "Color", etc.
          let code = "";
          let lang = "xml";

          for (const prop of decl.initializer.properties) {
            if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
              const key = prop.name.text;
              if (key === "code") {
                code = extractStringLiteral(prop.initializer) || "";
              } else if (key === "lang") {
                lang = extractStringLiteral(prop.initializer) || "xml";
              }
            }
          }

          if (code) {
            demos.push({ title, code, language: lang });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return demos;
}

export function parseDemos(docPageDir: string): Demo[] {
  const propFile = join(docPageDir, "prop.tsx");
  if (!existsSync(propFile)) return [];

  const sourceFile = createSourceFile(propFile);
  if (!sourceFile) return [];

  return extractDemoFromExport(sourceFile);
}

export function getDocPath(docsPagesDir: string, componentName: string): string | undefined {
  const dir = join(docsPagesDir, componentName.toLowerCase());
  if (existsSync(dir) && existsSync(join(dir, "prop.tsx"))) {
    return dir;
  }
  return undefined;
}
