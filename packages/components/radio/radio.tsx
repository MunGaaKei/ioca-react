import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import "../../css/input.css";
import { formatOption } from "../../js/utils";
import "./index.css";
import RadioItem from "./item";
import { IRadio } from "./type";

function Radio(props: IRadio) {
	const {
		label,
		name,
		options,
		value,
		type = "default",
		status = "normal",
		message,
		optionInline = true,
		labelInline,
		disabled,
		required,
		className,
		renderItem,
		onChange,
	} = props;

	const [selectedValue, setSelectedValue] = useState(value);

	const formattedOptions = useMemo(() => formatOption(options), [options]);

	const handleChange = (value, e) => {
		setSelectedValue(value);
		onChange?.(value, e);
	};

	useEffect(() => {
		setSelectedValue(value);
	}, [value]);

	return (
		<div
			className={classNames(
				"i-radio i-input-label",
				{
					[`i-radio-${status}`]: status !== "normal",
					"i-input-inline": labelInline,
				},
				className
			)}
		>
			{label && (
				<span className='i-input-label-text'>
					{required && <span className='error'>*</span>}
					{label}

					{message && <p className='i-radio-message'>{message}</p>}
				</span>
			)}

			<div
				className={classNames("i-radio-options", {
					"i-options-block": !optionInline,
					"i-radio-options-button": type === "button",
				})}
			>
				{formattedOptions.map((option) => {
					const checked = selectedValue === option.value;

					return (
						<RadioItem
							key={option.value as string}
							name={name}
							value={option.value}
							checked={checked}
							type={type}
							disabled={disabled || option.disabled}
							onChange={handleChange}
						>
							{renderItem ?? option.label}
						</RadioItem>
					);
				})}
			</div>
		</div>
	);
}

Radio.Item = RadioItem;

export default Radio;
