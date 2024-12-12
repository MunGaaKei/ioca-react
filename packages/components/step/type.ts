import { CSSProperties, ReactNode } from "react";

export interface IStep {
	active?: number;
	vertical?: boolean;
	style?: CSSProperties;
	className?: string;
	line?: ReactNode;
	children?: ReactNode;
	asList?: boolean;
	renderIcon?: (i: number, status: string) => ReactNode;
	onClick?: (i: number) => void;
}

export interface IStepItem extends IStep {
	index?: number;
	title?: ReactNode;
}
