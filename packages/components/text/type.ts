import { CSSProperties, FC, JSX, ReactNode } from "react";
import HighLight from "./highlight";
import Number from "./number";
import Time from "./time";

export interface IText {
	as?: keyof JSX.IntrinsicElements;
	size?: string | number;
	decoration?: string;
	weight?: string | number;
	gradient?: string[];
	wave?: boolean;
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

export interface ITextHighLight extends IText {
	keyword: string | string[];
	text: string;
	caseSensitive?: boolean;
	escape?: boolean;
	renderWord?: (word: string) => ReactNode;
}

export interface CompositionText extends FC<IText> {
	Number: typeof Number;
	Time: typeof Time;
	HighLight: typeof HighLight;
}
