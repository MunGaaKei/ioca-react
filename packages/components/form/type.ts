import { HTMLAttributes, ReactNode } from "react";
import { IFormInstance } from "./useForm";

export type TValidator = (value: any, form: IFormInstance) => boolean;
export type TRule = {
	validator: TValidator;
	message?: string;
};

export interface IForm
	extends Omit<HTMLAttributes<HTMLFormElement>, "onChange"> {
	form?: IFormInstance;
	rules?: {
		[key: string]: boolean | TValidator | TRule;
	};
	columns?: number | string;
	initialValues?: Record<string, any>;
	width?: string | number;
	gap?: string | number;
	labelWidth?: string;
	labelInline?: boolean;
	labelRight?: boolean;
	onEnter?: (values: Record<string, any>, form: IFormInstance) => void;
	onChange?: (name, value) => void;
}

export interface IField {
	name?: string;
	children?: ReactNode;
	required?: boolean;
}
