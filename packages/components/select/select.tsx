import { UnfoldMoreRound } from "@ricons/material";
import classNames from "classnames";
import { debounce } from "radash";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import "../../css/input.css";
import { formatOption } from "../../js/utils";
import { TOption } from "../../type";
import Popup from "../popup";
import Helpericon from "../utils/helpericon";
import "./index.css";
import { Options, displayValue } from "./options";
import { ISelect } from "./type";

const Select = (props: ISelect) => {
	const {
		ref,
		type = "text",
		name,
		label,
		value = "",
		placeholder,
		options = [],
		multiple,
		prepend,
		append,
		labelInline,
		style,
		className,
		message,
		status = "normal",
		hideClear,
		hideArrow,
		maxDisplay,
		border,
		filter,
		tip,
		filterPlaceholder = "...",
		popupProps,
		onSelect,
		onChange,
		...restProps
	} = props;

	const [filterValue, setFilterValue] = useState("");
	const [selectedValue, setSelectedValue] = useState(value);

	const [active, setActive] = useState<boolean>(false);

	const formattedOptions = useMemo(() => formatOption(options), [options]);

	const filterOptions = useMemo(() => {
		const fv = filterValue;
		if (!fv || !filter) return formattedOptions;

		const filterFn =
			typeof filter === "function"
				? filter
				: (opt) => opt.value.includes(fv) || opt.label.includes(fv);

		return formattedOptions.filter(filterFn);
	}, [formattedOptions, filter, filterValue]);

	const changeValue = (v: any) => {
		setSelectedValue(v);
		onChange?.(v);
	};

	const displayLabel = useMemo(() => {
		if (multiple) {
			return "";
		}

		const option = formattedOptions.find(
			(opt) => opt.value === selectedValue
		);
		return option ? option.label : selectedValue;
	}, [selectedValue, formattedOptions]);

	const handleSelect = (value: any, option?: TOption) => {
		onSelect?.(value, option);

		if (multiple) {
			const values = [...(selectedValue as any[])];
			const i = values.findIndex((v) => v === value);

			i > -1 ? values.splice(i, 1) : values.push(value);
			changeValue(values as any);

			return;
		}

		setActive(false);
		changeValue(value);
	};

	const handleVisibleChange = (visible: boolean) => {
		setActive(visible);

		if (!filter) return;

		setFilterValue("");
	};

	const handleHelperClick = (e) => {
		e.stopPropagation();
		setActive(true);
		if (!active) return;

		changeValue(multiple ? [] : "");
	};

	const handleFilterChange = debounce(
		{ delay: 400 },
		(e: ChangeEvent<HTMLInputElement>) => {
			const v = e.target.value;
			setFilterValue(v);
		}
	);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFilterValue(e.target.value);
	};

	useEffect(() => {
		setSelectedValue(value);
	}, [value]);

	const hasValue = multiple
		? (selectedValue as any[]).length > 0
		: !!selectedValue;
	const clearable = !hideClear && active && hasValue;
	const text = message ?? tip;

	return (
		<label
			className={classNames("i-input-label", className, {
				"i-input-inline": labelInline,
			})}
			style={style}
		>
			{label && <span className='i-input-label-text'>{label}</span>}

			<Popup
				position='bottom'
				arrow={false}
				fitSize
				offset={0}
				{...popupProps}
				visible={active}
				trigger='none'
				onVisibleChange={handleVisibleChange}
				content={
					<Options
						options={filterOptions}
						value={selectedValue}
						multiple={multiple}
						filter={!!filter}
						filterPlaceholder={filterPlaceholder}
						onSelect={handleSelect}
						onFilter={handleFilterChange}
					/>
				}
			>
				<div
					className={classNames("i-input-item", {
						[`i-input-${status}`]: status !== "normal",
						"i-input-borderless": !border,
						"i-input-focus": active,
					})}
					onClick={() => setActive(true)}
				>
					{prepend}

					<input
						ref={ref}
						type='hidden'
						value={selectedValue}
						{...restProps}
					/>

					{multiple ? (
						hasValue ? (
							<div
								className={classNames("i-input i-select", {
									"i-select-multiple": multiple,
								})}
							>
								{displayValue({
									options: formattedOptions,
									value: selectedValue,
									multiple,
									maxDisplay,
									onSelect: handleSelect,
								})}
							</div>
						) : (
							<input
								className='i-input i-select'
								placeholder={placeholder}
								readOnly
							/>
						)
					) : null}

					{!multiple && (
						<input
							value={active ? filterValue : displayLabel}
							className='i-input i-select'
							placeholder={displayLabel || placeholder}
							onChange={handleInputChange}
							readOnly={!filter}
						/>
					)}

					<Helpericon
						active={!hideArrow}
						icon={clearable ? undefined : <UnfoldMoreRound />}
						onClick={handleHelperClick}
					/>

					{append}
				</div>
			</Popup>

			{text && <span className='i-input-message'>{text}</span>}
		</label>
	);
};

export default Select;
