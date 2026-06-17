import classNames from "classnames";
import { IListItem } from "./type";

const Item = (props: IListItem) => {
	const {
		ref,
		active,
		type,
		align,
		disabled,
		label,
		style,
		border,
		className,
		children,
		...restProps
	} = props;

	const handlers: any = {};
	if (disabled) {
		handlers.onClick = (e: any) => { e.preventDefault(); e.stopPropagation(); };
	}

	return (
		<li
			ref={ref}
			className={classNames("i-list-item", className, {
				"i-list-item-active": active,
				"i-list-option": type === "option",
				"i-list-item-bordered": border,
				disabled,
			})}
			style={{ alignItems: align, ...style }}
			aria-disabled={disabled || undefined}
			tabIndex={disabled ? -1 : undefined}
			{...restProps}
			{...handlers}
		>
			{label !== undefined && (
				<span className='i-list-item-label'>{label}</span>
			)}
			{children}
		</li>
	);
};

export default Item;
