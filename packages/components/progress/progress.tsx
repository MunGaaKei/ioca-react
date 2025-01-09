import { useMouseMove, useMouseUp } from "@p/js/hooks";
import { useReactive } from "ahooks";
import classNames from "classnames";
import { useEffect, useMemo, useRef } from "react";
import "../../css/input.css";
import Circle from "./circle";
import "./index.css";
import Line from "./line";
import { IProgress } from "./type";

const Progress = (props: IProgress): JSX.Element => {
	const {
		value = 0,
		size = 8,
		height = 40,
		precision = 0,
		style,
		draggable = true,
		type = "line",
		barClass,
		label,
		labelInline,
		className,
		renderCursor,
		onChange,
	} = props;

	const ref = useRef<HTMLDivElement>(null);
	const state = useReactive({
		value,
		dragging: false,
		width: 0,
		start: 0,
	});

	const toFixedValue = useMemo(() => {
		let value = +state.value.toFixed(precision);
		value = Math.min(100, value);
		value = Math.max(0, value);

		return value;
	}, [state.value, precision]);

	const handleMouseDown = (e) => {
		if (!ref.current || !draggable) return;

		if (e.touches) {
			e = e.touches[0];
		}

		const rect = ref.current.getBoundingClientRect();
		const value = ((e.pageX - rect.left) * 100) / rect.width;

		Object.assign(state, {
			value,
			width: rect.width,
			start: rect.left,
			dragging: true,
		});
	};

	const handleMouseMove = (e) => {
		if (!state.dragging || !draggable) return;
		e.preventDefault();

		if (e.touches) {
			e = e.touches[0];
		}

		const { start, width } = state;
		const offset = e.pageX - start;

		if (offset < 0 || offset > width) return;

		state.value = ((e.pageX - start) * 100) / width;
	};

	const handleMouseUp = () => {
		if (!state.dragging || !draggable) return;

		onChange?.(toFixedValue);
		state.dragging = false;
	};

	useMouseMove(handleMouseMove);
	useMouseUp(handleMouseUp);

	useEffect(() => {
		if (value > 100) {
			state.value = 100;
			return;
		}

		if (value < 0) {
			state.value = 0;
			return;
		}

		state.value = value;
	}, [value]);

	return (
		<div
			className={classNames("i-input-label", className, {
				"i-input-inline": labelInline,
			})}
			style={style}
		>
			{label && <span className='i-input-label-text'>{label}</span>}

			{type === "line" && (
				<Line
					ref={ref}
					size={size}
					barClass={barClass}
					dragging={state.dragging}
					value={state.value}
					renderCursor={renderCursor}
					onMouseDown={handleMouseDown}
					onTouchStart={handleMouseDown}
				/>
			)}

			{type === "circle" && (
				<Circle value={state.value} height={height} size={size} />
			)}
		</div>
	);
};

export default Progress;
