import { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { TOption, TStatus } from "../../type";

type TRenderRadioItem = (checked: boolean, value: any) => ReactNode;

export interface IRadioItem
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		"children" | "onChange"
	> {
	type?: "default" | "button";
	children?: ReactNode | TRenderRadioItem;
	onChange?: (value: any, e: ChangeEvent) => void;
}

export interface IRadio extends IRadioItem {
	label?: ReactNode;
	options: TOption[] | (number | string)[];
	optionInline?: boolean;
	labelInline?: boolean;
	status?: TStatus;
	message?: string;
	renderItem?: TRenderRadioItem;
}
