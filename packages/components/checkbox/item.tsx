import { useReactive } from "ahooks";
import classNames from "classnames";
import { ChangeEvent, useEffect } from "react";
import { ICheckboxItem } from "./type";

export default function CheckboxItem(props: ICheckboxItem) {
	const {
		type = "default",
		label,
		name,
		value = false,
		className,
		status = "normal",
		message,
		disabled,
		partof,
		children,
		onChange,
		...restProps
	} = props;

	const state = useReactive({
		value,
		status,
		message,
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked;

		Object.assign(state, {
			value: checked,
			status,
			message,
		});

		onChange?.(checked, e);
	};

	useEffect(() => {
		state.value = value;
	}, [value]);

	return (
		<label
			className={classNames(
				"i-checkbox-item",
				{
					[`i-checkbox-${state.status}`]: state.status !== "normal",
					disabled,
				},
				className
			)}
			{...restProps}
		>
			<input
				type='checkbox'
				name={name}
				className={classNames("i-checkbox-input", {
					[`i-checkbox-${type}`]: !partof,
					"i-checkbox-partof": partof,
				})}
				checked={state.value}
				disabled={disabled}
				onChange={handleChange}
			/>

			<span className='i-checkbox-text'>{children || label}</span>

			{state.message && (
				<span className='i-checkbox-message'>*{state.message}</span>
			)}
		</label>
	);
}
