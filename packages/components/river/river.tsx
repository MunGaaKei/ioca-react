import { useReactive } from "ahooks";
import classNames from "classnames";
import { Children, useLayoutEffect, useMemo, useRef } from "react";
import "./index.css";
import { IRiver } from "./type";

const River = (props: IRiver) => {
	const {
		children,
		className,
		speed = 1,
		pauseOnHover,
		...restProps
	} = props;
	const trackRef = useRef<HTMLDivElement>(null);
	const state = useReactive<any>({
		initialized: false,
		offset: 0,
		queue: [],
		paddingLeft: 0,
		pause: false,
	});
	const rafRef = useRef<any>(null);
	const sizeRef = useRef<number[]>([]);
	const [items, length] = useMemo(() => {
		const nodes = Children.toArray(children);

		return [nodes, nodes.length];
	}, [children]);

	const animate = () => {
		if (!trackRef.current) return;

		let next = state.offset - speed;
		const d = Math.abs(next);
		const [head, ...restQueue] = state.queue;
		const size = sizeRef.current.at(head % length) ?? 0;

		if (d > size) {
			const tail = state.queue.at(-1);
			const newQueue = [...restQueue, tail + 1];

			state.queue = newQueue;
			next += size;
		}

		state.offset = next;

		if (!state.pause) {
			rafRef.current = requestAnimationFrame(animate);
		}
	};

	const cancelRaf = () => {
		if (!rafRef.current) return;

		cancelAnimationFrame(rafRef.current);
		rafRef.current = null;
	};

	const handleMouseOver = () => {
		if (!pauseOnHover) return;

		state.pause = true;
		cancelRaf();
	};

	const handleMouseLeave = () => {
		if (!pauseOnHover) return;

		state.pause = false;
		rafRef.current = requestAnimationFrame(animate);
	};

	useLayoutEffect(() => {
		if (!trackRef.current) return;

		const pa = trackRef.current.offsetParent as HTMLDivElement;
		const parentWidth = pa.offsetWidth;
		const nodes = Array.from(trackRef.current.childNodes);
		const length = nodes.length;

		if (length < 2) return;

		let contentWidth = trackRef.current.scrollWidth;
		let count = 0;
		const tails: number[] = [];

		const sizes = nodes.map((node: any) => {
			return node.offsetWidth;
		});
		sizeRef.current = sizes;

		while (contentWidth < parentWidth) {
			const w = sizes.at(count % length) ?? 0;
			tails.push(length + count);
			contentWidth += w;
			count += 1;
		}

		state.offset = -1 * sizes.at(-1);
		state.queue = [-1, ...sizes.map((_, i) => i), ...tails];

		animate();
		state.initialized = true;

		return () => {
			state.queue = [];
			state.initialized = false;
			state.offset = 0;

			cancelRaf();
		};
	}, [children]);

	return (
		<div
			{...restProps}
			className={classNames(
				"i-river",
				{
					"i-river-initialized": state.initialized,
				},
				className
			)}
		>
			<div
				ref={trackRef}
				className='i-river-track'
				style={{
					transform: `translate3d(${state.offset}px, 0, 0)`,
					paddingLeft: state.paddingLeft,
				}}
				onMouseOver={handleMouseOver}
				onMouseLeave={handleMouseLeave}
			>
				{!state.initialized &&
					Children.map(children, (item, i) => {
						return (
							<div className='i-river-item' key={i}>
								{item}
							</div>
						);
					})}

				{state.initialized &&
					state.queue.map((index) => {
						return (
							<div className='i-river-item' key={index}>
								{items.at(index % items.length)}
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default River;
