import classNames from "classnames";
import { ChangeEvent, useEffect, useState } from "react";
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
		optionValue,
		children,
		onChange,
		...restProps
	} = props;

	const [checked, setChecked] = useState(value);
	const [itemStatus, setItemStatus] = useState(status);
	const [itemMessage, setItemMessage] = useState(message);
	const isChildrenFn = typeof children === "function";

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const next = e.target.checked;
		setChecked(next);
		setItemStatus(status);
		setItemMessage(message);
		onChange?.(next, e);
	};

	useEffect(() => {
		setChecked(value);
	}, [value]);

	useEffect(() => {
		setItemStatus(status);
		setItemMessage(message);
	}, [status, message]);

	return (
		<label
			className={classNames(
				"i-checkbox-item",
				{
					[`i-checkbox-${itemStatus}`]: itemStatus !== "normal",
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
				checked={checked}
				disabled={disabled}
				onChange={handleChange}
			/>

			{isChildrenFn ? (
				children(checked, optionValue)
			) : (
				<span className='i-checkbox-text'>{children || label}</span>
			)}

			{itemMessage && (
				<span className='i-checkbox-message'>*{itemMessage}</span>
			)}
		</label>
	);
}
