import {
	KeyboardArrowLeftRound,
	KeyboardArrowRightRound,
} from "@ricons/material";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { throttle } from "radash";
import { ReactNode, useEffect, useRef, useState } from "react";
import Icon from "../../icon";
import Helpericon from "../../utils/helpericon";
import { IBaseDates } from "../type";
import Dates from "./dates";

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const YearMonth = (
	props: IBaseDates & {
		onClick?: () => void;
	}
) => {
	const {
		value,
		unitMonth = "月",
		unitYear = "年",
		renderYear,
		renderMonth,
		onClick,
	} = props;

	return (
		<a className='i-datepicker-action' data-ripple onClick={onClick}>
			<span>{renderYear?.(value.year())}</span>
			{unitYear}
			<span>{renderMonth?.(value.month() + 1)}</span>
			{unitMonth}
		</a>
	);
};

const Panel = (props: IBaseDates) => {
	const {
		value,
		unitYear,
		unitMonth,
		renderDate,
		renderMonth = (m: ReactNode) => m,
		renderYear = (y: ReactNode) => y,
		disabledDate,
		onDateClick,
	} = props;

	const [today, setToday] = useState(value);
	const [month, setMonth] = useState(value || dayjs());
	const [selectedYear, setSelectedYear] = useState(dayjs());
	const [years, setYears] = useState<number[]>([]);
	const [selectable, setSelectable] = useState(false);

	const $years = useRef<HTMLDivElement>(null);

	const handleOperateMonth = (next: boolean) => {
		setMonth((m) => m[next ? "add" : "subtract"](1, "month"));
	};

	const handleChangeDate = (date: Dayjs) => {
		if (date.isSame(today, "day")) return;

		if (!date.isSame(month, "month")) {
			setMonth(date);
		}

		setToday(date);
		onDateClick?.(date);
	};

	const handleChangeMonth = (month: number) => {
		setMonth((m) => m.year(selectedYear.year()).month(month - 1));
		setSelectable(false);
	};

	const getMoreYears = throttle({ interval: 100 }, (e) => {
		const isUp = e.deltaY < 0;

		setYears((ys) => ys.map((y) => y + (isUp ? -1 : 1)));
	});

	useEffect(() => {
		if (!selectable) return;

		setSelectedYear(month);
		const y = month.year();
		const nextYears = Array.from({ length: 7 }).map((_, i) => y - 3 + i);

		setYears([...nextYears]);
	}, [selectable, month]);

	useEffect(() => {
		setToday(value);
		setMonth(value || dayjs());
	}, [value]);

	return (
		<div className='i-datepicker'>
			<div className='i-datepicker-units'>
				<YearMonth
					value={month}
					unitYear={unitYear}
					unitMonth={unitMonth}
					renderMonth={renderMonth}
					renderYear={renderYear}
					onClick={() => setSelectable(true)}
				/>
				<a
					className='ml-auto i-datepicker-action'
					data-ripple
					onClick={() => handleOperateMonth(false)}
				>
					<Icon icon={<KeyboardArrowLeftRound />} />
				</a>
				<a
					className='i-datepicker-action'
					data-ripple
					onClick={() => handleOperateMonth(true)}
				>
					<Icon icon={<KeyboardArrowRightRound />} />
				</a>
			</div>

			<div
				className={classNames("i-datepicker-ym", {
					"i-datepicker-active": selectable,
				})}
			>
				<Helpericon
					active
					className='i-datepicker-close'
					onClick={(e) => {
						e.stopPropagation();
						setSelectable(false);
					}}
				/>

				<div
					ref={$years}
					className='i-datepicker-years'
					onWheel={getMoreYears}
				>
					{years.map((y) => (
						<a
							key={y}
							className={classNames("i-datepicker-year", {
								"i-datepicker-active":
									y === selectedYear.year(),
							})}
							onClick={() => setSelectedYear((sy) => sy.year(y))}
						>
							{renderYear(y)}
						</a>
					))}
				</div>

				<div className='i-datepicker-months'>
					{MONTHS.map((m) => {
						return (
							<a
								key={m}
								className={classNames("i-datepicker-month", {
									"i-datepicker-active":
										m === month.month() + 1,
								})}
								onClick={() => handleChangeMonth(m)}
							>
								{renderMonth(m)}
							</a>
						);
					})}
				</div>
			</div>

			<Dates
				value={today}
				month={month}
				disabledDate={disabledDate}
				onDateClick={handleChangeDate}
				renderDate={renderDate}
			/>
		</div>
	);
};

export default Panel;
