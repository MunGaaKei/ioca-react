import { MinusRound, PlusRound } from "@ricons/material";
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
		value = props.initValue ?? "",
		initValue,
		labelInline,
		step = 1,
		min = -Infinity,
		max = Infinity,
		thousand,
		precision,
		type,
		className,
		status = "normal",
		append,
		border,
		prepend,
		message,
		tip,
		hideControl,
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
		if (typeof v === "number" || !thousand) return v;

		return v.replaceAll(thousand, "");
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const v = formatInputValue(value.replace(/[^\d\.-]/g, ""));

		state.value = v;
		onChange?.(+v, e);
	};

	const handleOperate = (param: number) => {
		const value = formatInputValue(state.value) ?? 0;
		const result = getRangeNumber(+value + param);

		state.value = getFormatNumber(result);

		onChange?.(result);
	};

	useEffect(() => {
		state.value = value;
	}, [value]);

	const inputProps = {
		ref,
		name,
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
			style={style}
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
						onClick={() => handleOperate(-step)}
					/>
				)}

				<input {...inputProps} />

				{!hideControl && (
					<Helpericon
						active
						icon={<PlusRound />}
						onClick={() => handleOperate(step)}
					/>
				)}

				{append && <div className='i-input-append'>{append}</div>}
			</div>
		</InputContainer>
	);
};

export default Number;
