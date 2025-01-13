import {
	CSSProperties,
	ForwardRefExoticComponent,
	ReactNode,
	RefObject,
} from "react";
import Item from "./item";

export interface ISwiper {
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
	itemHeight?: number;
	vertical?: boolean;
	prev?: ReactNode;
	next?: ReactNode;
	arrow?: boolean;
	style?: CSSProperties;
	className?: string;
	children?: ReactNode;
	renderIndicator?: (i: number) => ReactNode;
	onBeforeSwipe?: (before: number) => void;
	onAfterSwipe?: (after: number) => void;
}

export interface ISwiperItem
	extends Pick<ISwiper, "gap" | "itemHeight" | "vertical" | "type"> {
	active?: boolean;
	index?: number;
	transition?: string;
	style?: CSSProperties;
	className?: string;
	children?: ReactNode;
}

export interface RefSwiper {
	swipeTo: (i: number) => void;
	swipeNext: () => void;
	swipePrev: () => void;
}

export interface CompositionSwiper extends ForwardRefExoticComponent<ISwiper> {
	Item: typeof Item;
}
