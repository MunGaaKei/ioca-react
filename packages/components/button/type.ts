import {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	CSSProperties,
	ForwardRefExoticComponent,
	ReactNode,
	RefAttributes,
	RefObject,
} from "react";
import { LinkProps } from "react-router";
import Group from "./group";
import Toggle from "./toggle";

interface BaseButtonProps {
	as?:
		| "a"
		| "button"
		| ForwardRefExoticComponent<
				LinkProps & RefAttributes<HTMLAnchorElement>
		  >;
	ref?: RefObject<HTMLElement | null>;
	children?: ReactNode | string;
	className?: string;
	loading?: boolean;
	flat?: boolean;
	outline?: boolean;
	square?: boolean;
	size?: "mini" | "small" | "normal" | "large" | "extreme";
	disabled?: boolean;
	block?: boolean;
	round?: boolean;
	ripple?: boolean;
	secondary?: boolean;
}

export interface IButton
	extends BaseButtonProps,
		Omit<ButtonHTMLAttributes<HTMLElement>, "type" | "onToggle">,
		Omit<AnchorHTMLAttributes<HTMLElement>, "onToggle"> {}

export interface IButtonToggle extends IButton {
	active?: boolean;
	activeClass?: string;
	after?: ReactNode;
	disabled?: boolean;
	onToggle?: (active: boolean) => void;
}

export interface IButtonGroup {
	children?: ReactNode;
	vertical?: boolean;
	className?: string;
	style?: CSSProperties;
}

export interface CompositionButton
	extends ForwardRefExoticComponent<IButton & RefAttributes<HTMLElement>> {
	Toggle: typeof Toggle;
	Group: typeof Group;
}
