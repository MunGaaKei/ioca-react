/// <reference types="react" />

import { RefObject, CSSProperties, ReactNode, MouseEvent, ForwardRefExoticComponent, RefAttributes } from 'react';
import { LinkProps } from '/Users/iann/codes/ioca-react/node_modules/react-router/dist/development/index.d.ts';

interface ITreeItem {
    as?: "a" | "button" | ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>;
    key?: string;
    type?: "item" | "title" | string;
    title: string | ReactNode;
    icon?: ReactNode;
    href?: string;
    children?: ITreeItem[];
    expanded?: boolean;
    disabled?: boolean;
    checked?: boolean;
    parent?: ITreeItem;
    [key: string]: any;
}
interface ITree {
    data: ITreeItem[];
    parent?: ITreeItem;
    ref?: RefObject<RefTree | null>;
    depth?: number;
    nodeProps?: {
        key?: string;
        title?: string;
        children?: string;
    };
    selectable?: boolean;
    selected?: string;
    checkable?: boolean;
    checked?: string[];
    disabledRelated?: boolean;
    partofs?: Record<string, boolean>;
    round?: boolean;
    style?: CSSProperties;
    className?: string;
    renderExtra?: (item: ITreeItem) => ReactNode;
    onItemClick?: (item: ITreeItem, e: MouseEvent<HTMLElement>) => void;
    onItemSelect?: (key: string, item: ITreeItem) => void;
    onItemCheck?: (item: ITreeItem, checked: boolean, checkedKeys: string[]) => void;
}
interface RefTree {
    getChecked: () => [string[], ITreeItem[]];
    getSelected: () => [string?, ITreeItem?];
    getPartofs: () => [string[], ITreeItem[]];
}

export type { ITree, ITreeItem, RefTree };
