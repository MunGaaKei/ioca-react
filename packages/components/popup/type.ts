import { CSSProperties, ReactNode, RefObject } from "react";
import { TPosition } from "../../type";
export interface IPopup {
	visible?: boolean;
	content?: ReactNode;
	trigger?: "hover" | "click" | "focus" | "none" | "contextmenu";
	gap?: number;
	offset?: number;
	fixed?: boolean;
	position?: TPosition;
	arrow?: boolean;
	align?: "start" | "center" | "end";
	showDelay?: number;
	hideDelay?: number;
	touchable?: boolean;
	fitSize?: boolean;
	watchResize?: boolean;
	clickOutside?: boolean;
	disabled?: boolean;
	referToWindow?: boolean;
	style?: CSSProperties;
	children?: ReactNode;
	className?: string;
	getContainer?: (trigger?: HTMLElement) => HTMLElement;
	onVisibleChange?: (visible: boolean) => void;
}

export interface IPopupContent
	extends Pick<
		IPopup,
		"getContainer" | "arrow" | "className" | "style" | "children"
	> {
	ref?: RefObject<HTMLDivElement | null>;
	trigger?: HTMLElement;
	arrowProps?: Record<string, any>;
}
