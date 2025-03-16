import { HTMLAttributes, ReactNode, CSSProperties } from 'react';

type TKey = string | number;
interface ICollapse extends HTMLAttributes<HTMLDivElement> {
    active?: TKey | TKey[];
    items?: ICollapseItem[];
    multiple?: boolean;
    border?: boolean;
    headerClickable?: boolean;
    renderToggle?: (active: boolean) => ReactNode;
    onCollapse?: (key: TKey, active: boolean) => void;
}
interface ICollapseItem {
    key?: TKey;
    title?: ReactNode;
    content?: ReactNode;
    disabled?: boolean;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
}

export type { ICollapse, ICollapseItem, TKey };
