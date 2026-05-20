import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { ReactNode, useMemo } from "react";
import { IBaseDates } from "../type";

const Dates = (
	props: IBaseDates & {
		month: any;
		rangeEnd?: Dayjs | null;
		hoverDate?: Dayjs | null;
		onDateHover?: (date: Dayjs | null) => void;
	}
) => {
	const {
		value,
		month,
		rangeEnd,
		hoverDate,
		weeks = ["一", "二", "三", "四", "五", "六", "日"],
		renderDate = (date: Dayjs) => date.date(),
		disabledDate,
		onDateClick,
		onDateHover,
	} = props;
	const today = dayjs();

	const dates = useMemo(() => {
		const dates: Dayjs[] = [];

		const lastDateOfLastMonth = month.add(-1, "month").endOf("month");
		let { $W, $D } = lastDateOfLastMonth;

		if ($W !== 0) {
			const lastMonthDates = Array.from({ length: $W }).map(
				(whatever, i) => lastDateOfLastMonth.add(i + 1 - $W, "day")
			);
			dates.push(...lastMonthDates);
		}

		const lastDate = month.endOf("month");
		$D = lastDate.$D;
		$W = lastDate.$W;
		dates.push(
			...Array.from({ length: $D }).map((whatever, i) =>
				lastDate.add(i + 1 - $D, "day")
			)
		);

		if ($W !== 0) {
			dates.push(
				...Array.from({ length: 7 - $W }).map((whatever, i) =>
					lastDate.add(i + 1, "day")
				)
			);
		}

		return dates;
	}, [month]);

	const handleDateClick = (date: Dayjs) => {
		if (disabledDate?.(date)) return;

		onDateClick?.(date);
	};

	const handleMouseEnter = (date: Dayjs) => {
		if (disabledDate?.(date)) return;
		onDateHover?.(date);
	};

	return (
		<>
			<div className='i-datepicker-weeks'>
				{weeks.map((week: ReactNode, i: number) => (
					<span key={i} className='i-datepicker-week'>
						{week}
					</span>
				))}
			</div>
			<div
				className='i-datepicker-dates'
				onMouseLeave={() => onDateHover?.(null)}
			>
				{dates.map((date, i: number) => {
					const active = date.isSame(value, "day") || (rangeEnd && date.isSame(rangeEnd, "day"));
					const isSameMonth = date.isSame(month, "month");
					const isToday = date.isSame(today, "day");
					const disabled = disabledDate?.(date);
					const isBetween = hoverDate && value && (
						(date.isAfter(value, "day") && date.isBefore(hoverDate, "day")) ||
						(date.isAfter(hoverDate, "day") && date.isBefore(value, "day"))
					);

					return (
						<div
							key={i}
							className={classNames("i-datepicker-item", {
								"i-datepicker-active": active,
								"i-datepicker-same-month": isSameMonth,
								"i-datepicker-today": isToday,
								"i-datepicker-disabled": disabled,
								"i-daterange-between": isBetween,
							})}
							onMouseEnter={() => handleMouseEnter(date)}
							onClick={() => handleDateClick(date)}
						>
							{renderDate(date)}
						</div>
					);
				})}
			</div>
		</>
	);
};

export default Dates;
