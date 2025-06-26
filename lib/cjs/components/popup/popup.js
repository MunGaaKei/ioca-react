'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ahooks = require('ahooks');
var react = require('react');
var hooks = require('../../js/hooks.js');
var utils = require('../../js/utils.js');
var content = require('./content.js');

function Popup(props) {
    const { visible = false, content: content$1, trigger = "hover", gap = 12, offset = 8, fixed, position = "top", showDelay = 16, hideDelay = 12, touchable, arrow = true, align, fitSize, watchResize, clickOutside = true, disabled, referToWindow, style, className, getContainer, children, onVisibleChange, } = props;
    const triggerRef = react.useRef(null);
    const contentRef = react.useRef(null);
    const timerRef = react.useRef(null);
    const statusRef = react.useRef("");
    const state = ahooks.useReactive({
        show: false,
        style: { position: fixed ? "fixed" : "absolute" },
        arrowProps: {},
    });
    hooks.useMouseUp((e) => {
        if (!triggerRef.current || !contentRef.current || !clickOutside)
            return;
        const tar = e.target;
        const isContain = triggerRef.current.contains(tar) ||
            contentRef.current.contains(tar);
        if (!state.show || isContain)
            return;
        handleToggle(false);
    });
    const clearTimer = () => {
        if (!timerRef.current)
            return;
        clearTimeout(timerRef.current);
        timerRef.current = null;
        statusRef.current = "";
    };
    const handleShow = () => {
        if (disabled)
            return;
        if (state.show &&
            (trigger !== "hover" || (trigger === "hover" && !touchable))) {
            return;
        }
        statusRef.current = "showing";
        state.show = true;
        timerRef.current = setTimeout(() => {
            if (statusRef.current !== "showing")
                return;
            requestAnimationFrame(() => {
                const [left, top, { arrowX, arrowY, arrowPos }] = utils.getPosition(triggerRef.current, contentRef.current, {
                    position,
                    gap,
                    offset,
                    align,
                    refWindow: referToWindow,
                });
                state.style = {
                    ...state.style,
                    opacity: 1,
                    transform: "none",
                    left,
                    top,
                };
                state.arrowProps = {
                    left: arrowX,
                    top: arrowY,
                    pos: arrowPos,
                };
                onVisibleChange?.(true);
                clearTimer();
                statusRef.current = "";
            });
        }, showDelay);
    };
    const handleHide = () => {
        if (!state.show)
            return;
        statusRef.current = "hiding";
        timerRef.current = setTimeout(() => {
            if (statusRef.current !== "hiding") {
                clearTimer();
                return;
            }
            state.style = {
                ...state.style,
                opacity: 0,
                transform: "translate(0, 2px)",
            };
            setTimeout(() => {
                state.show = false;
                clearTimer();
                onVisibleChange?.(false);
                statusRef.current = "";
            }, 160);
        }, hideDelay);
    };
    const handleToggle = (action) => {
        if (action !== undefined) {
            action ? handleShow() : handleHide();
            return;
        }
        state.show ? handleHide() : handleShow();
    };
    const eventMaps = ahooks.useCreation(() => ({
        click: {
            onClick: () => handleToggle(true),
        },
        hover: {
            onMouseEnter: () => handleToggle(true),
            onMouseLeave: () => handleToggle(false),
        },
        focus: {
            onFocus: () => handleToggle(true),
            onBlur: () => handleToggle(false),
        },
        contextmenu: {
            onContextMenu: (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (state.show) {
                    const [left, top] = utils.getPointPosition(e, contentRef.current);
                    state.style = {
                        ...state.style,
                        left,
                        top,
                    };
                    return;
                }
                state.show = true;
                timerRef.current = setTimeout(() => {
                    const [left, top] = utils.getPointPosition(e, contentRef.current);
                    state.style = {
                        ...state.style,
                        opacity: 1,
                        transform: "none",
                        left,
                        top,
                    };
                    clearTimer();
                    onVisibleChange?.(true);
                }, showDelay);
            },
        },
        none: {},
    }), []);
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
    const computePosition = () => {
        if (!state.show)
            return;
        const [left, top, { arrowX, arrowY, arrowPos }] = utils.getPosition(triggerRef.current, contentRef.current, {
            position,
            gap,
            offset,
            align,
            refWindow: referToWindow,
        });
        Object.assign(state, {
            style: { ...state.style, left, top },
            arrowProps: { left: arrowX, top: arrowY, pos: arrowPos },
        });
    };
    const { observe, unobserve, disconnect } = hooks.useResizeObserver();
    react.useEffect(() => {
        if (trigger === "contextmenu" || !observe)
            return;
        triggerRef.current && observe(triggerRef.current, computePosition);
        if (!watchResize || !contentRef.current)
            return;
        observe(contentRef.current, computePosition);
        return () => {
            if (!watchResize || !contentRef.current)
                return;
            unobserve(contentRef.current);
            triggerRef.current && unobserve(triggerRef.current);
            disconnect();
        };
    }, [watchResize, contentRef.current, triggerRef.current]);
    react.useLayoutEffect(() => {
        if (!fitSize || !state.show)
            return;
        const vertical = ["top", "bottom"].includes(position);
        const size = triggerRef.current?.[vertical ? "offsetWidth" : "offsetHeight"];
        state.style = { ...state.style, [vertical ? "width" : "height"]: size };
    }, [state.show, fitSize]);
    react.useLayoutEffect(() => {
        handleToggle(visible);
    }, [visible]);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [react.Children.map(children, (child) => {
                if (!react.isValidElement(child))
                    return;
                const { className, ...restProps } = child.props;
                Object.keys(eventMaps[trigger]).map((evt) => {
                    if (!restProps[evt])
                        return;
                    const fn = eventMaps[trigger][evt];
                    eventMaps[trigger][evt] = (e) => {
                        fn();
                        restProps[evt](e);
                    };
                });
                return react.cloneElement(child, {
                    ref: triggerRef,
                    className,
                    ...restProps,
                    ...eventMaps[trigger],
                });
            }), state.show && (jsxRuntime.jsx(content.default, { ref: contentRef, arrow: arrow && trigger !== "contextmenu", style: { ...style, ...state.style }, arrowProps: state.arrowProps, className: className, ...contentTouch, trigger: triggerRef.current, getContainer: getContainer, children: content$1 }))] }));
}

exports.default = Popup;
//# sourceMappingURL=popup.js.map
