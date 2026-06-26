import { ComponentIndex, ComponentInfo } from "../types.js";

export function getComponentInfo(
  index: ComponentIndex,
  name: string,
  include: string[] = ["props", "sub-components"],
  format: "json" | "markdown" = "markdown",
): string | null {
  const info = index.components.get(name.toLowerCase());
  if (!info) return null;

  if (format === "json") {
    return JSON.stringify(buildDetailJson(info), null, 2);
  }

  return buildDetailMarkdown(info, include);
}

export function getComponentDemos(
  index: ComponentIndex,
  name: string,
  demoName?: string,
): string | null {
  const info = index.components.get(name.toLowerCase());
  if (!info || info.demos.length === 0) return null;

  let demos = info.demos;
  if (demoName) {
    demos = demos.filter(
      (d) => d.title.toLowerCase() === demoName.toLowerCase(),
    );
    if (demos.length === 0) return null;
  }

  let md = `# ${info.name} Demos\n\n`;
  for (const demo of demos) {
    md += `## ${demo.title}\n\n`;
    md += "```" + demo.language + "\n";
    md += demo.code + "\n";
    md += "```\n\n";
  }
  return md;
}

export function listComponents(
  index: ComponentIndex,
  detailed: boolean = false,
): string {
  const list = Array.from(index.components.values());

  if (!detailed) {
    return JSON.stringify(
      {
        total: list.length,
        components: list.map((info) => ({
          name: info.name,
          description: info.description,
          subComponentCount: info.subComponents.length,
        })),
      },
      null,
      2,
    );
  }

  return JSON.stringify(
    {
      total: list.length,
      components: list.map((info) => ({
        name: info.name,
        description: info.description,
        subComponents: info.subComponents.map((s) => ({
          name: s.name,
          type: s.type,
        })),
        mainInterface: info.mainInterface.name,
        propCount: info.mainInterface.props.length,
        demoCount: info.demos.length,
      })),
    },
    null,
    2,
  );
}

function buildDetailJson(info: ComponentInfo) {
  return {
    name: info.name,
    description: info.description,
    mainInterface: {
      name: info.mainInterface.name,
      extends: info.mainInterface.extends,
      props: info.mainInterface.props,
    },
    subComponents: info.subComponents.map((s) => ({
      name: s.name,
      accessPath: s.accessPath,
      interface: s.type,
    })),
    otherInterfaces: info.otherInterfaces.map((i) => ({
      name: i.name,
      extends: i.extends,
      props: i.props,
    })),
    demos: info.demos.map((d) => ({
      title: d.title,
      code: d.code,
      language: d.language,
    })),
  };
}

function buildDetailMarkdown(
  info: ComponentInfo,
  include: string[],
): string {
  let md = `# ${info.name}\n\n`;

  if (info.description) {
    md += `${info.description}\n\n`;
  }

  if (include.includes("props")) {
    md += `## Props (${info.mainInterface.name})\n\n`;
    if (info.mainInterface.extends?.length) {
      md += `_Extends: ${info.mainInterface.extends.join(", ")}_\n\n`;
    }
    md += propsTable(info.mainInterface.props);

    // Sub-component props
    for (const sub of info.subComponents) {
      const subInterface = info.otherInterfaces.find(
        (i) => i.name === `I${info.name}${sub.name}`,
      );
      if (subInterface) {
        md += `\n## ${info.name}.${sub.name} Props (${subInterface.name})\n\n`;
        if (subInterface.extends?.length) {
          md += `_Extends: ${subInterface.extends.join(", ")}_\n\n`;
        }
        md += propsTable(subInterface.props);
      }
    }
  }

  if (include.includes("sub-components") && info.subComponents.length > 0) {
    md += `\n## Sub-Components\n\n`;
    for (const sub of info.subComponents) {
      md += `- **${sub.accessPath}** - Interface: \`${sub.type}\`\n`;
    }
  }

  if (include.includes("demos") && info.demos.length > 0) {
    md += `\n## Demos\n\n`;
    for (const demo of info.demos) {
      md += `### ${demo.title}\n\n`;
      md += "```" + demo.language + "\n";
      md += demo.code + "\n";
      md += "```\n\n";
    }
  }

  return md;
}

function propsTable(
  props: { name: string; type: string; description: string; defaultValue?: string; required: boolean }[],
): string {
  if (props.length === 0) return "_No props_\n";
  const rows = props.map((p) => {
    const desc = p.description || "-";
    const def = p.defaultValue || (p.required ? "_(required)_" : "-");
    return `| \`${escMd(p.name)}\` | \`${escMd(p.type)}\` | ${def} | ${desc} |`;
  });
  return `| Prop | Type | Default | Description |\n|------|------|---------|-------------|\n${rows.join("\n")}\n`;
}

function escMd(s: string): string {
  return s.replace(/\|/g, "\\|");
}
