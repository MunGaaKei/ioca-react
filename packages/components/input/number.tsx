import {
	KeyboardDoubleArrowUpRound,
	MinusRound,
	PlusRound,
} from "@ricons/material";
import classNames from "classnames";
import {
	ChangeEvent,
	useEffect,
	useState,
	type FocusEvent,
	type KeyboardEvent,
} from "react";
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

	const [inputValue, setInputValue] = useState<string>(
		value === undefined || value === null ? "" : String(value),
	);

	const formatOut = (num: number) => {
		const v = clamp(num, min, max);
		if (precision !== undefined)
			return formatNumber(v, { precision, thousand });
		const s = String(v);
		if (!thousand) return s;
		const negative = s.startsWith("-");
		const body = negative ? s.slice(1) : s;
		const [integer, decimal] = body.split(".");
		const withThousand = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
		return decimal
			? `${negative ? "-" : ""}${withThousand}.${decimal}`
			: `${negative ? "-" : ""}${withThousand}`;
	};

	const sanitizeNumberInput = (raw: string) => {
		const hasMinus = raw.startsWith("-");
		let v = raw.replace(/[^\d.]/g, "");
		if (hasMinus) v = `-${v}`;

		const parts = v.split(".");
		if (parts.length > 1) {
			v = `${parts.shift()}.${parts.join("")}`;
		}

		return v;
	};

	const formatInputValue = (v?: string | number) => {
		if (!v) return "";
		if (typeof v === "number") return v.toString();
		if (!thousand) return v;

		return v.split(thousand).join("");
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const v = sanitizeNumberInput(formatInputValue(value));
		const isIntermediate =
			v === "" || v === "-" || v === "." || v === "-." || v.endsWith(".");

		setInputValue(v);
		if (isIntermediate) return;

		const num = parseFloat(v);
		if (globalThis.Number.isNaN(num)) return;

		onChange?.(clamp(num, min, max), e);
		if (precision !== undefined) setInputValue(formatOut(num));
	};

	const handleOperate = (param: number) => {
		const value = parseFloat(formatInputValue(inputValue)) || 0; // 确保值为数字，默认值为 0
		const result = value + param;
		setInputValue(formatOut(result));
		onChange?.(clamp(result, min, max));
	};

	const handleMax = () => {
		setInputValue(formatOut(max));
		onChange?.(clamp(max, min, max));
	};

	const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
		onBlur?.(e);

		const v = sanitizeNumberInput(formatInputValue(inputValue));
		if (!v || v === "-" || v === "." || v === "-.") {
			setInputValue("");
			return;
		}

		const num = parseFloat(v);
		if (globalThis.Number.isNaN(num)) return;

		const numValue = clamp(num, min, max);
		setInputValue(formatOut(numValue));
		onChange?.(numValue, e);
	};

	useEffect(() => {
		setInputValue(
			value === undefined || value === null ? "" : String(value),
		);
	}, [value]);

	const inputProps = {
		ref,
		name,
		disabled,
		value: inputValue,
		className: "i-input i-input-number",
		onChange: handleChange,
		onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
			e.code === "Enter" && onEnter?.(e);
		},
		onInput,
		onBlur: handleBlur,
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
