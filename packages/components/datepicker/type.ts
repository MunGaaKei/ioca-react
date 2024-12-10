import { Dayjs } from "dayjs";
import { ReactNode } from "react";
import { BaseInput } from "../../type";
import { IInput } from "../input/type";
import { IPopup } from "../popup/type";

export interface IDatePicker
	extends BaseInput,
		IInput,
		Omit<IBaseDates, "value"> {
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
