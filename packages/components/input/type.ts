import {
	CSSProperties,
	ChangeEvent,
	ForwardRefExoticComponent,
	InputHTMLAttributes,
	JSX,
	MouseEvent,
	ReactNode,
	RefObject,
	TextareaHTMLAttributes,
} from "react";
import { BaseInput, TStatus } from "../../type";
import Number from "./number";
import Range from "./range";
import Textarea from "./textarea";
export interface IInputContainer {
	as?: keyof JSX.IntrinsicElements;
	label?: ReactNode;
	className?: string;
	labelInline?: boolean;
	children?: ReactNode;
	style?: CSSProperties;
	tip?: ReactNode;
	status?: TStatus;
	required?: boolean;
}

export interface IInput
	extends BaseInput,
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			"value" | "defaultValue" | "onChange"
		> {
	prepend?: ReactNode;
	append?: ReactNode;
	hideVisible?: boolean;
	onClear?: () => void;
}

export interface ITextarea
	extends Omit<BaseInput, "ref">,
		Omit<
			TextareaHTMLAttributes<HTMLTextAreaElement>,
			"value" | "defaultValue" | "onChange"
		> {
	ref?: RefObject<RefTextarea | null>;
	autoSize?: boolean;
	width?: string | number;
}

export interface RefTextarea {
	input: HTMLTextAreaElement | null;
}

export interface IInputNumber
	extends BaseInput,
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			"onChange" | "defaultValue"
		> {
	value?: string | number;
	prepend?: ReactNode;
	append?: ReactNode;
	step?: number;
	min?: number;
	max?: number;
	thousand?: string;
	precision?: number;
	hideControl?: boolean;
	showMax?: boolean;
}

export interface IInputRange
	extends Omit<BaseInput, "value" | "onChange">,
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			"value" | "defaultValue" | "placeholder" | "onChange"
		> {
	value?: (number | string | undefined)[];
	placeholder?: string[];
	min?: number;
	max?: number;
	prepend?: ReactNode;
	append?: ReactNode;
	step?: number;
	thousand?: string;
	precision?: number;
	hideControl?: boolean;
	autoSwitch?: boolean;
	onChange?: (
		value: (number | string | undefined)[],
		e?: ChangeEvent<HTMLInputElement> | MouseEvent<Element>
	) => void;
}

export type CompositionInput = ForwardRefExoticComponent<IInput> & {
	Textarea: typeof Textarea;
	Number: typeof Number;
	Range: typeof Range;
};
