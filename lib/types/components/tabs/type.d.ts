import { ForwardRefExoticComponent, Ref, ReactNode, RefObject, CSSProperties } from 'react';
import Item from './item.js';

interface ITabItem {
    key?: string;
    title?: ReactNode;
    content?: ReactNode;
    closable?: boolean;
    keepDOM?: boolean;
    intersecting?: boolean;
    children?: ReactNode;
}
interface ITabs {
    ref?: Ref<RefTabs>;
    active?: string;
    tabs?: ITabItem[] | string[];
    type?: "default" | "line" | "pane";
    prepend?: ReactNode;
    append?: ReactNode;
    vertical?: boolean;
    hideMore?: boolean;
    bar?: boolean;
    barClass?: string;
    toggable?: boolean;
    navsJustify?: "start" | "center" | "end";
    navsClass?: string;
    className?: string;
    children?: ReactNode;
    style?: CSSProperties;
    renderMore?: (moreTabs: ITabItem[]) => ReactNode;
    onTabChange?: (to?: string, from?: string) => void;
}
interface RefTabs {
    open: (key: string) => void;
    close: (key: string) => void;
    add: (tab: ITabItem, position?: number) => void;
    navs: RefObject<HTMLDivElement | null>;
}
interface CompositionTabs extends ForwardRefExoticComponent<ITabs> {
    Item: typeof Item;
}

export type { CompositionTabs, ITabItem, ITabs, RefTabs };
