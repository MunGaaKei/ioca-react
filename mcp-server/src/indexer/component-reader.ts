import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { ComponentInfo, PropDef, SubComponent, TypeInterface } from "../types.js";

function parseFile(filePath: string): ts.SourceFile | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  } catch {
    return null;
  }
}

function getJSDocText(node: ts.Node): string {
  const jsDoc = ts.getJSDocCommentsAndTags(node);
  if (jsDoc?.length) {
    return jsDoc
      .map((part) => part.getText?.() || "")
      .filter(Boolean)
      .join("\n")
      .replace(/^\s*\*\s*/gm, "")
      .trim();
  }
  return "";
}

function extractPropsFromInterface(node: ts.InterfaceDeclaration): PropDef[] {
  const props: PropDef[] = [];
  for (const member of node.members) {
    if (ts.isPropertySignature(member) || ts.isMethodSignature(member)) {
      const name = member.name.getText();
      const type = member.type
        ? member.type.getText().replace(/\s+/g, " ").trim()
        : ts.isMethodSignature(member)
          ? "Function"
          : "any";
      const description = getJSDocText(member);
      const required = !member.questionToken;
      props.push({ name, type, description, required });
    }
  }
  return props;
}

function extractExtends(node: ts.InterfaceDeclaration): string[] {
  return node.heritageClauses?.flatMap((hc) =>
    hc.types.map((t) => {
      let text = t.expression.getText();
      if (t.typeArguments?.length) {
        const args = t.typeArguments.map((a) => a.getText()).join(", ");
        text = `${text}<${args}>`;
      }
      return text;
    }),
  ) ?? [];
}

function detectSubComponents(node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration): SubComponent[] {
  const subs: SubComponent[] = [];

  if (ts.isInterfaceDeclaration(node)) {
    for (const m of node.members) {
      const sub = parseCompositionMember(m);
      if (sub) subs.push(sub);
    }
  } else {
    const typeNode = node.type;
    if (ts.isIntersectionTypeNode(typeNode)) {
      for (const t of typeNode.types) {
        if (ts.isTypeLiteralNode(t)) {
          for (const m of t.members) {
            const sub = parseCompositionMember(m);
            if (sub) subs.push(sub);
          }
        }
      }
    }
  }
  return subs;
}

function parseCompositionMember(member: ts.TypeElement): SubComponent | null {
  if (!member.name) return null;
  const name = member.name.getText();
  if (member.name) {
    return { name, accessPath: name, type: name };
  }
  return null;
}

function extractCompositionInfo(
  sourceFile: ts.SourceFile,
  componentName: string,
): { compositionType?: string; subComponents: SubComponent[] } {
  const compName = componentName;
  const result: { compositionType?: string; subComponents: SubComponent[] } = {
    subComponents: [],
  };

  for (const stmt of sourceFile.statements) {
    if (
      (ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt)) &&
      stmt.name.text === `Composition${compName}`
    ) {
      result.compositionType = `Composition${compName}`;
      result.subComponents.push(...detectSubComponents(stmt as ts.InterfaceDeclaration | ts.TypeAliasDeclaration));
    }
  }

  return result;
}

