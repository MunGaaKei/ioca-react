import { CSSProperties, MouseEvent, ReactNode, RefObject } from "react";

/** User-facing callable config for message() */
export interface IMessageConfig {
	content?: ReactNode;
	duration?: number;
	style?: CSSProperties;
	className?: string;
	unshift?: boolean;
	closable?: boolean;
	onShow?: () => void;
	onHide?: () => void;
}

/** Internal runtime message (extends user config with system fields) */
export interface IMessage extends IMessageConfig {
	id: string;
	active: boolean;
	align?: string;
	timer?: ReturnType<typeof setTimeout>;
	close?: () => void;
}

/** Props for <Message.Container /> */
export interface IMessageContainerProps {
	align?: "center" | "left" | "right";
	fromBottom?: boolean;
	unshift?: boolean;
	gap?: number;
	offset?: string;
	duration?: number;
	className?: string;
	style?: CSSProperties;
}

export interface IMessageItem {
	ref?: RefObject<HTMLDivElement | null>;
	active?: boolean;
	content?: ReactNode;
	top?: number;
	bottom?: number;
	className?: string;
	style?: CSSProperties;
	onClick?: (e: MouseEvent<Element>) => void;
}

export type THeights = Record<string, number[]>;

export type TMessageQueue = Record<string, IMessage[]>;
