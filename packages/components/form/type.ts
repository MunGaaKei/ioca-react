import { HTMLAttributes, ReactNode } from "react";
import { IFormInstance } from "./useForm";

export type TValidator = (value: any, form: IFormInstance) => boolean;
export type TRule = {
	validator: TValidator;
	message?: string;
};

export interface IForm extends HTMLAttributes<HTMLFormElement> {
	form?: IFormInstance;
	rules?: {
		[key: string]: boolean | TValidator | TRule;
	};
	columns?: number | string;
	initialValues?: Record<string, any>;
	width?: string | number;
	gap?: string | number;
	onEnter?: (values: Record<string, any>, form: IFormInstance) => void;
}

export interface IField {
	name?: string;
	children?: ReactNode;
	required?: boolean;
}
