import {
	ChangeEvent,
	InputHTMLAttributes,
	KeyboardEvent,
	ReactNode,
	RefObject,
} from "react";

export type TStatus = "normal" | "success" | "warning" | "error";

export type TValue = InputHTMLAttributes<HTMLInputElement>["value"];

export type TOption = {
	label: ReactNode;
	value: any;
	disabled?: boolean;
};

export type TOptions = (TOption | string | number)[];

export type TValidate = {
	status?: TStatus;
	message?: ReactNode;
};

export interface BaseInput extends TValidate {
	label?: ReactNode;
	ref?: RefObject<HTMLInputElement | null>;
	value?: any;
	initValue?: any;
	labelInline?: boolean;
	clear?: boolean;
	border?: boolean;
	tip?: ReactNode;
	onChange?: (
		value: any,
		e?: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	onEnter?: (e: KeyboardEvent) => void;
}

export type TTimeout = ReturnType<typeof setTimeout>;

export type TPosition = "top" | "right" | "left" | "bottom";

export type TRelativeOptions = {
	refWindow?: boolean;
	gap?: number;
	offset?: number;
	position?: TPosition;
	align?: "start" | "center" | "end";
};
