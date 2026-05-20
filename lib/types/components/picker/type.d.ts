import { ColorPickerProps } from '@rc-component/color-picker';
import { ReactNode, CSSProperties } from 'react';
import { Dayjs } from 'dayjs';
import { BaseInput } from '../../type/index.js';
import { IInput } from '../input/type.js';
import { IPopup } from '../popup/type.js';

interface IDatePicker extends BaseInput, IInput, Omit<IBaseDates, "value"> {
    popupProps?: IPopup;
}
interface IBaseDates {
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
interface IDateRange extends Omit<IBaseDates, "value" | "onDateClick"> {
    value?: [string | undefined, string | undefined];
    placeholder?: string;
    className?: string;
    style?: CSSProperties;
    clear?: boolean;
    onChange?: (value: [string | undefined, string | undefined]) => void;
    onClear?: () => void;
}
interface ITimePicker extends BaseInput, IInput {
    value?: any;
    format?: string;
    periods?: string[];
    renderItem?: (number: number, active: boolean, unit: "hour" | "minute" | "second") => ReactNode;
    popupProps?: IPopup;
}
interface IColorPicker extends Omit<ColorPickerProps, "value" | "onChange"> {
    value?: any;
    label?: ReactNode;
    required?: boolean;
    type?: "HEX" | "RGB" | "HSB";
    children?: ReactNode | ((params: {
        type: string;
        value: any;
    }) => ReactNode);
    popupProps?: IPopup;
    usePanel?: boolean;
    handle?: "text" | "square" | "both";
    placeholder?: ReactNode;
    onChange?: (value: any) => void;
}

export type { IBaseDates, IColorPicker, IDatePicker, IDateRange, ITimePicker };
