/// <reference types="react" />

import { ForwardRefExoticComponent, RefObject, ReactNode, CSSProperties, MouseEvent } from 'react';
import Item from './item.js';

interface ISwiper {
    ref?: RefObject<RefSwiper | null>;
    initial?: number;
    type?: "normal" | "fade" | "flow";
    display?: number;
    scroll?: number;
    loop?: boolean;
    gap?: number;
    duration?: number;
    interval?: number;
    draggable?: boolean;
    dragOffset?: number;
    reverse?: boolean;
    autoplay?: boolean;
    pauseOnHover?: boolean;
    indicator?: boolean;
    fixedIndicator?: boolean;
    itemHeight?: number;
    vertical?: boolean;
    prev?: ReactNode;
    next?: ReactNode;
    arrow?: boolean;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
    renderIndicator?: (index: number) => ReactNode;
    onBeforeSwipe?: (before: number) => void;
    onAfterSwipe?: (after: number) => void;
    onItemClick?: (index: number, e: MouseEvent) => void;
}
interface ISwiperItem extends Pick<ISwiper, "gap" | "itemHeight" | "vertical" | "type" | "onItemClick"> {
    active?: boolean;
    index?: number;
    itemIndex?: number;
    transition?: string;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
}
interface RefSwiper {
    swipeTo: (index: number) => void;
    swipeNext: () => void;
    swipePrev: () => void;
}
interface CompositionSwiper extends ForwardRefExoticComponent<ISwiper> {
    Item: typeof Item;
}

export type { CompositionSwiper, ISwiper, ISwiperItem, RefSwiper };
