import classNames from "classnames";
import { ChangeEvent } from "react";
import { IRadioItem } from "./type";

export default function RadioItem(props: IRadioItem) {
	const {
		type = "default",
		name,
		value,
		checked,
		disabled,
		children,
		onChange,
	} = props;
	const isChildrenFn = typeof children === "function";

	const handleChange = (e: ChangeEvent) => {
		onChange?.(value, e);
	};

	return (
		<label
			className={classNames("i-radio-item", {
				disabled,
				"i-radio-item-custom": isChildrenFn,
			})}
		>
			<input
				type='radio'
				name={name}
				checked={checked}
				className={classNames("i-radio-input", `i-radio-${type}`)}
				disabled={disabled}
				hidden={isChildrenFn}
				onChange={handleChange}
			/>

			{isChildrenFn ? (
				children(!!checked, value)
			) : (
				<span className='i-radio-text'>{children}</span>
			)}
		</label>
	);
}
