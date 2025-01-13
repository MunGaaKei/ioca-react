import { CSSProperties, JSX, ReactNode } from "react";

export interface IFlex {
	as?: keyof JSX.IntrinsicElements;
	align?: string;
	justify?: string;
	gap?: string | number;
	direction?: any;
	wrap?: any;
	columns?: string | number;
	style?: CSSProperties;
	className?: string;
	children?: ReactNode;
}
