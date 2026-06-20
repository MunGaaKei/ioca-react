import { CSSProperties, MouseEvent, ReactNode } from "react";
import { TPosition } from "../../type";
export interface IPopup {
	visible?: boolean;
	content?: ReactNode;
	trigger?: "hover" | "click" | "focus" | "none" | "contextmenu";
	gap?: number;
	offset?: number;
	position?: TPosition;
	arrow?: boolean;
	border?: boolean;
	align?: "start" | "center" | "end";
	showDelay?: number;
	hideDelay?: number;
	touchable?: boolean;
	fitSize?: boolean;
	disabled?: boolean;
	match?: (e: MouseEvent) => boolean;
	style?: CSSProperties;
	children?: ReactNode;
	className?: string;
	onVisibleChange?: (visible: boolean) => void;
}

export interface IPopupContent extends Pick<
	IPopup,
	"arrow" | "className" | "style" | "children"
> {
	trigger?: HTMLElement;
}
