import {
	KeyboardDoubleArrowUpRound,
	MinusRound,
	PlusRound,
} from "@ricons/material";
import { useReactive } from "ahooks";
import classNames from "classnames";
import { ChangeEvent, useEffect } from "react";
import "../../css/input.css";
import { clamp, formatNumber } from "../../js/utils";
import Helpericon from "../utils/helpericon";
import InputContainer from "./container";
import type { IInputNumber } from "./type";

const Number = (props: IInputNumber) => {
	const {
		ref,
		label,
		name,
		value = "",
		labelInline,
		step = 1,
		min = -Infinity,
		max = Infinity,
		thousand,
		precision,
		type,
		className,
		width,
		status = "normal",
		append,
		border,
		prepend,
		disabled,
		message,
		tip,
		hideControl,
		showMax,
		style,
		onChange,
		onEnter,
		onInput,
		onBlur,
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
		if (typeof v === "number") return v.toString();
		if (!thousand) return v;

		return v.split(thousand).join("");
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const v = formatInputValue(value.replace(/[^\d\.-]/g, "")); // 保留负号和小数点
		const numValue = clamp(+v, min, max); // 确保值在范围内

		state.value = getFormatNumber(numValue); // 修复 thousand 格式化
		onChange?.(numValue, e);
	};

	const handleOperate = (param: number) => {
		const value = parseFloat(formatInputValue(state.value)) || 0; // 确保值为数字，默认值为 0
		const result = getRangeNumber(value + param);

		state.value = getFormatNumber(result);

		onChange?.(result);
	};

	const handleMax = () => {
		const result = getRangeNumber(max);
		state.value = getFormatNumber(result);
		onChange?.(result);
	};

	useEffect(() => {
		state.value = value;
	}, [value]);

	const inputProps = {
		ref,
		name,
		disabled,
		value: state.value,
		className: "i-input i-input-number",
		onChange: handleChange,
		...restProps,
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

				{!hideControl && !disabled && (
					<Helpericon
						active
						icon={<MinusRound />}
						onClick={() => handleOperate(-step)}
					/>
				)}

				<input {...inputProps} />

				{!hideControl && !disabled && (
					<Helpericon
						active
						icon={<PlusRound />}
						onClick={() => handleOperate(step)}
					/>
				)}

				{showMax && max && !disabled && (
					<Helpericon
						active
						icon={<KeyboardDoubleArrowUpRound />}
						onClick={handleMax}
					/>
				)}

				{append && <div className='i-input-append'>{append}</div>}
			</div>
		</InputContainer>
	);
};

export default Number;
