import { HTMLAttributes, ReactNode } from 'react';
import { ITag } from '../tag/type.js';

interface IPill extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "value"> {
    value?: any[];
    onChange?: (value: any[]) => void;
    tagProps?: Partial<ITag>;
    max?: number;
    icon?: ReactNode;
    editable?: boolean;
    readonly?: boolean;
    label?: ReactNode;
    labelInline?: boolean;
    validator?: (value: any) => boolean | Promise<boolean>;
    format?: (value: any) => any;
    onUpdate?: (newValue: any, oldValue: any, type: "delete" | "create" | "update") => void | Promise<boolean>;
    hideCreate?: boolean;
    renderItem?: (context: {
        value: any;
        index: number;
        editing: boolean;
        loading: boolean;
        readonly: boolean;
        remove: () => void;
    }) => ReactNode;
}

export type { IPill };
