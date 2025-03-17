/// <reference types="react" />

import { ColorPickerProps } from '/Users/iann/codes/ioca-react/node_modules/@rc-component/color-picker/lib/index.d.ts';
import { Dayjs } from '/Users/iann/codes/ioca-react/node_modules/dayjs/index.d.ts';
import { ReactNode } from 'react';
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
interface ITimePicker extends BaseInput, IInput {
    value?: any;
    format?: string;
    periods?: string[];
    renderItem?: (number: number, active: boolean, unit: "hour" | "minute" | "second") => ReactNode;
    popupProps?: IPopup;
}
interface IColorPicker extends ColorPickerProps {
    value?: any;
    type?: "HEX" | "RGB" | "HSB";
    children?: ReactNode;
    popupProps?: IPopup;
    usePanel?: boolean;
    handle?: "text" | "square" | "both";
    placeholder?: ReactNode;
    onChange?: (value: any) => void;
}

export type { IBaseDates, IColorPicker, IDatePicker, ITimePicker };
