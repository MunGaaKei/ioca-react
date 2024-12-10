import { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type TKey = string | number;

export interface ICollapse extends HTMLAttributes<HTMLDivElement> {
	active?: TKey | TKey[];
	items?: ICollapseItem[];
	multiple?: boolean;
	border?: boolean;
	headerClickable?: boolean;
	renderToggle?: (active: boolean) => ReactNode;
	onCollapse?: (key: TKey, active: boolean) => void;
}

export interface ICollapseItem {
	key?: TKey;
	title?: ReactNode;
	content?: ReactNode;
	disabled?: boolean;
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
}
