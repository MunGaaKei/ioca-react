import { ColorPickerProps } from "@rc-component/color-picker";
import { CSSProperties } from "react";
import { Dayjs } from "dayjs";
import { ReactNode } from "react";
import { BaseInput } from "../../type";
import { IInput } from "../input/type";
import { IPopup } from "../popup/type";

export interface IDatePicker
    extends BaseInput, IInput, Omit<IBaseDates, "value"> {
    popupProps?: IPopup;
}

export interface IBaseDates {
    value?: any;
    format?: string;
    weeks?: ReactNode[];
    unitYear?: ReactNode;
    unitMonth?: ReactNode;
    renderDate?: (date: Dayjs) => ReactNode;
    renderMonth?: (month: number) => ReactNode;
    renderYear?: (year: number) => ReactNode;
    onDateClick?: (date: Dayjs) => void;
    disabledDate?: (date: Dayjs) => boolean;
}

export interface IDateRange
    extends Omit<IBaseDates, "value" | "onDateClick"> {
    value?: [string | undefined, string | undefined];
    placeholder?: string;
    className?: string;
    style?: CSSProperties;
    clear?: boolean;
    onChange?: (value: [string | undefined, string | undefined]) => void;
    onClear?: () => void;
}

export interface ITimePicker extends BaseInput, IInput {
    value?: any;
    format?: string;
    periods?: string[];
    renderItem?: (
        number: number,
        active: boolean,
        unit: "hour" | "minute" | "second",
    ) => ReactNode;
    popupProps?: IPopup;
}

export interface IColorPicker extends Omit<
    ColorPickerProps,
    "value" | "onChange"
> {
    value?: any;
    label?: ReactNode;
    required?: boolean;
    type?: "HEX" | "RGB" | "HSB";
    children?: ReactNode | ((params: { type: string; value: any }) => ReactNode);
    popupProps?: IPopup;
    usePanel?: boolean;
    handle?: "text" | "square" | "both";
    placeholder?: ReactNode;
    onChange?: (value: any) => void;
}
