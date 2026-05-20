import dayjs, { Dayjs } from "dayjs";
import { ReactNode, useEffect, useMemo, useState } from "react";
import Panel from "../dates/panel";

interface IDoublePanel {
	value?: [Dayjs | null, Dayjs | null] | null;
	weeks?: ReactNode[];
	unitYear?: ReactNode;
	unitMonth?: ReactNode;
	renderDate?: (date: Dayjs) => ReactNode;
	renderMonth?: (m: number) => ReactNode;
	renderYear?: (y: number) => ReactNode;
	disabledDate?: (date: Dayjs) => boolean;
	onSelected?: (dates: [Dayjs, Dayjs]) => void;
}

const DoublePanel = (props: IDoublePanel) => {
	const {
		value,
		weeks,
		unitYear,
		unitMonth,
		renderDate,
		renderMonth,
		renderYear,
		disabledDate,
		onSelected,
	} = props;

	const [baseMonth, setBaseMonth] = useState(value?.[0] || dayjs());
	const [startDate, setStartDate] = useState<Dayjs | null>(
		value?.[0] || null
	);
	const [endDate, setEndDate] = useState<Dayjs | null>(
		value?.[1] || null
	);
	const [selecting, setSelecting] = useState<"start" | "end">("start");
	const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);

	const nextMonth = useMemo(() => baseMonth.add(1, "month"), [baseMonth]);

	useEffect(() => {
		setStartDate(value?.[0] || null);
		setEndDate(value?.[1] || null);
		setBaseMonth(value?.[0] || dayjs());
	}, [value]);

	const handleDateClick = (date: Dayjs) => {
		if (selecting === "start") {
			setStartDate(date);
			setSelecting("end");
		} else {
			let start = startDate || date;
			let end = date;
			if (start.isAfter(end)) {
				[start, end] = [end, start];
			}
			setEndDate(end);
			setSelecting("start");
			onSelected?.([start, end]);
		}
	};

	const handleDateHover = (date: Dayjs | null) => {
		if (selecting === "end" && startDate) {
			setHoverDate(date);
		}
	};

	const handleOperateMonth = (next: boolean) => {
		setBaseMonth((m) => m[next ? "add" : "subtract"](1, "month"));
	};

	return (
		<div className='i-daterange-panel i-daterange-grids'>
			<div className='i-daterange-col'>
				<Panel
					value={startDate}
					month={baseMonth}
					rangeEnd={endDate}
					hoverDate={hoverDate}
					onDateHover={handleDateHover}
					weeks={weeks}
					unitYear={unitYear}
					unitMonth={unitMonth}
					renderDate={renderDate}
					renderMonth={renderMonth}
					renderYear={renderYear}
					disabledDate={disabledDate}
					onDateClick={handleDateClick}
					onOperateMonth={handleOperateMonth}
				/>
			</div>
			<div className='i-daterange-col'>
				<Panel
					value={startDate}
					month={nextMonth}
					rangeEnd={endDate}
					hoverDate={hoverDate}
					onDateHover={handleDateHover}
					weeks={weeks}
					unitYear={unitYear}
					unitMonth={unitMonth}
					renderDate={renderDate}
					renderMonth={renderMonth}
					renderYear={renderYear}
					disabledDate={disabledDate}
					onDateClick={handleDateClick}
					onOperateMonth={handleOperateMonth}
				/>
			</div>
		</div>
	);
};

export default DoublePanel;
