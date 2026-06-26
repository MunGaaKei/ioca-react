export interface PropDef {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
  required: boolean;
  deprecated?: boolean;
}

export interface TypeInterface {
  name: string;
  description?: string;
  extends?: string[];
  props: PropDef[];
  sourceFile: string;
}

export interface SubComponent {
  name: string;
  accessPath: string;
  type: string;
  description?: string;
}

export interface Demo {
  title: string;
  code: string;
  language: string;
}

export interface ComponentInfo {
  name: string;
  description?: string;
  mainInterface: TypeInterface;
  compositionType?: string;
  subComponents: SubComponent[];
  otherInterfaces: TypeInterface[];
  demos: Demo[];
  sourcePath: string;
  docPath?: string;
  exportName: string;
}

export interface ComponentIndex {
  version: string;
  indexedAt: string;
  components: Map<string, ComponentInfo>;
  sharedTypes: TypeInterface[];
}
