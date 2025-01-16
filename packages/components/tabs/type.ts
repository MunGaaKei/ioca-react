import {
	CSSProperties,
	ForwardRefExoticComponent,
	ReactNode,
	Ref,
	RefObject,
} from "react";
import TabItem from "./item";

export type TTabKey = string | number;

export interface ITabItem {
	key?: TTabKey;
	props?: any;
	title?: ReactNode;
	content?: ReactNode;
	closable?: boolean;
	keepDOM?: boolean;
	intersecting?: boolean;
	children?: ReactNode;
}

export interface ITabs {
	ref?: RefObject<RefTabs | null>;
	active?: TTabKey;
	tabs?: ITabItem[] | TTabKey[];
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
	onTabChange?: (to?: TTabKey, from?: TTabKey) => void;
}

export interface RefTabs {
	open: (key: TTabKey) => void;
	close: (key: TTabKey) => void;
	add: (tab: ITabItem, position?: number) => void;
	navs: Ref<HTMLDivElement>;
}

export interface CompositionTabs extends ForwardRefExoticComponent<ITabs> {
	Item: typeof TabItem;
}
