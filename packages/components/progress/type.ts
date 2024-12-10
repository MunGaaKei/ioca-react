import { CSSProperties, ReactNode } from "react";
import { BaseInput } from "../../type";
export interface IProgress
	extends Omit<BaseInput, "value" | "hideClear" | "onChange"> {
	name?: string;
	value?: number;
	precision?: number;
	height?: number;
	size?: number;
	barClass?: string;
	draggable?: boolean;
	type?: "line" | "circle";
	className?: string;
	style?: CSSProperties;
	renderCursor?: (value: number) => ReactNode;
	onChange?: (value: number) => void;
}
