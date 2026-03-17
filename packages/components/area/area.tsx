import classNames from "classnames";
import "./area.css";
import Item from "./item";
import type { CompositionArea, IArea } from "./type";

const Area = ((props: IArea) => {
	const { layout = "ltcb", style, className, children } = props;

	return (
		<div
			style={style}
			className={classNames(`i-area i-area-${layout}`, className)}
		>
			{children}
		</div>
	);
}) as CompositionArea;

Area.Item = Item;

export default Area;
