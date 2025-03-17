import { ForwardRefExoticComponent, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, RefObject, ChangeEvent, MouseEvent } from 'react';
import { BaseInput } from '../../type/index.js';
import Number from './number.js';
import Range from './range.js';
import Textarea from './textarea.js';

interface IInput extends BaseInput, Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
    prepend?: ReactNode;
    append?: ReactNode;
    hideVisible?: boolean;
}
interface ITextarea extends Omit<BaseInput, "ref">, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange"> {
    ref?: RefObject<HTMLTextAreaElement | null>;
    autoSize?: boolean;
}
interface IInputNumber extends BaseInput, Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "defaultValue"> {
    value?: string | number;
    prepend?: ReactNode;
    append?: ReactNode;
    step?: number;
    min?: number;
    max?: number;
    thousand?: string;
    precision?: number;
    hideControl?: boolean;
}
interface IInputRange extends Omit<BaseInput, "value" | "onChange">, Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "placeholder" | "onChange"> {
    value?: (number | string | undefined)[];
    placeholder?: string[];
    min?: number;
    max?: number;
    prepend?: ReactNode;
    append?: ReactNode;
    step?: number;
    thousand?: string;
    precision?: number;
    hideControl?: boolean;
    onChange?: (value: (number | string | undefined)[], e?: ChangeEvent<HTMLInputElement> | MouseEvent<Element>) => void;
}
type CompositionInput = ForwardRefExoticComponent<IInput> & {
    Textarea: typeof Textarea;
    Number: typeof Number;
    Range: typeof Range;
};

export type { CompositionInput, IInput, IInputNumber, IInputRange, ITextarea };
