import { MinusRound, PlusRound, SyncAltRound } from "@ricons/material";
import { useReactive } from "ahooks";
import classNames from "classnames";
import { ChangeEvent, MouseEvent, useEffect } from "react";
import "../../css/input.css";
import { clamp, formatNumber } from "../../js/utils";
import Helpericon from "../utils/helpericon";
import InputContainer from "./container";
import type { IInputRange } from "./type";

const Range = (props: IInputRange) => {
	const {
		label,
		name,
		value,
		labelInline,
		min = -Infinity,
		max = Infinity,
		type,
		className,
		status = "normal",
		message,
		tip,
		append,
		prepend,
		step = 1,
		width,
		thousand,
		precision,
		hideControl,
		placeholder,
		border,
		autoSwitch,
		onChange,
		onBlur,
		style,
		...restProps
	} = props;

	const state = useReactive({
		value,
	});

	const getRangeNumber = (v: number) => clamp(v, min, max);

	const getFormatNumber = (v: number) =>
		formatNumber(v, { precision, thousand });

	const formatInputValue = (v?: string | number) => {
		if (!v) return "";
		if (typeof v === "number" || !thousand) return v;

		return v.replaceAll(thousand, "");
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
		const { value } = e.target;
		const v = formatInputValue(value.replace(/[^\d\.-]/g, ""));
		const range = Array.isArray(state.value) ? state.value : [];

		range[i] = v;
		state.value = range;
		onChange?.(range, e);
	};

	const handleOperate = (
		e: MouseEvent<Element>,
		param: number,
		i: number
	) => {
		e.preventDefault();
		e.stopPropagation();

		const range = Array.isArray(state.value) ? state.value : [];
		const value = formatInputValue(range[i]) ?? 0;
		const result = getRangeNumber(+value + param);

		range[i] = getFormatNumber(result);

		state.value = range;
		onChange?.(range, e);
	};

	const handleSwitch = (e?: MouseEvent) => {
		e?.preventDefault();
		e?.stopPropagation();
		const range = state.value ? state.value : [];
		[range[0], range[1]] = [range[1], range[0]];

		state.value = range;
		onChange?.(range);
	};

	useEffect(() => {
		state.value = value;
	}, [value]);

	const inputProps = {
		name,
		className: "i-input i-input-number",
		...restProps,
	};

	const handleBlur = () => {
		if (!autoSwitch) return;
		const range = Array.isArray(state.value) ? state.value : [];

		if (range.length < 2) return;

		const [left, right] = range.map(Number);
		if (left > right) {
			handleSwitch();
		}
	};

	return (
		<InputContainer
			label={label}
			labelInline={labelInline}
			className={className}
			style={{ width, ...style }}
			tip={message ?? tip}
			status={status}
		>
			<div
				className={classNames("i-input-item", {
					[`i-input-${status}`]: status !== "normal",
					"i-input-borderless": !border,
				})}
			>
				{prepend && <div className='i-input-prepend'>{prepend}</div>}

				{!hideControl && (
					<Helpericon
						active
						icon={<MinusRound />}
						onClick={(e) => handleOperate(e, -step, 0)}
					/>
				)}

				<input
					value={state.value?.[0] || ""}
					placeholder={placeholder?.[0]}
					{...inputProps}
					onBlur={handleBlur}
					onChange={(e) => handleChange(e, 0)}
				/>

				{!hideControl && (
					<Helpericon
						active
						icon={<PlusRound />}
						onClick={(e) => handleOperate(e, step, 0)}
					/>
				)}
				<Helpericon
					active
					icon={<SyncAltRound />}
					style={{ margin: 0 }}
					onClick={handleSwitch}
				/>
				{!hideControl && (
					<Helpericon
						active
						icon={<MinusRound />}
						onClick={(e) => handleOperate(e, -step, 1)}
					/>
				)}

				<input
					value={state.value?.[1] || ""}
					placeholder={placeholder?.[1]}
					{...inputProps}
					onBlur={handleBlur}
					onChange={(e) => handleChange(e, 1)}
				/>

				{!hideControl && (
					<Helpericon
						active
						icon={<PlusRound />}
						onClick={(e) => handleOperate(e, step, 1)}
					/>
				)}

				{append && <div className='i-input-append'>{append}</div>}
			</div>
		</InputContainer>
	);
};

export default Range;
