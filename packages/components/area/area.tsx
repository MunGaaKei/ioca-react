import classNames from "classnames";
import "./area.css";
import Item from "./item";

function Area<IArea>(props) {
	const { layout = "ltcb", style, className, children } = props;

	return (
		<div
			style={style}
			className={classNames(`i-area i-area-${layout}`, className)}
		>
			{children}
		</div>
	);
}

Area.Item = Item;

export default Area;
