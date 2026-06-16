import { InputHTMLAttributes, ReactNode } from 'react';
import { BaseInput, TOptions, TOption } from '../../type/index.js';
import { IPopup } from '../popup/type.js';

interface ISelect extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onSelect" | "onChange">, BaseInput {
    options: TOptions;
    multiple?: boolean;
    prepend?: ReactNode;
    append?: ReactNode;
    hideClear?: boolean;
    hideArrow?: boolean;
    max?: number;
    maxDisplay?: number;
    filter?: boolean | (() => boolean);
    filterPlaceholder?: string;
    empty?: ReactNode;
    popupProps?: IPopup;
    onSelect?: (v: any, option?: TOption) => void;
    onChange?: (v: any) => void;
}

export type { ISelect };
