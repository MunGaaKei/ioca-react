import { CheckRound, SearchRound } from "@ricons/material";
import classNames from "classnames";
import { TOption } from "../../type";
import Icon from "../icon";
import List from "../list";
import Tag from "../tag";
import Empty from "../utils/empty";
import { ISelectOptions } from "./type";
export const Options = (props: ISelectOptions) => {
	const {
		value: val,
		options,
		filter,
		filterPlaceholder,
		multiple,
		empty = <Empty />,
		onSelect,
		onFilter,
	} = props;

	return (
		<div
			className={classNames("i-select-options", {
				"i-select-options-multiple": multiple,
			})}
		>
			{filter && multiple && (
				<div className='i-select-filter'>
					<Icon
						icon={<SearchRound />}
						className='color-8 ml-8 my-auto'
						size='1.2em'
					/>
					<input
						type='text'
						className='i-input'
						placeholder={filterPlaceholder}
						onChange={onFilter}
					/>
				</div>
			)}

			{options.length === 0 && empty}

			{options.map((option, i) => {
				const { label, value, disabled } = option;
				const isActive = multiple
					? val?.includes(value)
					: val === value;

				return (
					<List.Item
						key={(value as string) || i}
						active={isActive}
						type='option'
						onClick={() => onSelect?.(value, option)}
						disabled={disabled}
					>
						{multiple && (
							<Icon
								icon={<CheckRound />}
								className='i-select-option-check'
								size='1em'
							/>
						)}
						{label}
					</List.Item>
				);
			})}
		</div>
	);
};

export const activeOptions = (
	options: TOption[] = [],
	value: any[] = [],
	max = 3
) => {
	const total = options.flatMap((opt) =>
		value.includes(opt.value) ? [opt] : []
	);

	if (max >= total.length) return total;

	const rest = total.length - max;
	const after = total.slice(0, max);
	after.push(rest as any);

	return after;
};

export const displayValue = (config) => {
	const { options, value, maxDisplay, multiple, onSelect } = config;

	if (multiple) {
		return activeOptions(options, value, maxDisplay).map((opt, i) => {
			if (typeof opt === "number") return <Tag key={i}>+{opt}</Tag>;

			const { label, value } = opt;

			return (
				<Tag
					key={value as string}
					hoverShowClose
					onClose={(e) => {
						e?.stopPropagation();
						onSelect?.(value, opt);
					}}
				>
					{label}
				</Tag>
			);
		});
	}

	return options.find((opt: TOption) => opt.value === value)?.label;
};
