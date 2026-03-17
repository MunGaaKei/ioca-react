import classNames from "classnames";
import { IAreaItem } from "./type";

function Item(props: IAreaItem) {
	const {
		name = "content",
		style,
		className,
		children,
		ref,
		...rest
	} = props;

	return (
		<div
			ref={ref}
			className={classNames(`i-area-${name}`, className)}
			style={{ gridArea: name, ...style }}
		>
			<div {...rest} className='i-area-scrollview'>
				{children}
			</div>
		</div>
	);
}

export default Item;
