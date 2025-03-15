import { CalendarMonthTwotone } from "@ricons/material";
import { useReactive } from "ahooks";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { useEffect, useMemo, useState } from "react";
import Icon from "../../icon";
import Input from "../../input";
import Popup from "../../popup";
import { IDatePicker } from "../type";
import "./index.css";
import Panel from "./panel";

dayjs.extend(customParseFormat);

const FORMATTYPES = ["YYYY-MM-DD", "YYYY-M-D", "YYYY/MM/DD", "YYYY/M/D"];
const FORMAT = "YYYY-MM-DD";

const Datepicker = (props: IDatePicker) => {
	const {
		name,
		value,
		weeks,
		format = FORMAT,
		placeholder = props.format ?? FORMAT,
		renderDate,
		renderMonth,
		renderYear,
		popupProps,
		disabledDate,
		onDateClick,
		onChange,
		onBlur,
		...restProps
	} = props;

	const state = useReactive({
		value,
	});

	const [active, setActive] = useState<boolean>(false);

	const dayJsValue = useMemo(() => {
		if (!state.value) return null;

		const date = dayjs(state.value as string, format, true);

		if (date.isValid()) return date;

		return null;
	}, [state.value]);

	const handleDateClick = (date: Dayjs) => {
		handleChange(date.format(format));
	};

	const handleChange = (v) => {
		state.value = v;
		onChange?.(v);
	};

	const handleSetDate = () => {
		if (!state.value) return;

		const date = dayjs(state.value as string, FORMATTYPES, true);

		if (date.isValid()) {
			handleChange(date.format(format));
			return;
		}

		handleChange("");
	};

	const handleBlur = (e) => {
		onBlur?.(e);
		handleSetDate();
	};

	const handleVisibleChange = (v) => {
		popupProps?.onVisibleChange?.(v);
		setActive(v);
	};

	useEffect(() => {
		state.value = value;
	}, [value]);

	return (
		<Popup
			visible={active}
			trigger='click'
			position='bottom'
			arrow={false}
			align='start'
			onVisibleChange={handleVisibleChange}
			watchResize
			content={
				<Panel
					value={dayJsValue}
					weeks={weeks}
					renderDate={renderDate}
					renderMonth={renderMonth}
					renderYear={renderYear}
					disabledDate={disabledDate}
					onDateClick={handleDateClick}
				/>
			}
			{...popupProps}
		>
			<Input
				value={state.value}
				append={
					<Icon
						icon={<CalendarMonthTwotone />}
						className='i-datepicker-icon'
						size='1em'
					/>
				}
				placeholder={placeholder}
				onChange={handleChange}
				onBlur={handleBlur}
				onEnter={handleSetDate}
				{...restProps}
			/>
		</Popup>
	);
};

export default Datepicker;
