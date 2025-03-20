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
interface IFormItem {
    name: string;
    label?: ReactNode;
    required?: boolean;
    component: any;
    componentProps?: Record<string, any>;
    colspan?: number | "full";
    rowspan?: number | "full";
    render?: (config: IFormItem, values: Record<string, any>) => ReactNode;
    shouldRender?: (values: Record<string, any>, form: IFormInstance) => boolean;
    shouldUpdate?: (values: Record<string, any>, form: IFormInstance) => boolean;
}

export type { IField, IForm, IFormItem, TRule, TValidator };
