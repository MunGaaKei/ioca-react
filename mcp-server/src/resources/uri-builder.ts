export const RESOURCE_PREFIX = "ioca-react://";

export function componentListUri(): string {
  return `${RESOURCE_PREFIX}components`;
}

export function componentUri(name: string): string {
  return `${RESOURCE_PREFIX}components/${encodeURIComponent(name)}`;
}

export function componentPropsUri(name: string): string {
  return `${RESOURCE_PREFIX}components/${encodeURIComponent(name)}/props`;
}

export function componentDemosUri(name: string): string {
  return `${RESOURCE_PREFIX}components/${encodeURIComponent(name)}/demos`;
}

export function isComponentsList(uri: string): boolean {
  return uri === componentListUri();
}

export function isComponent(uri: string): boolean {
  return /^ioca-react:\/\/components\/[^/]+$/.test(uri);
}

export function isComponentProps(uri: string): boolean {
  return /^ioca-react:\/\/components\/[^/]+\/props$/.test(uri);
}

export function isComponentDemos(uri: string): boolean {
  return /^ioca-react:\/\/components\/[^/]+\/demos$/.test(uri);
}

export function getComponentNameFromUri(uri: string): string | null {
  const match = uri.match(/^ioca-react:\/\/components\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
