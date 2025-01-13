import { useMouseMove, useMouseUp } from "@p/js/hooks";
import { useReactive } from "ahooks";
import classNames from "classnames";
import { useRef } from "react";
import "./index.css";
import { IResizable } from "./type";

const Resizable = (props: IResizable) => {
	const {
		other,
		children,
		vertical,
		height,
		size = "auto",
		minSize = 0,
		maxSize = "100%",
		style,
		line,
		className,
		asPercent,
		onResize,
		onResizeComplete,
	} = props;

	const state = useReactive({
		size,
		resizing: false,
		start: 0,
		total: 0,
	});

	const ref = useRef<HTMLDivElement>(null);

	const handleMouseDown = () => {
		const rect = ref.current?.getBoundingClientRect();
		if (!rect) return;

		state.resizing = true;

		if (vertical) {
			state.total = rect.height;
			state.start = rect.top;
			return;
		}

		state.total = rect.width;
		state.start = rect.left;
	};

	const handleMouseMove = (e) => {
		if (!state.resizing) return;

		e.preventDefault();

		if (e.touches) {
			e = e.touches[0];
		}

		const d = e[vertical ? "pageY" : "pageX"];
		const offset = d - state.start;

		state.size = asPercent ? `${(offset / state.total) * 100}%` : offset;
		onResize?.(state.size);
	};

	const handleMouseUp = () => {
		if (!state.resizing) return;

		state.resizing = false;
		onResizeComplete?.(state.size);
	};

	useMouseUp(handleMouseUp);
	useMouseMove(handleMouseMove);

	return (
		<div
			ref={ref}
			className={classNames("i-resizable", className, {
				[`i-resizable-vertical`]: vertical,
			})}
			style={{ ...style, height }}
		>
			<div
				className='i-resizable-a'
				style={{
					[vertical ? "height" : "width"]: state.size,
					[vertical ? "minHeight" : "minWidth"]: minSize,
					[vertical ? "maxHeight" : "maxWidth"]: maxSize,
				}}
			>
				{other}
			</div>

			<div
				className={classNames("i-resizable-line", {
					[`i-resizable-resizing`]: state.resizing,
				})}
				onMouseDown={handleMouseDown}
				onTouchStart={handleMouseDown}
				onContextMenu={(e) => e.preventDefault()}
			>
				<div className='i-resizable-line-node'>{line}</div>
			</div>

			<div className='i-resizable-b'>{children}</div>
		</div>
	);
};

export default Resizable;
