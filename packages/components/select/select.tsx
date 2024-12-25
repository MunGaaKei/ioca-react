import { UnfoldMoreRound } from "@ricons/material";
import { useMemoizedFn, useReactive } from "ahooks";
import classNames from "classnames";
import { debounce } from "radash";
import { ChangeEvent, forwardRef, useEffect, useMemo, useState } from "react";
import "../../css/input.css";
import { formatOption } from "../../js/utils";
import { TOption } from "../../type";
import Popup from "../popup";
import Helpericon from "../utils/helpericon";
import "./index.css";
import { Options, displayValue } from "./options";
import { ISelect } from "./type";

const Select = forwardRef<HTMLInputElement, ISelect>((props, ref) => {
	const {
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

	const state = useReactive({
		inputValue: "",
		filterValue: "",
		value,
		loading: false,
	});

	const [active, setActive] = useState<boolean>(false);

	const formattedOptions = useMemo(() => formatOption(options), [options]);

	const filterOptions = useMemo(() => {
		const { filterValue: fv } = state;
		if (!fv || !filter) return formattedOptions;

		const filterFn =
			typeof filter === "function"
				? filter
				: (opt) => opt.value.includes(fv) || opt.label.includes(fv);

		return formattedOptions.filter(filterFn);
	}, [formattedOptions, filter, state.filterValue]);

	const changeValue = (v: any) => {
		state.value = v;
		onChange?.(v);
	};

	const handleSelect = (value: any, option?: TOption) => {
		onSelect?.(value, option);

		if (multiple) {
			const values = [...(state.value as any[])];
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

		state.filterValue = "";
	};

	const handleHelperClick = () => {
		if (!active) return;

		changeValue(multiple ? [] : "");
	};

	const handleFilterChange = useMemoizedFn(
		debounce({ delay: 400 }, (e: ChangeEvent<HTMLInputElement>) => {
			const v = e.target.value;
			state.filterValue = v;
		})
	);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		state.filterValue = e.target.value;
	};

	useEffect(() => {
		state.value = value;
	}, [value]);

	const hasValue = multiple
		? (state.value as any[]).length > 0
		: !!state.value;
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
				{...popupProps}
				visible={active}
				trigger='none'
				onVisibleChange={handleVisibleChange}
				content={
					<Options
						options={filterOptions}
						value={state.value}
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
						value={state.value}
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
									value: state.value,
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
							value={active ? state.filterValue : state.value}
							className='i-input i-select'
							placeholder={state.value || placeholder}
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
});

export default Select;
