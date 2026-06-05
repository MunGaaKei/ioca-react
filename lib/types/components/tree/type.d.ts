import { ForwardRefExoticComponent, RefAttributes, ReactNode, RefObject, CSSProperties, MouseEvent } from 'react';
import { LinkProps } from 'react-router';

interface ITreeItem {
    as?: "a" | "button" | ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>;
    key?: string;
    type?: "item" | "title" | string;
    title: string | ReactNode;
    icon?: ReactNode;
    href?: string;
    children?: ITreeItem[] | Promise<ITreeItem[]>;
    expanded?: boolean;
    disabled?: boolean;
    checked?: boolean;
    parent?: ITreeItem;
    [key: string]: any;
}
interface TVirtual {
    rowHeight: number;
    threshold?: number;
}
interface ITree {
    data: ITreeItem[];
    ref?: RefObject<RefTree | null>;
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
    round?: boolean;
    height?: number | string;
    useVirtual?: TVirtual;
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

export type { ITree, ITreeItem, RefTree, TVirtual };
