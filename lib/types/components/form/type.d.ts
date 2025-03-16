import { HTMLAttributes, ReactNode } from 'react';
import { IFormInstance } from './useForm.js';

type TValidator = (value: any, form: IFormInstance) => boolean;
type TRule = {
    validator: TValidator;
    message?: string;
};
interface IForm extends Omit<HTMLAttributes<HTMLFormElement>, "onChange"> {
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
    onChange?: (name: any, value: any) => void;
}
interface IField {
    name?: string;
    children?: ReactNode;
    required?: boolean;
}

export type { IField, IForm, TRule, TValidator };
