import { useReactive } from "ahooks";
import classNames from "classnames";
import { useEffect, useMemo } from "react";
import "../../css/input.css";
import { formatOption } from "../../js/utils";
import "./index.css";
import CheckboxItem from "./item";
import type { ICheckbox } from "./type";

function Checkbox(props: ICheckbox) {
	const {
		label,
		name,
		options = [],
		value = "",
		type = "default",
		optionInline = true,
		labelInline,
		disabled,
		status = "normal",
		message,
		required,
		className,
		renderItem,
		onChange,
		...restProps
	} = props;

	const state = useReactive<{
		value: any;
	}>({
		value,
	});

	const formattedOptions = useMemo(() => formatOption(options), [options]);

	const handleChange = (checked, opt, e) => {
		const group = [...state.value];
		const i = group.findIndex((item) => item === opt.value);

		if (checked && i < 0) {
			group.push(opt.value);
		} else if (!checked && i > -1) {
			group.splice(i, 1);
		}

		state.value = group;
		onChange?.(group, opt, e);
	};

	useEffect(() => {
		state.value = value;
	}, [value]);

	return (
		<div
			className={classNames(
				"i-checkbox i-input-label",
				{
					[`i-checkbox-${status}`]: status !== "normal",
					"i-input-inline": labelInline,
				},

				className
			)}
			{...restProps}
		>
			{label && (
				<span className='i-input-label-text'>
					{required && <span className='error'>*</span>}
					{label}

					{message && <p className='i-checkbox-message'>{message}</p>}
				</span>
			)}

			<div
				className={classNames("i-checkbox-options", {
					"i-options-block": !optionInline,
					"i-checkbox-options-button": type === "button",
				})}
			>
				{formattedOptions.map((option) => {
					return (
						<CheckboxItem
							key={option.value as string}
							name={name}
							value={state.value.includes(option.value)}
							optionValue={option.value}
							type={type}
							disabled={disabled || option.disabled}
							onChange={(checked, e) =>
								handleChange(checked, option, e)
							}
						>
							{renderItem ?? option.label}
						</CheckboxItem>
					);
				})}
			</div>
		</div>
	);
}

Checkbox.Item = CheckboxItem;

export default Checkbox;
