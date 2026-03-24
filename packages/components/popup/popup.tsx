import { debounce } from "radash";
import {
	Children,
	MouseEvent,
	Ref,
	cloneElement,
	isValidElement,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useMouseUp, useResizeObserver } from "../../js/hooks";
import { getPointPosition, getPosition } from "../../js/utils";
import Content from "./content";
import "./index.css";
import { IPopup } from "./type";

export default function Popup(props: IPopup) {
	const {
		visible = false,
		content,
		trigger = "hover",
		gap = 12,
		offset = 8,
		position = "top",
		showDelay = 16,
		hideDelay = 12,
		touchable,
		arrow = true,
		align = "center",
		fitSize,
		disabled,
		style,
		className,
		children,
		onVisibleChange,
	} = props;

	const triggerRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const timerRef = useRef<any>(null);
	const afterHideTimerRef = useRef<any>(null);
	const rafRef = useRef<number | null>(null);

	const [show, setShow] = useState(false);
	const showRef = useRef(false);
	showRef.current = show;

	const latestRef = useRef({
		disabled,
		trigger,
		touchable,
		showDelay,
		hideDelay,
		position,
		gap,
		offset,
		align,
		fitSize,
		onVisibleChange,
	});
	latestRef.current = {
		disabled,
		trigger,
		touchable,
		showDelay,
		hideDelay,
		position,
		gap,
		offset,
		align,
		fitSize,
		onVisibleChange,
	};

	const phaseRef = useRef<"" | "showing" | "hiding">("");
	const lastPosRef = useRef<{ left: number; top: number } | null>(null);
	const lastArrowRef = useRef<{
		left: number;
		top: number;
		transform: string;
	} | null>(null);
	const arrowElRef = useRef<HTMLElement | null>(null);
	const pointRef = useRef<{ pageX: number; pageY: number } | null>(null);

	const clearTimer = () => {
		if (!timerRef.current) return;
		clearTimeout(timerRef.current);
		timerRef.current = null;
		phaseRef.current = "";
	};

	const clearAllTimers = () => {
		clearTimer();
		if (afterHideTimerRef.current) {
			clearTimeout(afterHideTimerRef.current);
			afterHideTimerRef.current = null;
		}
		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
	};

	const setContentVisible = (visible: boolean) => {
		const el = contentRef.current;
		if (!el) return;
		el.style.opacity = visible ? "1" : "0";
		el.style.transform = visible ? "none" : "translate(0, 2px)";
	};

	const ensureBaseStyle = () => {
		const el = contentRef.current;
		if (!el) return;
		const pos = "fixed";
		if (el.style.position !== pos) el.style.position = pos;
	};

	const applyFitSize = () => {
		const o = latestRef.current;
		const triggerEl = triggerRef.current;
		const contentEl = contentRef.current;
		if (!triggerEl || !contentEl) return;

		const vertical = ["top", "bottom"].includes(o.position);
		const key = vertical ? "width" : "height";
		if (!o.fitSize) {
			(contentEl.style as any)[key] = "";
			return;
		}

		const size = triggerEl[vertical ? "offsetWidth" : "offsetHeight"];
		(contentEl.style as any)[key] =
			typeof size === "number" ? `${size}px` : "";
	};

	const applyArrow = (arrowX: number, arrowY: number, arrowPos: string) => {
		const contentEl = contentRef.current;
		if (!contentEl) return;

		const arrowEl =
			arrowElRef.current ??
			(contentEl.querySelector(".i-popup-arrow") as HTMLElement | null);
		arrowElRef.current = arrowEl;
		if (!arrowEl) return;

		let left = arrowX ?? 0;
		let top = arrowY ?? 0;
		let transform = "";

		switch (arrowPos) {
			case "left":
				left += 2;
				transform = `translate(-100%, -50%) rotate(180deg)`;
				break;
			case "right":
				left -= 2;
				transform = `translate(0, -50%)`;
				break;
			case "top":
				top -= 2;
				transform = `translate(-50%, -50%) rotate(-90deg)`;
				break;
			case "bottom":
				top += 2;
				transform = `translate(-50%, -50%) rotate(90deg)`;
				break;
			default:
				break;
		}

		const prev = lastArrowRef.current;
		if (
			prev &&
			prev.left === left &&
			prev.top === top &&
			prev.transform === transform
		) {
			return;
		}

		lastArrowRef.current = { left, top, transform };
		arrowEl.style.left = `${left}px`;
		arrowEl.style.top = `${top}px`;
		arrowEl.style.transform = transform;
	};

	const applyLeftTop = (left: number, top: number) => {
		const contentEl = contentRef.current;
		if (!contentEl) return;

		const prev = lastPosRef.current;
		if (prev && prev.left === left && prev.top === top) return;

		lastPosRef.current = { left, top };
		contentEl.style.left = `${left}px`;
		contentEl.style.top = `${top}px`;
	};

	const computeRelativePosition = () => {
		const triggerEl = triggerRef.current;
		const contentEl = contentRef.current;
		if (!triggerEl || !contentEl) return;

		const o = latestRef.current;
		applyFitSize();

		const [left, top, { arrowX, arrowY, arrowPos }] = getPosition(
			triggerEl,
			contentEl,
			{
				position: o.position,
				gap: o.gap,
				offset: o.offset,
				align: o.align,
				refWindow: true,
			},
		);

		applyLeftTop(left, top);
		applyArrow(arrowX, arrowY, arrowPos);
	};

	const computePointPosition = () => {
		const contentEl = contentRef.current as HTMLElement | null;
		if (!contentEl) return;
		const point = pointRef.current;
		if (!point) return;

		const [left, top] = getPointPosition(point as any, contentEl);
		applyLeftTop(left, top);
	};

	const scheduleComputePosition = () => {
		if (!showRef.current) return;
		if (rafRef.current !== null) return;
		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = null;
			if (!showRef.current) return;
			ensureBaseStyle();

			if (latestRef.current.trigger === "contextmenu") {
				computePointPosition();
				return;
			}

			computeRelativePosition();
		});
	};

	const handleShow = () => {
		const opts = latestRef.current;
		if (opts.disabled) return;
		clearAllTimers();
		if (
			showRef.current &&
			(opts.trigger !== "hover" ||
				(opts.trigger === "hover" && !opts.touchable))
		) {
			ensureBaseStyle();
			computeRelativePosition();
			setContentVisible(true);
			return;
		}

		phaseRef.current = "showing";
		if (!showRef.current) {
			lastPosRef.current = null;
			lastArrowRef.current = null;
			arrowElRef.current = null;
			setShow(true);
		}

		timerRef.current = setTimeout(() => {
			if (phaseRef.current !== "showing") return;

			rafRef.current = requestAnimationFrame(() => {
				rafRef.current = null;
				if (phaseRef.current !== "showing") return;
				if (!contentRef.current) return;

				ensureBaseStyle();
				if (opts.trigger === "contextmenu") {
					computePointPosition();
				} else {
					computeRelativePosition();
				}
				setContentVisible(true);
				opts.onVisibleChange?.(true);
				clearTimer();
				phaseRef.current = "";
			});
		}, opts.showDelay);
	};

	const handleHide = () => {
		if (!showRef.current) return;

		clearAllTimers();
		phaseRef.current = "hiding";
		timerRef.current = setTimeout(() => {
			if (phaseRef.current !== "hiding") {
				clearTimer();
				return;
			}

			setContentVisible(false);

			afterHideTimerRef.current = setTimeout(() => {
				afterHideTimerRef.current = null;
				setShow(false);
				clearAllTimers();
				latestRef.current.onVisibleChange?.(false);
				phaseRef.current = "";
			}, 160);
		}, latestRef.current.hideDelay);
	};

	const handleToggle = (action?: boolean) => {
		if (action !== undefined) {
			action ? handleShow() : handleHide();
			return;
		}
		showRef.current ? handleHide() : handleShow();
	};

	const hideRef = useRef(handleHide);
	const toggleRef = useRef(handleToggle);
	hideRef.current = handleHide;
	toggleRef.current = handleToggle;

	const doHide = useMemo(() => () => hideRef.current(), []);
	const doToggle = useMemo(
		() => (action?: boolean) => toggleRef.current(action),
		[],
	);

	const eventMaps = useMemo(() => {
		return {
			click: {
				onClick: () => doToggle(true),
			},
			hover: {
				onMouseEnter: () => doToggle(true),
				onMouseLeave: () => doToggle(false),
			},
			focus: {
				onFocus: () => doToggle(true),
				onBlur: () => doToggle(false),
			},
			contextmenu: {
				onContextMenu: (e: MouseEvent) => {
					e.preventDefault();
					e.stopPropagation();

					pointRef.current = {
						pageX: (e as any).pageX,
						pageY: (e as any).pageY,
					};

					if (showRef.current) {
						ensureBaseStyle();
						computePointPosition();
						return;
					}

					clearAllTimers();
					phaseRef.current = "showing";
					lastPosRef.current = null;
					lastArrowRef.current = null;
					arrowElRef.current = null;
					setShow(true);

					timerRef.current = setTimeout(() => {
						if (phaseRef.current !== "showing") return;
						if (!contentRef.current) return;

						ensureBaseStyle();
						computePointPosition();
						setContentVisible(true);
						clearTimer();
						latestRef.current.onVisibleChange?.(true);
						phaseRef.current = "";
					}, latestRef.current.showDelay);
				},
			},
			none: {},
		};
	}, [doToggle]);

	const contentTouch = useMemo(() => {
		if (!touchable) return {};
		const events: { [key: string]: () => void } = {};

		if (trigger === "hover") {
			events["onMouseEnter"] = () => {
				clearTimer();
			};
			events["onMouseLeave"] = () => handleToggle(false);
		}

		return events;
	}, [touchable, trigger]);

	const { observe, unobserve, disconnect } = useResizeObserver();
	useEffect(() => {
		if (!observe) return;
		const triggerEl = triggerRef.current;
		const contentEl = contentRef.current;
		if (triggerEl) observe(triggerEl, scheduleComputePosition);
		if (contentEl) observe(contentEl, scheduleComputePosition);
		return () => {
			if (contentEl) unobserve(contentEl);
			if (triggerEl) unobserve(triggerEl);
			disconnect();
		};
	}, [trigger, observe, unobserve, disconnect, show]);

	useLayoutEffect(() => {
		if (!show) return;
		ensureBaseStyle();
		if (latestRef.current.trigger === "contextmenu") {
			computePointPosition();
		} else {
			computeRelativePosition();
		}
	}, [show]);

	useLayoutEffect(() => {
		doToggle(visible);
	}, [visible]);

	useEffect(() => {
		return () => {
			clearAllTimers();
		};
	}, []);

	const mouseUpHandlerRef = useRef<(e: any) => void>(() => {});
	mouseUpHandlerRef.current = (e) => {
		if (!showRef.current) return;
		const triggerEl = triggerRef.current;
		const contentEl = contentRef.current;
		if (!triggerEl || !contentEl) return;
		const tar = e.target as HTMLElement;
		if (triggerEl.contains(tar) || contentEl.contains(tar)) return;
		doHide();
	};
	const onGlobalMouseUp = useMemo(
		() => (e: any) => mouseUpHandlerRef.current(e),
		[],
	);
	useMouseUp(onGlobalMouseUp);

	useEffect(() => {
		if (!show) return;
		if (typeof window === "undefined") return;

		const onScrollOrResize = debounce({ delay: 160 }, () => {
			scheduleComputePosition();
		});

		window.addEventListener("scroll", onScrollOrResize, {
			passive: true,
			capture: true,
		});

		return () => {
			window.removeEventListener("scroll", onScrollOrResize, true);
		};
	}, [show]);

	const mergeRefs = (...refs: Array<Ref<HTMLElement> | undefined>) => {
		return (node: HTMLElement | null) => {
			for (const ref of refs) {
				if (!ref) continue;
				if (typeof ref === "function") {
					ref(node);
				} else {
					(ref as any).current = node;
				}
			}
		};
	};

	return (
		<>
			{(() => {
				const events = eventMaps[trigger] as any;
				const items = Children.toArray(children);
				const canAttachRef = (el: any) => {
					if (!isValidElement(el)) return false;
					const t: any = el.type;
					if (typeof t === "string") return true;
					if (t?.prototype?.isReactComponent) return true;
					if (t?.$$typeof === Symbol.for("react.forward_ref"))
						return true;
					return false;
				};

				if (items.length !== 1) {
					return (
						<div
							ref={triggerRef as any}
							{...events}
							className='i-popup-trigger'
							style={{ display: "inline-block" }}
						>
							{children}
						</div>
					);
				}

				const only = items[0] as any;
				if (!isValidElement(only) || !canAttachRef(only)) {
					return (
						<div
							ref={triggerRef as any}
							{...events}
							className='i-popup-trigger'
							style={{ display: "inline-block" }}
						>
							{only}
						</div>
					);
				}

				const { className: childClassName, ...restProps } =
					only.props as any;
				const nextProps: Record<string, any> = { ...restProps };
				for (const evt of Object.keys(events)) {
					const theirs = restProps[evt];
					const ours = events[evt];
					nextProps[evt] =
						typeof theirs === "function"
							? (e: any) => {
									ours(e);
									theirs(e);
								}
							: ours;
				}
				return cloneElement(only as any, {
					ref: mergeRefs((only as any).ref, triggerRef as any),
					className: childClassName,
					...nextProps,
				});
			})()}

			{show && (
				<Content
					ref={contentRef}
					arrow={arrow && trigger !== "contextmenu"}
					style={{
						...style,
						position: "fixed",
					}}
					className={className}
					{...contentTouch}
					trigger={triggerRef.current as HTMLElement}
				>
					{content}
				</Content>
			)}
		</>
	);
}
