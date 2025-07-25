import { useReactive } from "ahooks";
import classNames from "classnames";
import { ChangeEvent, useEffect, useImperativeHandle, useRef } from "react";
import "../../css/input.css";
import InputContainer from "./container";
import type { ITextarea } from "./type";

const Textarea = (props: ITextarea) => {
	const {
		ref,
		label,
		name,
		value = "",
		labelInline,
		className,
		status = "normal",
		message,
		tip,
		autoSize,
		border,
		width,
		style,
		onChange,
		onEnter,
		...restProps
	} = props;

	const state = useReactive({
		value,
	});
	const refTextarea = useRef<HTMLTextAreaElement>(null);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const v = e.target.value;

		state.value = v;

		const ta = refTextarea.current as HTMLElement;
		if (autoSize && ta) {
			ta.style.height = `${ta.scrollHeight}px`;
		}

		onChange?.(v, e);
	};

	const handleKeydown = (e) => {
		if (e.code !== "Enter") return;

		e.stopPropagation();
		onEnter?.(e);
	};

	useEffect(() => {
		state.value = value;
	}, [value]);

	useImperativeHandle(ref, () => {
		return {
			input: refTextarea.current,
		};
	});

	const inputProps = {
		ref: refTextarea,
		name,
		value: state.value,
		className: "i-input i-textarea",
		onChange: handleChange,
		onKeyDown: handleKeydown,
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
				<textarea {...inputProps} />
			</div>
		</InputContainer>
	);
};

export default Textarea;
