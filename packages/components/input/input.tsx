import { VisibilityOffRound, VisibilityRound } from "@ricons/material";
import { useReactive } from "ahooks";
import classNames from "classnames";
import { ChangeEvent, useEffect, useMemo } from "react";
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
		value = props.initValue ?? "",
		initValue = "",
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
		required,
		maxLength,
		onChange,
		onEnter,
		style,
		...restProps
	} = props;

	const state = useReactive({
		value,
		type,
		visible: false,
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const v = e.target.value;

		state.value = v;
		onChange?.(v, e);
	};

	const handleKeydown = (e) => {
		e.code === "Enter" && onEnter?.(e);
	};

	const handleHelperClick = () => {
		if (type === "password" && !hideVisible) {
			Object.assign(state, {
				visible: !state.visible,
				type: !state.visible ? "text" : "password",
			});
			return;
		}

		const v = "";
		onChange?.(v);
	};

	const HelperIcon = useMemo(() => {
		if (type === "password") {
			return state.visible ? <VisibilityRound /> : <VisibilityOffRound />;
		}

		return undefined;
	}, [state.visible]);

	useEffect(() => {
		state.value = value;
	}, [value]);

	const inputProps = {
		ref,
		type: state.type,
		name,
		value: state.value,
		maxLength,
		className: classNames("i-input", `i-input-${type}`),
		onChange: handleChange,
		onKeyDown: handleKeydown,
		...restProps,
	};

	const clearable = clear && state.value;
	const showHelper = type === "password" && !!state.value;

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
				})}
			>
				{prepend && <div className='i-input-prepend'>{prepend}</div>}

				<input {...inputProps} />

				{maxLength && state.value?.length > 0 && (
					<span className='color-8 pr-4 font-sm'>
						{state.value.length} / {maxLength}
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
