import { ReactNode, RefObject, ChangeEvent, KeyboardEvent } from 'react';

type TStatus = "normal" | "success" | "warning" | "error";
type TOption = {
    label: ReactNode;
    value: any;
    disabled?: boolean;
};
type TOptions = (TOption | string | number)[];
type TValidate = {
    status?: TStatus;
    message?: ReactNode;
};
interface BaseInput extends TValidate {
    label?: ReactNode;
    ref?: RefObject<HTMLInputElement | null>;
    value?: any;
    initValue?: any;
    labelInline?: boolean;
    clear?: boolean;
    border?: boolean;
    tip?: ReactNode;
    onChange?: (value: any, e?: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onEnter?: (e: KeyboardEvent) => void;
}
type TPosition = "top" | "right" | "left" | "bottom";

export type { BaseInput, TOption, TOptions, TPosition, TStatus, TValidate };
