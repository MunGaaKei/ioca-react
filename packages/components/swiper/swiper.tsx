import { useMouseMove, useMouseUp } from "@p/js/hooks";
import { clamp } from "@p/js/utils";
import {
	KeyboardArrowLeftRound,
	KeyboardArrowRightRound,
} from "@ricons/material";
import { useReactive } from "ahooks";
import classNames from "classnames";
import {
	Children,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
} from "react";
import Icon from "../icon";
import "./index.css";
import Item from "./item";
import { CompositionSwiper, ISwiper } from "./type";

const Swiper = ((props: ISwiper) => {
	const {
		ref,
		type = "normal",
		initial = 0,
		display = 1,
		scroll = 1,
		loop = true,
		vertical,
		prev = <Icon icon={<KeyboardArrowLeftRound />} size='2em' />,
		next = <Icon icon={<KeyboardArrowRightRound />} size='2em' />,
		duration = 600,
		interval = 3000,
		autoplay,
		pauseOnHover,
		arrow = true,
		reverse,
		draggable,
		dragOffset = 40,
		gap = 0,
		itemHeight,
		indicator,
		fixedIndicator,
		style,
		className,
		children,
		renderIndicator,
		onBeforeSwipe,
		onAfterSwipe,
		onItemClick,
	} = props;

	const listRef = useRef<HTMLDivElement>(null);
	const timerRef = useRef<any>(null);
	const transition = `all ${duration / 1000}s`;
	const state = useReactive({
		current: initial,
		swipable: true,
		transition: type === "fade" ? "none" : transition,
		dragStart: 0,
		dragging: false,
		initialized: false,
	});

	const items = useMemo(() => {
		return Children.map(children, (node: any) => {
			if (node.type !== Item) return;

			return node;
		});
	}, [children]);

	const [displayItems, extra, size, total, listSize] = useMemo(() => {
		const extra =
			type === "normal" && loop && items.length > display
				? display + 1
				: 0;
		let list: any = [];

		if (extra <= 0) {
			list = [...items];
		} else {
			const head = items.slice(0, extra);
			const tail = items.slice(-extra);
			list = [...tail, ...items, ...head];
		}

		const listSize = `${(list.length / display) * 100}%`;

		return [list, extra, items.length, list.length, listSize];
	}, [display, loop, type, items]);

	const offsetPercent = useMemo(
		() => (-100 * (state.current + extra)) / total,
		[state.current, total]
	);

	const position = useMemo(() => {
		if (size <= display || type === "fade") return;

		const offset = vertical
			? `0, ${offsetPercent}%`
			: `${offsetPercent}%, 0`;
		return `translate3d(${offset}, 0)`;
	}, [offsetPercent, vertical, display, size, type]);

	const trackStyle = useMemo(() => {
		if (!vertical || !itemHeight) return;

		return {
			height: itemHeight * display,
		};
	}, [vertical, itemHeight, display]);

	const indicatorsLoop = useMemo(() => {
		return Array.from({
			length: Math.ceil((size - display) / scroll) + 1,
		});
	}, [loop, indicator]);

	const clearTimer = () => {
		clearTimeout(timerRef.current);
		timerRef.current = null;
	};

	const swipeTo = (i: number) => {
		if (!state.swipable || i === state.current) return;
		state.swipable = false;
		onBeforeSwipe?.(state.current);

		let reset = false;
		let next = i;
		const lastDisplay = size - display;

		if (loop) {
			if (i > lastDisplay) {
				reset = true;
				i = size;
				next = 0;
			} else if (i < 0) {
				reset = true;
				i = -display;
				next = lastDisplay;
			}
		} else {
			next = clamp(next, 0, lastDisplay);
			i = next;
		}

		setTimeout(() => {
			state.swipable = true;
		}, duration + 32);

		if (type === "fade") {
			state.current = next;
			onAfterSwipe?.(next);
			return;
		}

		state.current = i;

		if (!reset) {
			if (autoplay) {
				timerRef.current = setTimeout(swipeNext, interval);
			}
			setTimeout(() => {
				onAfterSwipe?.(next);
			}, duration + 12);
			return;
		}

		setTimeout(() => {
			state.transition = "none";
			state.current = next;
			onAfterSwipe?.(next);
			if (autoplay) {
				timerRef.current = setTimeout(swipeNext, interval);
			}
			setTimeout(() => {
				state.transition = transition;
			}, 60);
		}, duration + 20);
	};
	const swipeNext = () => {
		swipeTo(reverse ? state.current - scroll : state.current + scroll);
	};

	const swipePrev = () => {
		swipeTo(reverse ? state.current + scroll : state.current - scroll);
	};

	const handleMouseDown = (e) => {
		if (!draggable || !state.swipable || type === "fade") return;
		e.stopPropagation();
		e.preventDefault();

		if (e.touches) {
			e = e.touches[0];
		}

		Object.assign(state, {
			dragStart: vertical ? e.clientY : e.clientX,
			dragging: true,
			transition: "none",
		});
	};

	const handleMouseMove = (e) => {
		if (!state.dragging || !listRef.current) return;
		e.preventDefault();

		if (e.touches) {
			e = e.touches[0];
		}

		const dragEnd = vertical ? e.clientY : e.clientX;
		const offset =
			((dragEnd - state.dragStart) * 61.8) /
				listRef.current[vertical ? "offsetHeight" : "offsetWidth"] +
			offsetPercent;

		listRef.current.style.transform = `translate3d(${
			vertical ? `0, ${offset}%` : `${offset}%, 0`
		}, 0)`;
	};

	const handleMouseUp = (e) => {
		if (!state.dragging || !listRef.current) return;

		if (e.changedTouches) {
			e = e.changedTouches[0];
		}

		const dragEnd = vertical ? e.clientY : e.clientX;
		const part =
			listRef.current[vertical ? "offsetHeight" : "offsetWidth"] / total;
		const offset = (dragEnd - state.dragStart) * 0.618;
		const absOffset = Math.abs(offset);

		if (absOffset > dragOffset) {
			const base = Math.floor(absOffset / part);
			const mod = (absOffset % part) - dragOffset > 0 ? 1 : 0;
			const p = base + mod;

			let to = state.current + (offset > 0 ? -p : p);

			swipeTo(to);
		}

		listRef.current.style.transform = position || "";

		Object.assign(state, {
			dragging: false,
			transition,
		});
	};

	const handleMouseOver = () => {
		if (!pauseOnHover) return;
		clearTimer();
	};

	const handleMouseLeave = () => {
		if (!pauseOnHover) return;
		clearTimer();
		timerRef.current = setTimeout(swipeNext, interval);
	};

	useMouseMove(handleMouseMove);
	useMouseUp(handleMouseUp);

	useImperativeHandle(ref, () => ({
		swipeTo,
		swipeNext,
		swipePrev,
	}));

	useEffect(() => {
		if (!autoplay) return;
		timerRef.current = setTimeout(swipeNext, interval);

		return () => {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		};
	}, [autoplay, interval]);

	return (
		<div
			style={style}
			className={classNames(
				"i-swiper",
				{
					"i-swiper-vertical": vertical,
					"i-swiper-initialized": state.initialized,
				},
				className
			)}
		>
			<div
				className='i-swiper-track'
				style={trackStyle}
				onMouseOver={handleMouseOver}
				onMouseLeave={handleMouseLeave}
			>
				<div
					ref={listRef}
					className={classNames("i-swiper-list", {
						"i-swiper-fade": type === "fade",
					})}
					style={{
						[vertical ? "height" : "width"]: listSize,
						transform: position,
						transition: state.transition,
					}}
					onMouseDown={handleMouseDown}
					onTouchStart={handleMouseDown}
				>
					{displayItems.map((item, i) => {
						const { props: itemProps } = item;

						return (
							<Item
								key={i}
								index={i}
								itemIndex={(i - extra + size) % size}
								active={i - extra === state.current}
								type={type}
								gap={gap}
								transition={transition}
								itemHeight={itemHeight}
								vertical={vertical}
								onItemClick={onItemClick}
								{...itemProps}
							/>
						);
					})}
				</div>

				{arrow && (
					<>
						{(loop || state.current !== 0) && (
							<a
								className='i-swiper-arrow i-swiper-prev'
								onClick={swipePrev}
							>
								{prev}
							</a>
						)}
						{(loop || state.current < size - display) && (
							<a
								className='i-swiper-arrow i-swiper-next'
								onClick={swipeNext}
							>
								{next}
							</a>
						)}
					</>
				)}
			</div>
			{indicator && (
				<div
					className={classNames("i-swiper-indicators", {
						"i-swiper-indicators-fixed": fixedIndicator,
					})}
				>
					{indicatorsLoop.map((_, i) => {
						return (
							<a
								key={i}
								className={classNames("i-swiper-indicator", {
									"i-indicator-active":
										i ===
										Math[loop ? "floor" : "ceil"](
											((state.current + size) % size) /
												scroll
										),
								})}
								onClick={() => swipeTo(i * scroll)}
							>
								{renderIndicator?.(i)}
							</a>
						);
					})}
				</div>
			)}
		</div>
	);
}) as CompositionSwiper;

Swiper.Item = Item;

export default Swiper;
