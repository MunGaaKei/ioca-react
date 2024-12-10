import { CSSProperties, MouseEvent, ReactNode } from "react";

export interface IMessage {
	id?: string;
	content?: ReactNode;
	active?: boolean;
	duration?: number;
	gap?: number;
	offset?: string;
	max?: number;
	align?: "center" | "left" | "right";
	unshift?: boolean;
	closable?: boolean;
	timer?: ReturnType<typeof setTimeout>;
	className?: string;
	onShow?: () => void;
	onHide?: () => void;
}

export interface IMessageItem {
	active?: boolean;
	content?: ReactNode;
	top?: number;
	className?: string;
	style?: CSSProperties;
	onClick?: (e: MouseEvent<Element>) => void;
}

export type THeights = Record<string, number[]>;

export type TMessageQueue = Record<string, IMessage[]>;