function extractInterfaces(sourceFile: ts.SourceFile, typeFilePath: string): TypeInterface[] {
  const interfaces: TypeInterface[] = [];
  const interfaceMap = new Map<string, ts.InterfaceDeclaration>();

  function visit(node: ts.Node) {
    if (ts.isInterfaceDeclaration(node)) {
      const name = node.name.text;
      interfaceMap.set(name, node);

      const description = getJSDocText(node);
      const extended = extractExtends(node);
      const props = extractPropsFromInterface(node);
      interfaces.push({
        name,
        description,
        extends: extended.length > 0 ? extended : undefined,
        props,
        sourceFile: typeFilePath,
      });
    } else if (ts.isTypeAliasDeclaration(node)) {
      const name = node.name.text;
      if (name.startsWith("T") || name === "FlatNode") {
        interfaces.push({
          name,
          sourceFile: typeFilePath,
          props: [],
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Flatten inherited props from local interfaces
  for (const iface of interfaces) {
    if (!iface.extends) continue;
    const inheritedProps = new Map<string, PropDef>();
    const seen = new Set<string>();

    const resolveExtends = (extNames: string[]) => {
      for (const ext of extNames) {
        const baseName = ext.split("<")[0].trim();
        if (seen.has(baseName)) continue;
        seen.add(baseName);

        const baseDecl = interfaceMap.get(baseName);
        if (baseDecl) {
          const baseIface = interfaces.find((i) => i.name === baseName);
          if (baseIface) {
            for (const prop of baseIface.props) {
              if (!inheritedProps.has(prop.name)) {
                inheritedProps.set(prop.name, prop);
              }
            }
            if (baseIface.extends) {
              resolveExtends(baseIface.extends);
            }
          } else {
            const baseProps = extractPropsFromInterface(baseDecl);
            for (const prop of baseProps) {
              if (!inheritedProps.has(prop.name)) {
                inheritedProps.set(prop.name, prop);
              }
            }
          }
        }
      }
    };

    resolveExtends(iface.extends);

    if (inheritedProps.size > 0) {
      const ownProps = new Map(iface.props.map((p) => [p.name, p]));
      const merged = Array.from(inheritedProps.values());
      for (const [name, prop] of ownProps) {
        const idx = merged.findIndex((p) => p.name === name);
        if (idx >= 0) {
          merged[idx] = prop;
        } else {
          merged.push(prop);
        }
      }
      iface.props = merged;
    }
  }

  return interfaces;
}

function extractStaticMembersFromSource(sourceText: string | undefined, componentName: string): string[] {
  if (!sourceText) return [];
  const members: string[] = [];
  const regex = new RegExp(`${componentName}\\.(\\w+)\\s*=\\s*\\w+`, "g");
  let match;
  while ((match = regex.exec(sourceText)) !== null) {
    members.push(match[1]);
  }
  return members;
}

export function readComponent(
  componentDir: string,
  componentName: string,
  exportName: string,
): ComponentInfo | null {
  const typeFile = join(componentDir, "type.ts");
  if (!existsSync(typeFile)) return null;

  const sourceFile = parseFile(typeFile);
  if (!sourceFile) return null;

  const mainName = `I${componentName}`;

  // Extract all interfaces
  const allInterfaces = extractInterfaces(sourceFile, typeFile);

  // Extract composition info
  const compo = extractCompositionInfo(sourceFile, componentName);

  // Find main interface
  const mainInterface = allInterfaces.find((i) => i.name === mainName);

  // Extract other interfaces (excluding main and composition)
  const otherInterfaces = allInterfaces.filter(
    (i) => i.name !== mainName && !i.name.startsWith(`Composition${componentName}`),
  );

  // Try to find static member assignments from the main .tsx file
  const possibleFiles = ["tsx", "ts"].map((ext) =>
    join(componentDir, `${componentName.toLowerCase()}.${ext}`),
  );
  let sourceText: string | undefined;
  for (const f of possibleFiles) {
    if (existsSync(f)) {
      sourceText = readFileSync(f, "utf-8");
      break;
    }
  }

  const staticMembers = extractStaticMembersFromSource(sourceText, componentName);

  // Merge static members from source with composition type info
  for (const memberName of staticMembers) {
    if (!compo.subComponents.find((s) => s.name === memberName)) {
      compo.subComponents.push({
        name: memberName,
        accessPath: `${componentName}.${memberName}`,
        type: memberName,
      });
    }
  }

  // Look for sub-component interfaces in otherInterfaces
  for (const sub of compo.subComponents) {
    const matchingInterface = allInterfaces.find(
      (i) => i.name === `I${componentName}${sub.name}`,
    );
    if (matchingInterface) {
      sub.type = matchingInterface.name;
    }
  }

  const desc = mainInterface?.description || "";

  if (!mainInterface) return null;

  return {
    name: componentName,
    description: desc,
    mainInterface,
    compositionType: compo.compositionType,
    subComponents: compo.subComponents,
    otherInterfaces,
    demos: [],
    sourcePath: componentDir,
    exportName,
  };
}

export function discoverComponents(packagesDir: string): string[] {
  const indexFile = join(packagesDir, "index.ts");
  if (!existsSync(indexFile)) return [];

  const content = readFileSync(indexFile, "utf-8");
  const seen = new Set<string>();
  const exports: string[] = [];

  const exportRegex = /export\s*\{([^}]+)\}/;
  const match = content.match(exportRegex);
  if (match) {
    const names = match[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const name of names) {
      if (name && !name.includes("from") && !name.startsWith("use") && !seen.has(name)) {
        seen.add(name);
        exports.push(name);
      }
    }
  }

  // Handle picker destructured imports
  const importRegex = /\{(.+?)\}\s+from\s+["'].+?\/picker["']/;
  const importMatch = content.match(importRegex);
  if (importMatch) {
    const names = importMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
    for (const name of names) {
      if (!seen.has(name)) {
        seen.add(name);
        exports.push(name);
      }
    }
  }

  return exports;
}

export function readSharedTypes(packagesDir: string): TypeInterface[] {
  const typeIndexFile = join(packagesDir, "type", "index.ts");
  if (!existsSync(typeIndexFile)) return [];

  const sourceFile = parseFile(typeIndexFile);
  if (!sourceFile) return [];

  return extractInterfaces(sourceFile, typeIndexFile);
}
