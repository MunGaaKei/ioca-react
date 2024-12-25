import { useReactive } from "ahooks";
import { useEffect, useMemo } from "react";
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
	const state = useReactive<any>({
		period: undefined,
		hour: undefined,
		minute: undefined,
		second: undefined,
	});

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

	const updateValue = () => {
		const reg = /(hh|h){1}|(mm|m){1}|(ss|s){1}/gi;
		let result = format.replace(reg, (pattern) => {
			const p = pattern.toLowerCase();
			const u = UnitMaps[p];
			const n = state[u] ?? 0;

			return p.length > 1 && n < 10 ? `0${n ?? 0}` : n ?? 0;
		});

		if (periods && hours.length > 0) {
			result = `${state.period ?? periods[0]} ${result}`;
		}

		onChange(result);
	};

	const handleSetTime = (v, unit) => {
		state[unit] = v;
		updateValue();
	};

	useEffect(() => {
		let time = value ?? "";

		if (periods && hours.length > 0 && value) {
			const [p, t] = value.split(" ");
			time = t ?? "";
			state.period = periods.includes(p) ? p : undefined;
		}

		const nums = time.match(/\d+/g) ?? [];

		if (!nums.length) {
			onFallback("");
			return;
		}

		let i = 0;
		const r = format.replace(/(hh|h)+|(mm|m)+|(ss|s)+/gi, (p) => {
			const n = nums[i++] ?? 0;
			let o = p;

			if (UnitMaps[p] === "hour") {
				o = Math.min(periods ? 11 : 23, n);
			}

			o = Math.min(59, n);

			state[UnitMaps[p]] = o;
			return p.length > 1 && o < 10 ? `0${o}` : o;
		});

		onFallback(r);
	}, [value]);

	return (
		<div className='i-timepicker'>
			{hours.length > 0 && (
				<>
					{periods && (
						<div className='i-timepicker-list'>
							<Items
								items={periods}
								active={state.period}
								onClick={(p) => handleSetTime(p, "period")}
							/>
						</div>
					)}
					<div className='i-timepicker-list'>
						<Items
							items={hours}
							active={state.hour}
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
						active={state.minute}
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
						active={state.second}
						unit='second'
						renderItem={renderItem}
						onClick={(s) => handleSetTime(s, "second")}
					/>
				</div>
			)}
		</div>
	);
}
