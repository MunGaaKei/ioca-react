import { HTMLAttributes, JSX } from "react";

export interface IFlex extends HTMLAttributes<HTMLElement> {
	as?: keyof JSX.IntrinsicElements;
	align?: string;
	justify?: string;
	gap?: string | number;
	direction?: any;
	wrap?: any;
	columns?: string | number;
}
