import { CSSProperties, FC, ReactNode } from "react";
import Number from "./number";
import Time from "./time";

export interface IText {
	as?: keyof JSX.IntrinsicElements;
	size?: string | number;
	decoration?: string;
	weight?: string | number;
	gradient?: string[];
	style?: CSSProperties;
	className?: string;
	children?: ReactNode;
}

export interface ITextNumber extends IText {
	count?: number;
	to?: number;
	decimal?: number;
	thousand?: string;
	duration?: number;
	easing?: (x: number) => number;
}

export interface ITextTime extends IText {
	seconds?: number;
	zero?: boolean;
	units?: string[];
}

export interface CompositionText extends FC<IText> {
	Number: typeof Number;
	Time: typeof Time;
}
