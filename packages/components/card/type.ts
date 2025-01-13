import { CSSProperties, ReactNode } from "react";

export interface ICard {
	hideShadow?: boolean;
	border?: boolean;
	style?: CSSProperties;
	className?: string;
	children?: ReactNode;
	header?: ReactNode;
	footer?: ReactNode;
}
