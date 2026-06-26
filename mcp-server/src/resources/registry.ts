import { ComponentIndex, ComponentInfo } from "../types.js";
import {
  componentListUri,
  componentUri,
  componentPropsUri,
  componentDemosUri,
  isComponentsList,
  isComponent,
  isComponentProps,
  isComponentDemos,
  getComponentNameFromUri,
} from "./uri-builder.js";

export function listResources(index: ComponentIndex) {
  const resources = [];

  // Component list resource
  resources.push({
    uri: componentListUri(),
    name: "Component Library Components",
    description: "List all available components in @ioca/react",
    mimeType: "application/json",
  });

  // Per-component resources
  for (const [key, info] of index.components) {
    resources.push({
      uri: componentUri(info.name),
      name: `${info.name} Component`,
      description: `Complete ${info.name} component documentation`,
      mimeType: "application/json",
    });
    resources.push({
      uri: componentPropsUri(info.name),
      name: `${info.name} Props`,
      description: `${info.name} props API reference`,
      mimeType: "text/markdown",
    });
    if (info.demos.length > 0) {
      resources.push({
        uri: componentDemosUri(info.name),
        name: `${info.name} Demos`,
        description: `${info.name} usage demos`,
        mimeType: "text/markdown",
      });
    }
  }

  return resources;
}

export function readResource(uri: string, index: ComponentIndex) {
  if (isComponentsList(uri)) {
    return readComponentsList(index);
  }

  const name = getComponentNameFromUri(uri);
  if (!name) return null;

  const info = index.components.get(name.toLowerCase());
  if (!info) return null;

  if (isComponent(uri)) {
    return readComponentDetail(info);
  }
  if (isComponentProps(uri)) {
    return readComponentProps(info);
  }
  if (isComponentDemos(uri)) {
    return readComponentDemos(info);
  }

  return null;
}

function readComponentsList(index: ComponentIndex) {
  const list = Array.from(index.components.values()).map((info) => ({
    name: info.name,
    description: info.description,
    subComponents: info.subComponents.map((s) => s.name),
    subComponentCount: info.subComponents.length,
    demoCount: info.demos.length,
    propCount: info.mainInterface.props.length,
  }));

  return {
    uri: componentListUri(),
    mimeType: "application/json",
    text: JSON.stringify(
      { total: list.length, components: list },
      null,
      2,
    ),
  };
}

function propsToMarkdown(props: { name: string; type: string; description: string; defaultValue?: string; required: boolean }[]): string {
  if (props.length === 0) return "_No props_";
  const rows = props.map((p) => {
    const desc = p.description || "-";
    const def = p.defaultValue || (p.required ? "_(required)_" : "-");
    return `| \`${p.name}\` | \`${escapeMarkdown(p.type)}\` | ${def} | ${desc} |`;
  });
  return `| Prop | Type | Default | Description |\n|------|------|---------|-------------|\n${rows.join("\n")}`;
}

function escapeMarkdown(s: string): string {
  return s.replace(/\|/g, "\\|");
}

function readComponentDetail(info: ComponentInfo) {
  const subComponents = info.subComponents.map((s) => ({
    name: s.name,
    accessPath: s.accessPath,
    type: s.type,
  }));

  const otherInterfaces = info.otherInterfaces.map((i) => ({
    name: i.name,
    extends: i.extends,
    props: i.props,
  }));

  const data = {
    name: info.name,
    description: info.description,
    sourcePath: info.sourcePath,
    mainInterface: {
      name: info.mainInterface.name,
      extends: info.mainInterface.extends,
      props: info.mainInterface.props,
    },
    compositionType: info.compositionType,
    subComponents,
    otherInterfaces,
    demos: info.demos.map((d) => ({
      title: d.title,
      code: d.code,
      language: d.language,
    })),
  };

  return {
    uri: componentUri(info.name),
    mimeType: "application/json",
    text: JSON.stringify(data, null, 2),
  };
}

function readComponentProps(info: ComponentInfo) {
  let md = `# ${info.name} Props\n\n`;

  md += `## ${info.mainInterface.name}\n\n`;
  md += propsToMarkdown(info.mainInterface.props);
  md += "\n\n";

  // Add sub-component interfaces
  for (const sub of info.subComponents) {
    const subInterface = info.otherInterfaces.find(
      (i) => i.name === sub.type || i.name === `I${info.name}${sub.name}`,
    );
    if (subInterface) {
      md += `## ${info.name}.${sub.name} (${subInterface.name})\n\n`;
      if (subInterface.extends?.length) {
        md += `_Extends: ${subInterface.extends.join(", ")}_\n\n`;
      }
      md += propsToMarkdown(subInterface.props);
      md += "\n\n";
    }
  }

  return {
    uri: componentPropsUri(info.name),
    mimeType: "text/markdown",
    text: md,
  };
}

function readComponentDemos(info: ComponentInfo) {
  if (info.demos.length === 0) return null;

  let md = `# ${info.name} Demos\n\n`;
  for (const demo of info.demos) {
    md += `## ${demo.title}\n\n`;
    md += "```" + demo.language + "\n";
    md += demo.code + "\n";
    md += "```\n\n";
  }

  return {
    uri: componentDemosUri(info.name),
    mimeType: "text/markdown",
    text: md,
  };
}
