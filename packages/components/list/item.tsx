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
		className,
		children,
		...restProps
	} = props;

	return (
		<li
			ref={ref}
			className={classNames("i-list-item", className, {
				"i-list-item-active": active,
				"i-list-option": type === "option",
				disabled,
			})}
			style={{ alignItems: align, ...style }}
			{...restProps}
		>
			{label !== undefined && (
				<span className='i-list-item-label'>{label}</span>
			)}
			{children}
		</li>
	);
};

export default Item;
