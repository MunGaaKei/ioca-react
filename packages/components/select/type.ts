import { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { BaseInput, TOption, TOptions } from "../../type";
import { IPopup } from "../popup/type";

export interface ISelect
	extends Omit<
			InputHTMLAttributes<HTMLInputElement>,
			"value" | "onSelect" | "onChange"
		>,
		BaseInput {
	options: TOptions;
	multiple?: boolean;
	prepend?: ReactNode;
	append?: ReactNode;
	hideClear?: boolean;
	max?: number;
	maxDisplay?: number;
	filter?: boolean | (() => boolean);
	filterPlaceholder?: string;
	empty?: ReactNode;
	popupProps?: IPopup;
	onSelect?: (v: any, option?: TOption) => void;
	onChange?: (v: any) => void;
}

export interface ISelectOptions
	extends Pick<
		ISelect,
		"multiple" | "empty" | "filter" | "filterPlaceholder" | "onSelect"
	> {
	value: any;
	options: TOption[];
	onFilter?: (e: ChangeEvent<HTMLInputElement>) => void;
}
