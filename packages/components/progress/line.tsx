import classNames from "classnames";
import { MouseEvent, RefObject } from "react";
import { IProgress } from "./type";

const Line = (
	props: Pick<IProgress, "value" | "size" | "barClass" | "renderCursor"> & {
		ref: RefObject<HTMLDivElement | null>;
		dragging: boolean;
		onMouseDown: (e: MouseEvent) => void;
		onTouchStart: (e) => void;
	}
) => {
	const {
		ref,
		value,
		size,
		barClass,
		dragging,
		renderCursor,
		onMouseDown,
		onTouchStart,
	} = props;

	return (
		<div
			ref={ref}
			className='i-progress'
			style={{ height: size }}
			onMouseDown={onMouseDown}
			onTouchStart={onTouchStart}
		>
			<div
				className={classNames("i-progress-bar", barClass, {
					"no-transition": dragging,
				})}
				style={{ width: `${value}%` }}
			>
				{renderCursor && (
					<a className='i-progress-cursor'>
						{renderCursor(value ?? 0)}
					</a>
				)}
			</div>
		</div>
	);
};

export default Line;
