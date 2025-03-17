/// <reference types="react" />

import { InputHTMLAttributes, ReactNode, ChangeEvent } from 'react';
import { TValidate, TOption } from '../../type/index.js';

type TRenderCheckboxItem = (checked: boolean, value: any) => ReactNode;
interface ICheckbox extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">, TValidate {
    label?: ReactNode;
    options: TOption[] | (string | number)[];
    type?: "default" | "switch" | "button";
    optionInline?: boolean;
    labelInline?: boolean;
    renderItem?: TRenderCheckboxItem;
    onChange?: (value: any[], option: TOption, e: ChangeEvent<HTMLInputElement>) => void;
}
interface ICheckboxItem extends Omit<InputHTMLAttributes<HTMLElement>, "value" | "children" | "onChange">, TValidate {
    type?: "default" | "switch" | "button";
    label?: ReactNode;
    value?: boolean;
    optionValue?: any;
    partof?: boolean;
    children?: ReactNode | TRenderCheckboxItem;
    onChange?: (value: boolean, e: ChangeEvent<HTMLInputElement>) => void;
}

export type { ICheckbox, ICheckboxItem };
