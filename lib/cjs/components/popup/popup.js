'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var radash = require('radash');
var react = require('react');
var hooks = require('../../js/hooks.js');
var utils = require('../../js/utils.js');
var content = require('./content.js');

const REACT_FORWARD_REF = Symbol.for("react.forward_ref");
const REACT_FRAGMENT = Symbol.for("react.fragment");
const canAttachRef = (el) => {
    if (!react.isValidElement(el))
        return false;
    const t = el.type;
    if (typeof t === "string")
        return true;
    if (t?.prototype?.isReactComponent)
        return true;
    if (t?.$$typeof === REACT_FORWARD_REF)
        return true;
    return false;
};
function Popup(props) {
    const { visible = false, content: content$1, trigger = "hover", gap = 12, offset = 8, position = "top", showDelay = 16, hideDelay = 12, touchable, arrow = true, align = "center", fitSize, disabled, style, className, children, onVisibleChange, } = props;
    const triggerRef = react.useRef(null);
    const contentRef = react.useRef(null);
    const timerRef = react.useRef(null);
    const afterHideTimerRef = react.useRef(null);
    const rafRef = react.useRef(null);
    const [show, setShow] = react.useState(false);
    const showRef = react.useRef(false);
    showRef.current = show;
    const latestRef = react.useRef({
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
    const phaseRef = react.useRef("");
    const lastPosRef = react.useRef(null);
    const lastArrowRef = react.useRef(null);
    const arrowElRef = react.useRef(null);
    const pointRef = react.useRef(null);
    const clearTimer = () => {
        if (!timerRef.current)
            return;
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
    const setContentVisible = (visible) => {
        const el = contentRef.current;
        if (!el)
            return;
        el.style.opacity = visible ? "1" : "0";
        el.style.transform = visible ? "none" : "translate(0, 2px)";
    };
    const ensureBaseStyle = () => {
        const el = contentRef.current;
        if (!el)
            return;
        const pos = "fixed";
        if (el.style.position !== pos)
            el.style.position = pos;
    };
    const applyFitSize = () => {
        const o = latestRef.current;
        const triggerEl = triggerRef.current;
        const contentEl = contentRef.current;
        if (!triggerEl || !contentEl)
            return;
        const vertical = ["top", "bottom"].includes(o.position);
        const key = vertical ? "width" : "height";
        if (!o.fitSize) {
            contentEl.style[key] = "";
            return;
        }
        const size = triggerEl[vertical ? "offsetWidth" : "offsetHeight"];
        contentEl.style[key] =
            typeof size === "number" ? `${size}px` : "";
    };
    const applyArrow = (arrowX, arrowY, arrowPos) => {
        const contentEl = contentRef.current;
        if (!contentEl)
            return;
        const arrowEl = arrowElRef.current ??
            contentEl.querySelector(".i-popup-arrow");
        arrowElRef.current = arrowEl;
        if (!arrowEl)
            return;
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
        }
        const prev = lastArrowRef.current;
        if (prev &&
            prev.left === left &&
            prev.top === top &&
            prev.transform === transform) {
            return;
        }
        lastArrowRef.current = { left, top, transform };
        arrowEl.style.left = `${left}px`;
        arrowEl.style.top = `${top}px`;
        arrowEl.style.transform = transform;
    };
    const applyLeftTop = (left, top) => {
        const contentEl = contentRef.current;
        if (!contentEl)
            return;
        const prev = lastPosRef.current;
        if (prev && prev.left === left && prev.top === top)
            return;
        lastPosRef.current = { left, top };
        contentEl.style.left = `${left}px`;
        contentEl.style.top = `${top}px`;
    };
    const computeRelativePosition = () => {
        const triggerEl = triggerRef.current;
        const contentEl = contentRef.current;
        if (!triggerEl || !contentEl)
            return;
        const o = latestRef.current;
        applyFitSize();
        const [left, top, { arrowX, arrowY, arrowPos }] = utils.getPosition(triggerEl, contentEl, {
            position: o.position,
            gap: o.gap,
            offset: o.offset,
            align: o.align,
            refWindow: true,
        });
        applyLeftTop(left, top);
        applyArrow(arrowX, arrowY, arrowPos);
    };
    const computePointPosition = () => {
        const contentEl = contentRef.current;
        if (!contentEl)
            return;
        const point = pointRef.current;
        if (!point)
            return;
        const [left, top] = utils.getPointPosition(point, contentEl);
        applyLeftTop(left, top);
    };
    const scheduleComputePosition = () => {
        if (!showRef.current)
            return;
        if (rafRef.current !== null)
            return;
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            if (!showRef.current)
                return;
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
        if (opts.disabled)
            return;
        clearAllTimers();
        if (showRef.current &&
            (opts.trigger !== "hover" ||
                (opts.trigger === "hover" && !opts.touchable))) {
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
            if (phaseRef.current !== "showing")
                return;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                if (phaseRef.current !== "showing")
                    return;
                if (!contentRef.current)
                    return;
                ensureBaseStyle();
                if (opts.trigger === "contextmenu") {
                    computePointPosition();
                }
                else {
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
        if (!showRef.current)
            return;
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
    const handleToggle = (action) => {
        if (action !== undefined) {
            action ? handleShow() : handleHide();
            return;
        }
        showRef.current ? handleHide() : handleShow();
    };
    const hideRef = react.useRef(handleHide);
    const toggleRef = react.useRef(handleToggle);
    hideRef.current = handleHide;
    toggleRef.current = handleToggle;
    const doHide = react.useMemo(() => () => hideRef.current(), []);
    const doToggle = react.useMemo(() => (action) => toggleRef.current(action), []);
    const mergeRefs = react.useMemo(() => {
        return (...refs) => {
            return (node) => {
                for (const ref of refs) {
                    if (!ref)
                        continue;
                    if (typeof ref === "function") {
                        ref(node);
                    }
                    else {
                        ref.current = node;
                    }
                }
            };
        };
    }, []);
    const triggerEvents = react.useMemo(() => {
        const setTriggerEl = (e) => {
            const el = e?.currentTarget;
            if (el)
                triggerRef.current = el;
        };
        switch (trigger) {
            case "click":
                return {
                    onClick: (e) => {
                        setTriggerEl(e);
                        doToggle(true);
                    },
                };
            case "hover":
                return {
                    onMouseEnter: (e) => {
                        setTriggerEl(e);
                        doToggle(true);
                    },
                    onMouseLeave: (e) => {
                        setTriggerEl(e);
                        doToggle(false);
                    },
                };
            case "focus":
                return {
                    onFocus: (e) => {
                        setTriggerEl(e);
                        doToggle(true);
                    },
                    onBlur: (e) => {
                        setTriggerEl(e);
                        doToggle(false);
                    },
                };
            case "contextmenu":
                return {
                    onContextMenu: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setTriggerEl(e);
                        pointRef.current = {
                            pageX: e.pageX,
                            pageY: e.pageY,
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
                            if (phaseRef.current !== "showing")
                                return;
                            if (!contentRef.current)
                                return;
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
    const triggerNode = react.useMemo(() => {
        const events = triggerEvents;
        const eventKeys = Object.keys(events);
        const items = react.Children.toArray(children);
        let attachedRef = false;
        let cloned = false;
        const nextItems = items.map((item) => {
            if (!react.isValidElement(item))
                return item;
            if (item.type === REACT_FRAGMENT)
                return item;
            const attachRef = !attachedRef && canAttachRef(item);
            if (attachRef)
                attachedRef = true;
            if (!attachRef && eventKeys.length === 0)
                return item;
            const patchedProps = {};
            for (const evt of eventKeys) {
                const ours = events[evt];
                const theirs = item.props?.[evt];
                patchedProps[evt] =
                    typeof theirs === "function"
                        ? (e) => {
                            ours(e);
                            theirs(e);
                        }
                        : ours;
            }
            if (attachRef) {
                patchedProps.ref = mergeRefs(item.ref, triggerRef);
            }
            cloned = true;
            return react.cloneElement(item, patchedProps);
        });
        if (!cloned)
            return children;
        return nextItems.length === 1 ? nextItems[0] : jsxRuntime.jsx(jsxRuntime.Fragment, { children: nextItems });
    }, [children, triggerEvents, mergeRefs]);
    const contentTouch = react.useMemo(() => {
        if (!touchable)
            return {};
        const events = {};
        if (trigger === "hover") {
            events["onMouseEnter"] = () => {
                clearTimer();
            };
            events["onMouseLeave"] = () => handleToggle(false);
        }
        return events;
    }, [touchable, trigger]);
    const { observe, unobserve, disconnect } = hooks.useResizeObserver();
    react.useEffect(() => {
        if (!observe)
            return;
        const triggerEl = triggerRef.current;
        const contentEl = contentRef.current;
        if (triggerEl)
            observe(triggerEl, scheduleComputePosition);
        if (contentEl)
            observe(contentEl, scheduleComputePosition);
        return () => {
            if (contentEl)
                unobserve(contentEl);
            if (triggerEl)
                unobserve(triggerEl);
            disconnect();
        };
    }, [trigger, observe, unobserve, disconnect, show]);
    react.useLayoutEffect(() => {
        if (!show)
            return;
        ensureBaseStyle();
        if (latestRef.current.trigger === "contextmenu") {
            computePointPosition();
        }
        else {
            computeRelativePosition();
        }
    }, [show]);
    react.useLayoutEffect(() => {
        doToggle(visible);
    }, [visible]);
    react.useEffect(() => {
        return () => {
            clearAllTimers();
        };
    }, []);
    const mouseUpHandlerRef = react.useRef(() => { });
    mouseUpHandlerRef.current = (e) => {
        if (!showRef.current)
            return;
        const triggerEl = triggerRef.current;
        const contentEl = contentRef.current;
        if (!triggerEl || !contentEl)
            return;
        const tar = e.target;
        if (triggerEl.contains(tar) || contentEl.contains(tar))
            return;
        doHide();
    };
    const onGlobalMouseUp = react.useMemo(() => (e) => mouseUpHandlerRef.current(e), []);
    hooks.useMouseUp(onGlobalMouseUp);
    react.useEffect(() => {
        if (!show)
            return;
        if (typeof window === "undefined")
            return;
        const onScrollOrResize = radash.debounce({ delay: 160 }, () => {
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
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [triggerNode, show && (jsxRuntime.jsx(content.default, { ref: contentRef, arrow: arrow && trigger !== "contextmenu", style: {
                    ...style,
                    position: "fixed",
                }, className: className, ...contentTouch, trigger: triggerRef.current, children: content$1 }))] }));
}

exports.default = Popup;
//# sourceMappingURL=popup.js.map
