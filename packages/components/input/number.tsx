import { clamp, formatNumber } from "@p/js/utils";
import { MinusRound, PlusRound } from "@ricons/material";
import { useMemoizedFn, useReactive } from "ahooks";
import classNames from "classnames";
import { ChangeEvent, forwardRef, useCallback, useEffect } from "react";
import "../../css/input.css";
import Helpericon from "../utils/helpericon";
import InputContainer from "./container";
import type { IInputNumber } from "./type";

const Number = forwardRef<HTMLInputElement, IInputNumber>((props, ref) => {
	const {
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
		...rest
	} = props;

	const state = useReactive({
		value,
	});

	const getRangeNumber = useCallback(
		(v: number) => clamp(v, min, max),
		[min, max]
	);

	const getFormatNumber = useCallback(
		(v: number) => formatNumber(v, { precision, thousand }),
		[precision, thousand]
	);

	const formatInputValue = useCallback(
		(v?: string | number) => {
			if (!v) return "";
			if (typeof v === "number" || !thousand) return v;

			return v.replaceAll(thousand, "");
		},
		[thousand]
	);

	const handleChange = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const v = formatInputValue(value.replace(/[^\d\.-]/g, ""));

		state.value = v;
		onChange?.(+v, e);
	});

	const handleOperate = useMemoizedFn((param: number) => {
		const value = formatInputValue(state.value) ?? 0;
		const result = getRangeNumber(+value + param);

		state.value = getFormatNumber(result);

		onChange?.(result);
	});

	useEffect(() => {
		state.value = value;
	}, [value]);

	const inputProps = {
		ref,
		name,
		value: state.value,
		className: "i-input i-input-number",
		onChange: handleChange,
		...rest,
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
});

export default Number;
