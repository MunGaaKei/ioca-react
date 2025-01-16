import { CSSProperties, HTMLAttributes, ReactNode } from "react";

export interface ICard extends HTMLAttributes<HTMLDivElement> {
	hideShadow?: boolean;
	border?: boolean;
	style?: CSSProperties;
	className?: string;
	children?: ReactNode;
	header?: ReactNode;
	footer?: ReactNode;
}
