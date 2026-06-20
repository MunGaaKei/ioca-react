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

const REACT_FORWARD_REF = Symbol.for("react.forward_ref");
const REACT_FRAGMENT = Symbol.for("react.fragment");

const canAttachRef = (el: any) => {
    if (!isValidElement(el)) return false;
    const t: any = el.type;
    if (typeof t === "string") return true;
    if (t?.prototype?.isReactComponent) return true;
    if (t?.$$typeof === REACT_FORWARD_REF) return true;
    return false;
};

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
        border,
        align = "center",
        fitSize,
        disabled,
        style,
        className,
        children,
        match,
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

    const latestRef = useRef<Record<string, any>>({});
    latestRef.current = {
        disabled,
        border,
        trigger,
        touchable,
        showDelay,
        hideDelay,
        position,
        gap,
        offset,
        align,
        fitSize,
        match,
        onVisibleChange,
    };

    const phaseRef = useRef<"" | "showing" | "hiding">("");
    const lastPosRef = useRef<{ left: number; top: number } | null>(null);
    const lastArrowRef = useRef<{
        left: number;
        top: number;
        transform: string;
        borderRadius?: string;
        hasBorder?: boolean;
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
        const contentEl = contentRef.current;
        if (!contentEl) return;

        const vertical = ["top", "bottom"].includes(o.position);
        const key = vertical ? "width" : "height";
        if (!o.fitSize) {
            (contentEl.style as any)[key] = "";
            return;
        }

        const triggerEl = triggerRef.current;
        if (!triggerEl) return;

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

        const left = arrowX ?? 0;
        const top = arrowY ?? 0;
        const transform = "translate(-50%, -50%) rotate(45deg)";
        const hasBorder = !!latestRef.current.border;

        const borderRadiusMap: Record<string, string> = {
            top: "border-top-left-radius",
            bottom: "border-bottom-right-radius",
            left: "border-bottom-left-radius",
            right: "border-top-right-radius",
        };
        const borderRadius = `${borderRadiusMap[arrowPos] ?? ""}: 3px`;

        const prev = lastArrowRef.current;
        if (
            prev &&
            prev.left === left &&
            prev.top === top &&
            prev.transform === transform &&
            prev.borderRadius === borderRadius &&
            prev.hasBorder === hasBorder
        ) {
            return;
        }

        lastArrowRef.current = { left, top, transform, borderRadius, hasBorder };
        arrowEl.style.left = `${left}px`;
        arrowEl.style.top = `${top}px`;
        arrowEl.style.transform = transform;

        // Reset all border-radii first, then apply the one for this position
        arrowEl.style.borderRadius = "";
        const radiusKey = borderRadiusMap[arrowPos];
        if (radiusKey) {
            (arrowEl.style as any)[radiusKey] = "3px";
        }

        // Show border on 2 adjacent sides matching the protruding tip
        arrowEl.style.borderTop = "";
        arrowEl.style.borderRight = "";
        arrowEl.style.borderBottom = "";
        arrowEl.style.borderLeft = "";
        if (hasBorder) {
            const b = "1px solid var(--background-opacity-2)";
            switch (arrowPos) {
                case "top":
                    arrowEl.style.borderTop = b;
                    arrowEl.style.borderLeft = b;
                    break;
                case "bottom":
                    arrowEl.style.borderBottom = b;
                    arrowEl.style.borderRight = b;
                    break;
                case "left":
                    arrowEl.style.borderBottom = b;
                    arrowEl.style.borderLeft = b;
                    break;
                case "right":
                    arrowEl.style.borderTop = b;
                    arrowEl.style.borderRight = b;
                    break;
            }
        }
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

    const mergeRefs = useMemo(() => {
        return (...refs: Array<Ref<HTMLElement> | undefined>) => {
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
    }, []);

    const triggerEvents = useMemo(() => {
        const setTriggerEl = (e: any) => {
            const el = e?.currentTarget as HTMLElement | null | undefined;
            if (el) triggerRef.current = el;
        };

        const checkMatch = (e: any) => {
            const fn = latestRef.current.match;
            return fn ? fn(e) : true;
        };

        switch (trigger) {
            case "click":
                return {
                    onClick: (e: any) => {
                        if (!checkMatch(e)) return;
                        setTriggerEl(e);
                        doToggle(true);
                    },
                };
            case "hover":
                return {
                    onMouseEnter: (e: any) => {
                        if (!checkMatch(e)) return;
                        setTriggerEl(e);
                        doToggle(true);
                    },
                    onMouseLeave: (e: any) => {
                        setTriggerEl(e);
                        doToggle(false);
                    },
                };
            case "focus":
                return {
                    onFocus: (e: any) => {
                        if (!checkMatch(e)) return;
                        setTriggerEl(e);
                        doToggle(true);
                    },
                    onBlur: (e: any) => {
                        setTriggerEl(e);
                        doToggle(false);
                    },
                };
            case "contextmenu":
                return {
                    onContextMenu: (e: MouseEvent) => {
                        if (!checkMatch(e)) return;
                        e.preventDefault();
                        e.stopPropagation();
                        setTriggerEl(e);

                        pointRef.current = {
                            pageX: (e as any).clientX,
                            pageY: (e as any).clientY,
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
                };
            default:
                return {};
        }
    }, [doToggle]);

    const triggerNode = useMemo(() => {
        const events = triggerEvents as any;
        const eventKeys = Object.keys(events);
        const items = Children.toArray(children);

        let attachedRef = false;
        let cloned = false;

        const nextItems = items.map((item) => {
            if (!isValidElement(item)) return item;
            if ((item as any).type === REACT_FRAGMENT) return item;

            const attachRef = !attachedRef && canAttachRef(item);
            if (attachRef) attachedRef = true;

            if (!attachRef && eventKeys.length === 0) return item;

            const patchedProps: Record<string, any> = {};

            for (const evt of eventKeys) {
                const ours = events[evt];
                const theirs = (item.props as any)?.[evt];
                patchedProps[evt] =
                    typeof theirs === "function"
                        ? (e: any) => {
                              ours(e);
                              theirs(e);
                          }
                        : ours;
            }

            if (attachRef) {
                patchedProps.ref = mergeRefs(
                    (item as any).ref,
                    triggerRef as any,
                );
            }

            cloned = true;
            return cloneElement(item as any, patchedProps);
        });

        if (!cloned) return children;
        return nextItems.length === 1 ? nextItems[0] : <>{nextItems}</>;
    }, [children, triggerEvents, mergeRefs]);

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

    const mouseUpHandlerRef = useRef<((e: any) => void)>(() => {});
    mouseUpHandlerRef.current = (e) => {
        if (!showRef.current) return;
        const triggerEl = triggerRef.current;
        const contentEl = contentRef.current;
        if (!triggerEl || !contentEl) return;
        const tar = e.target as HTMLElement;
        if (contentEl.contains(tar)) return;
        if (triggerEl.contains(tar) && latestRef.current.trigger !== "contextmenu") return;
        if (triggerEl.contains(tar) && e.button !== 0) return;
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

    return (
        <>
            {triggerNode}

            {show && (
                <Content
                    ref={contentRef}
                    arrow={arrow && trigger !== "contextmenu"}
                    style={{
                        ...style,
                        position: "fixed",
                    }}
                    className={border ? `${className || ''} i-popup-bordered`.trim() : className}
                    {...contentTouch}
                    trigger={triggerRef.current as HTMLElement}
                >
                    {content}
                </Content>
            )}
        </>
    );
}
