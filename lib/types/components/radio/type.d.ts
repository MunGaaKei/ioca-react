/// <reference types="react" />

import { ReactNode, InputHTMLAttributes, ChangeEvent } from 'react';
import { TOption, TStatus } from '../../type/index.js';

type TRenderRadioItem = (checked: boolean, value: any) => ReactNode;
interface IRadioItem extends Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "onChange"> {
    type?: "default" | "button";
    children?: ReactNode | TRenderRadioItem;
    onChange?: (value: any, e: ChangeEvent) => void;
}
interface IRadio extends IRadioItem {
    label?: ReactNode;
    options: TOption[] | (number | string)[];
    optionInline?: boolean;
    labelInline?: boolean;
    status?: TStatus;
    message?: string;
    renderItem?: TRenderRadioItem;
}

export type { IRadio, IRadioItem };
