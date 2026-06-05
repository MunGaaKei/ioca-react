import {
	CSSProperties,
	ForwardRefExoticComponent,
	MouseEvent,
	ReactNode,
	RefAttributes,
	RefObject,
} from "react";
import { LinkProps } from "react-router";

export interface ITreeHeader extends Pick<ITreeItem, "as" | "href"> {
	selected?: boolean;
	style?: CSSProperties;
	children: ReactNode;
	onClick?: (e: MouseEvent<HTMLElement>) => void;
}

export interface ITreeItem {
	as?:
		| "a"
		| "button"
		| ForwardRefExoticComponent<
				LinkProps & RefAttributes<HTMLAnchorElement>
		  >;
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

export interface FlatNode {
	node: ITreeItem;
	depth: number;
	isExpanded: boolean;
}

export interface TVirtual {
	rowHeight: number;
	threshold?: number;
}

export interface ITree {
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
	height?: number | string;
	useVirtual?: TVirtual;
	style?: CSSProperties;
	className?: string;
	renderExtra?: (item: ITreeItem) => ReactNode;
	onItemClick?: (item: ITreeItem, e: MouseEvent<HTMLElement>) => void;
	onItemSelect?: (key: string, item: ITreeItem) => void;
	onItemCheck?: (
		item: ITreeItem,
		checked: boolean,
		checkedKeys: string[]
	) => void;
}

export interface RefTree {
	getChecked: () => [string[], ITreeItem[]];
	getSelected: () => [string?, ITreeItem?];
	getPartofs: () => [string[], ITreeItem[]];
}
