import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import "./index.css";
import { IScroll } from "./type";

const Scroll = (props: IScroll) => {
	const { style, className, draggable, onScroll, children, ...restProps } =
		props;
	const scrollRef = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState(false);
	const dragState = useRef({ down: false, startX: 0, scrollLeft: 0 });

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const onWheel = (e: WheelEvent) => {
			const canScroll = el.scrollWidth > el.clientWidth + 1;
			if (!canScroll) return;

			e.preventDefault();
			e.stopPropagation();

			const delta =
				Math.abs(e.deltaX) > Math.abs(e.deltaY)
					? e.deltaX
					: e.deltaY;
			el.scrollLeft += delta;
		};

		const opts: AddEventListenerOptions = {
			passive: false,
			capture: true,
		};
		el.addEventListener("wheel", onWheel, opts);
		return () => el.removeEventListener("wheel", onWheel, opts);
	}, []);

	useEffect(() => {
		if (!draggable) return;

		const handleMouseMove = (e: MouseEvent) => {
			if (!dragState.current.down || !scrollRef.current) return;
			const x = e.clientX - dragState.current.startX;
			scrollRef.current.scrollLeft =
				dragState.current.scrollLeft - x;
		};

		const handleMouseUp = () => {
			dragState.current.down = false;
			setDragging(false);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [draggable]);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (!draggable || !scrollRef.current) return;
		setDragging(true);
		dragState.current = {
			down: true,
			startX: e.clientX,
			scrollLeft: scrollRef.current.scrollLeft,
		};
	};

	return (
		<div
			ref={scrollRef}
			className={classNames("i-scroll", className, {
				"i-scroll-draggable": draggable,
				"i-scroll-dragging": dragging,
			})}
			style={style}
			onScroll={onScroll}
			onMouseDown={handleMouseDown}
			{...restProps}
		>
			{children}
		</div>
	);
};

export default Scroll;
