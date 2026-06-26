import { ComponentIndex } from "../types.js";

interface SearchResult {
  name: string;
  relevance: number;
  matchedFields: string[];
  description?: string;
}

function score(query: string, text: string): number {
  const lower = query.toLowerCase();
  const lowerText = text.toLowerCase();
  if (lowerText === lower) return 1.0;
  if (lowerText.startsWith(lower)) return 0.9;
  if (lowerText.includes(lower)) return 0.7;
  return 0;
}

export function searchComponents(
  index: ComponentIndex,
  query: string,
  limit: number = 10,
): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  for (const [key, info] of index.components) {
    const matchedFields: string[] = [];
    let maxScore = 0;

    // Match component name
    const nameScore = score(lowerQuery, info.name);
    if (nameScore > 0) {
      matchedFields.push("name");
      maxScore = Math.max(maxScore, nameScore);
    }

    // Match component description
    if (info.description) {
      const descScore = score(lowerQuery, info.description);
      if (descScore > 0) {
        matchedFields.push("description");
        maxScore = Math.max(maxScore, descScore);
      }
    }

    // Match prop names and descriptions
    for (const prop of info.mainInterface.props) {
      if (score(lowerQuery, prop.name) > 0) {
        if (!matchedFields.includes("props")) matchedFields.push("props");
        maxScore = Math.max(maxScore, 0.6);
      }
      if (prop.description && score(lowerQuery, prop.description) > 0) {
        if (!matchedFields.includes("props")) matchedFields.push("props");
        maxScore = Math.max(maxScore, 0.5);
      }
    }

    // Match sub-component names
    for (const sub of info.subComponents) {
      if (score(lowerQuery, sub.name) > 0) {
        if (!matchedFields.includes("sub-components"))
          matchedFields.push("sub-components");
        maxScore = Math.max(maxScore, 0.6);
      }
    }

    if (matchedFields.length > 0) {
      results.push({
        name: info.name,
        relevance: maxScore,
        matchedFields,
        description: info.description,
      });
    }
  }

  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);

  return results.slice(0, limit);
}
