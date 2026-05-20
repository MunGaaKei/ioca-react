import { CalendarMonthTwotone } from "@ricons/material";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { useMemo, useState } from "react";
import Icon from "../../icon";
import Input from "../../input";
import Popup from "../../popup";
import type { IDateRange } from "../type";
import "../dates/index.css";
import "./index.css";
import DoublePanel from "./panel";

dayjs.extend(customParseFormat);

const DateRange = (props: IDateRange) => {
	const {
		value,
		format = "YYYY-MM-DD",
		placeholder = "选择日期范围",
		className,
		disabledDate,
		onChange,
		clear,
		onClear: onClearProp,
		weeks,
		unitYear,
		unitMonth,
		renderDate,
		renderMonth,
		renderYear,
		...restProps
	} = props;

	const [active, setActive] = useState(false);


	const inputValue = useMemo(() => {
		if (value?.[0] && value?.[1]) {
			return `${value[0]} ~ ${value[1]}`;
		}
		if (value?.[0]) {
			return `${value[0]} ~ `;
		}
		return "";
	}, [value]);

	const dayJsValue = useMemo(() => {
		const start = value?.[0] ? dayjs(value[0] as string, format, true) : null;
		const end = value?.[1] ? dayjs(value[1] as string, format, true) : null;
		if (start?.isValid() || end?.isValid()) {
			return [start?.isValid() ? start : null, end?.isValid() ? end : null] as [
				Dayjs | null,
				Dayjs | null,
			];
		}
		return null;
	}, [value, format]);

	const handleSelected = (dates: [Dayjs, Dayjs]) => {
		const formatted = dates.map((d) => d.format(format));
		onChange?.([formatted[0], formatted[1]]);
		setActive(false);
	};

	const handleVisibleChange = (v: boolean) => {
		setActive(v);
	};

	const handleClear = () => {
		onChange?.([undefined, undefined]);
		setActive(false);
		onClearProp?.();
	};

	return (
		<Popup
			visible={active}
			trigger='click'
			position='bottom'
			arrow={false}
			align='start'
			onVisibleChange={handleVisibleChange}
			content={
				<DoublePanel
					value={dayJsValue}
					weeks={weeks}
					unitYear={unitYear}
					unitMonth={unitMonth}
					renderDate={renderDate}
					renderMonth={renderMonth}
					renderYear={renderYear}
					disabledDate={disabledDate}
					onSelected={handleSelected}
				/>
			}
		>
			<Input
				value={inputValue}
				placeholder={placeholder}
				readOnly
				clear={clear}
				onClear={handleClear}
				append={
					<Icon
						icon={<CalendarMonthTwotone />}
						className='i-datepicker-icon'
						size='1em'
					/>
				}
				className={classNames("i-datepicker-label", className)}
				{...restProps}
			/>
		</Popup>
	);
};

export default DateRange;
