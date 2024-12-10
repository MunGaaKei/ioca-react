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
	initialValues?: Record<string, any>;
	width?: string | number;
}

export interface IField {
	name?: string;
	children?: ReactNode;
	required?: boolean;
}
