import classNames from "classnames";
import { useMemo } from "react";
import { ISwiperItem } from "./type";

function Item(props: ISwiperItem) {
	const {
		index = 0,
		itemIndex = 0,
		active,
		type,
		transition,
		gap = 0,
		itemHeight,
		vertical,
		style,
		className,
		children,
		onItemClick,
	} = props;

	const selfStyle = useMemo(() => {
		if (type === "normal") {
			return {
				[vertical ? "paddingBlock" : "paddingInline"]: gap / 2,
				height: itemHeight,
			};
		}

		return {
			transform: `translate(-${index * 100}%, 0)`,
			transition,
		};
	}, [index, gap, itemHeight, vertical, type]);

	return (
		<div
			style={{ ...style, ...selfStyle }}
			className={classNames("i-swiper-item", className, {
				"i-swiper-active": active,
			})}
			data-index={itemIndex}
			onClick={(e) => onItemClick?.(itemIndex, e)}
		>
			{children}
		</div>
	);
}

export default Item;
