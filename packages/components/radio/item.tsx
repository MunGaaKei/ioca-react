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

	const handleChange = (e: ChangeEvent) => {
		onChange?.(value, e);
	};

	return (
		<label className={classNames("i-radio-item", { disabled })}>
			<input
				type='radio'
				name={name}
				checked={checked}
				className={classNames("i-radio-input", `i-radio-${type}`)}
				disabled={disabled}
				onChange={handleChange}
			/>

			<span className='i-radio-text'>{children}</span>
		</label>
	);
}
