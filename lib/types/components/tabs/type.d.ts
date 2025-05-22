import { ForwardRefExoticComponent, ReactNode, RefObject, CSSProperties, Ref } from 'react';
import Item from './item.js';

interface ITabItem {
    key?: string;
    props?: any;
    title?: ReactNode;
    content?: ReactNode;
    closable?: boolean;
    keepDOM?: boolean;
    intersecting?: boolean;
    children?: ReactNode;
}
interface ITabs {
    ref?: RefObject<RefTabs | null>;
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
    navs: Ref<HTMLDivElement>;
}
interface CompositionTabs extends ForwardRefExoticComponent<ITabs> {
    Item: typeof Item;
}

export type { CompositionTabs, ITabItem, ITabs, RefTabs };
