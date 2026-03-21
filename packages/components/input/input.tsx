import { VisibilityOffRound, VisibilityRound } from "@ricons/material";
import classNames from "classnames";
import {
	ChangeEvent,
	useEffect,
	useMemo,
	useState,
	type KeyboardEvent,
} from "react";
import "../../css/input.css";
import Helpericon from "../utils/helpericon";
import InputContainer from "./container";
import Number from "./number";
import Range from "./range";
import Textarea from "./textarea";
import type { CompositionInput, IInput } from "./type";

const Input = ((props: IInput) => {
	const {
		ref,
		type = "text",
		label,
		name,
		value = "",
		prepend,
		append,
		labelInline,
		className,
		status = "normal",
		message,
		tip,
		clear,
		width,
		hideVisible,
		border,
		underline,
		required,
		maxLength,
		onChange,
		onEnter,
		onClear,
		style,
		...restProps
	} = props;

	const [inputValue, setInputValue] = useState(value);
	const [inputType, setInputType] = useState(type);
	const [visible, setVisible] = useState(false);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const v = e.target.value;

		setInputValue(v);
		onChange?.(v, e);
	};

	const handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
		e.code === "Enter" && onEnter?.(e);
	};

	const handleHelperClick = () => {
		if (type === "password" && !hideVisible) {
			setVisible((v) => {
				const next = !v;
				setInputType(next ? "text" : "password");
				return next;
			});
			return;
		}

		const v = "";
		setInputValue(v);
		onChange?.(v);
		onClear?.();
	};

	const HelperIcon = useMemo(() => {
		if (type === "password") {
			return visible ? <VisibilityRound /> : <VisibilityOffRound />;
		}

		return undefined;
	}, [type, visible]);

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	const inputProps = {
		ref,
		type: inputType,
		name,
		value: inputValue,
		maxLength,
		className: classNames("i-input", `i-input-${type}`),
		onChange: handleChange,
		onKeyDown: handleKeydown,
		...restProps,
	};

	useEffect(() => {
		setInputType(type);
		setVisible(false);
	}, [type]);

	const clearable = clear && inputValue;
	const showHelper = type === "password" && !!inputValue;

	return (
		<InputContainer
			label={label}
			labelInline={labelInline}
			className={className}
			style={{ width, ...style }}
			tip={message ?? tip}
			status={status}
			required={required}
		>
			<div
				className={classNames("i-input-item", {
					[`i-input-${status}`]: status !== "normal",
					"i-input-borderless": !border,
					"i-input-underline": underline,
				})}
			>
				{prepend && <div className='i-input-prepend'>{prepend}</div>}

				<input {...inputProps} />

				{maxLength && inputValue?.length > 0 && (
					<span className='color-8 pr-4 font-sm'>
						{inputValue.length} / {maxLength}
					</span>
				)}

				<Helpericon
					active={!!clearable || showHelper}
					icon={HelperIcon}
					onClick={handleHelperClick}
				/>

				{append && <div className='i-input-append'>{append}</div>}
			</div>
		</InputContainer>
	);
}) as CompositionInput;

Input.Textarea = Textarea;
Input.Number = Number;
Input.Range = Range;

export default Input;
