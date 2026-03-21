import { useEffect, useMemo, useState } from "react";
import "./index.css";
import Items from "./item";

const UnitMaps = {
	h: "hour",
	hh: "hour",
	m: "minute",
	mm: "minute",
	s: "second",
	ss: "second",
};

export default function Panel(props) {
	const {
		value,
		stepH = 1,
		stepM = 1,
		stepS = 1,
		format,
		periods,
		renderItem,
		onChange,
		onFallback,
	} = props;
	const [period, setPeriod] = useState<any>(undefined);
	const [hour, setHour] = useState<any>(undefined);
	const [minute, setMinute] = useState<any>(undefined);
	const [second, setSecond] = useState<any>(undefined);

	const [hours, minutes, seconds] = useMemo(() => {
		const hasH = format.includes("h");
		const hasM = format.includes("m");
		const hasS = format.includes("s");
		const hours = hasH
			? Array.from(
					{ length: (periods ? 12 : 24) / stepH },
					(_, i) => i * stepH
			  )
			: [];
		const minutes = hasM
			? Array.from({ length: 60 / stepM }, (_, i) => i * stepM)
			: [];
		const seconds = hasS
			? Array.from({ length: 60 / stepS }, (_, i) => i * stepS)
			: [];

		return [hours, minutes, seconds];
	}, [stepH, stepM, stepS, format, periods]);

	const updateValue = (next?: {
		period?: any;
		hour?: any;
		minute?: any;
		second?: any;
	}) => {
		const nextPeriod = next?.period ?? period;
		const nextHour = next?.hour ?? hour;
		const nextMinute = next?.minute ?? minute;
		const nextSecond = next?.second ?? second;

		const reg = /(hh|h){1}|(mm|m){1}|(ss|s){1}/gi;
		let result = format.replace(reg, (pattern) => {
			const p = pattern.toLowerCase();
			const u = UnitMaps[p];
			const n =
				u === "hour"
					? (nextHour ?? 0)
					: u === "minute"
						? (nextMinute ?? 0)
						: (nextSecond ?? 0);

			return p.length > 1 && n < 10 ? `0${n ?? 0}` : n ?? 0;
		});

		if (periods && hours.length > 0) {
			result = `${nextPeriod ?? periods[0]} ${result}`;
		}

		onChange(result);
	};

	const handleSetTime = (v, unit) => {
		const next = { period, hour, minute, second, [unit]: v };

		if (unit === "period") setPeriod(v);
		if (unit === "hour") setHour(v);
		if (unit === "minute") setMinute(v);
		if (unit === "second") setSecond(v);

		updateValue(next);
	};

	useEffect(() => {
		let time = value ?? "";

		if (periods && hours.length > 0 && value) {
			const [p, t] = value.split(" ");
			time = t ?? "";
			setPeriod(periods.includes(p) ? p : undefined);
		}

		const nums = time.match(/\d+/g) ?? [];

		if (!nums.length) {
			onFallback("");
			return;
		}

		let i = 0;
		const parsed = {
			hour: undefined,
			minute: undefined,
			second: undefined,
		};
		const r = format.replace(/(hh|h)+|(mm|m)+|(ss|s)+/gi, (p) => {
			const n = nums[i++] ?? 0;
			const o = Math.min(59, n);
			parsed[UnitMaps[p]] = o;
			return p.length > 1 && o < 10 ? `0${o}` : o;
		});

		setHour(parsed.hour);
		setMinute(parsed.minute);
		setSecond(parsed.second);
		onFallback(r);
	}, [value, format, hours.length, periods]);

	return (
		<div className='i-timepicker'>
			{hours.length > 0 && (
				<>
					{periods && (
						<div className='i-timepicker-list'>
							<Items
								items={periods}
								active={period}
								onClick={(p) => handleSetTime(p, "period")}
							/>
						</div>
					)}
					<div className='i-timepicker-list'>
						<Items
							items={hours}
							active={hour}
							unit='hour'
							renderItem={renderItem}
							onClick={(h) => handleSetTime(h, "hour")}
						/>
					</div>
				</>
			)}
			{minutes.length > 0 && (
				<div className='i-timepicker-list'>
					<Items
						items={minutes}
						active={minute}
						unit='minute'
						renderItem={renderItem}
						onClick={(m) => handleSetTime(m, "minute")}
					/>
				</div>
			)}
			{seconds.length > 0 && (
				<div className='i-timepicker-list'>
					<Items
						items={seconds}
						active={second}
						unit='second'
						renderItem={renderItem}
						onClick={(s) => handleSetTime(s, "second")}
					/>
				</div>
			)}
		</div>
	);
}
