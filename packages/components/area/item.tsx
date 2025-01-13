import classNames from "classnames";
import Scrollbars from "react-custom-scrollbars-2";
import { IAreaItem } from "./type";

function Item(props: IAreaItem) {
	const { name = "content", style, className, children, ref } = props;

	return (
		<Scrollbars
			ref={ref}
			className={classNames(`i-area-${name}`, className)}
			style={{ gridArea: name, ...style }}
			autoHide
			renderView={(props) => (
				<div {...props} className='i-area-scrollview' />
			)}
		>
			{children}
		</Scrollbars>
	);
}

export default Item;
