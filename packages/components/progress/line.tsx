import classNames from "classnames";
import { MouseEvent, forwardRef } from "react";
import { IProgress } from "./type";

const Line = forwardRef<
	HTMLDivElement,
	Pick<IProgress, "value" | "size" | "barClass" | "renderCursor"> & {
		dragging: boolean;
		onMouseDown: (e: MouseEvent) => void;
	}
>((props, ref) => {
	const { value, size, barClass, dragging, renderCursor, onMouseDown } =
		props;

	return (
		<div
			ref={ref}
			className='i-progress'
			style={{ height: size }}
			onMouseDown={onMouseDown}
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
});

export default Line;
