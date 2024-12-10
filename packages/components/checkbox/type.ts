import { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import type { TOption, TValidate } from "../../type";
export interface ICheckbox
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">,
		TValidate {
	label?: ReactNode;
	options: TOption[] | (string | number)[];
	type?: "default" | "switch" | "button";
	optionInline?: boolean;
	labelInline?: boolean;
	onChange?: (
		value: any[],
		option: TOption,
		e: ChangeEvent<HTMLInputElement>
	) => void;
}

export interface ICheckboxItem
	extends Omit<InputHTMLAttributes<HTMLElement>, "value" | "onChange">,
		TValidate {
	type?: "default" | "switch" | "button";
	label?: ReactNode;
	value?: boolean;
	partof?: boolean;
	onChange?: (value: boolean, e: ChangeEvent<HTMLInputElement>) => void;
}
