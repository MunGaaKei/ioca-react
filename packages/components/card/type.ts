import { CSSProperties, ReactNode } from "react";

export interface ICard {
	shadow?: boolean;
	border?: boolean;
	style?: CSSProperties;
	className?: string;
	children?: ReactNode;
}
