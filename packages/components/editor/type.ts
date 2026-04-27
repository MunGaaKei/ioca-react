import {
    FocusEvent,
    HTMLAttributes,
    KeyboardEvent,
    MouseEvent,
    ReactNode,
    Ref,
    SyntheticEvent,
} from "react";

export interface IEditorAddtionControl {
    icon: ReactNode;
    onClick?: (selection: Range | null, e: MouseEvent<HTMLElement>) => void;
}

export interface IEditorMemtionOption {
    label: ReactNode;
    value: string | number;
}

export interface IEditorMemtion {
    key?: string;
    options: IEditorMemtionOption[];
    insert?: (option: IEditorMemtionOption) => ReactNode;
}

export interface IEditor extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "onInput" | "onChange"
> {
    ref?: Ref<HTMLDivElement>;
    value?: string;
    placeholder?: string;
    width?: string | number;
    height?: string | number;
    autosize?: boolean;
    mode?: "rich" | "plaintext";
    hideControl?: boolean;
    addtionControls?: IEditorAddtionControl[];
    memtion?: IEditorMemtion;
    border?: boolean;
    onChange?: (value: string, e: SyntheticEvent<HTMLDivElement>) => void;
    onEnter?: (e: KeyboardEvent<HTMLDivElement>) => void;
    onFocus?: (e: FocusEvent<HTMLDivElement>) => void;
}
