'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var ahooks = require('ahooks');
var classNames = require('classnames');
var react = require('react');
var hooks = require('../../js/hooks.js');
var utils = require('../../js/utils.js');
var icon = require('../icon/icon.js');
var item = require('./item.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Swiper = ((props) => {
    const { ref, type = "normal", initial = 0, display = 1, scroll = 1, loop = true, vertical, prev = jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.KeyboardArrowLeftRound, {}), size: '2em' }), next = jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.KeyboardArrowRightRound, {}), size: '2em' }), duration = 600, interval = 3000, autoplay, pauseOnHover, arrow = true, reverse, draggable, dragOffset = 40, gap = 0, itemHeight, indicator, fixedIndicator, style, className, children, renderIndicator, onBeforeSwipe, onAfterSwipe, onItemClick, } = props;
    const listRef = react.useRef(null);
    const timerRef = react.useRef(null);
    const transition = `all ${duration / 1000}s`;
    const state = ahooks.useReactive({
        current: initial,
        swipable: true,
        transition: type === "fade" ? "none" : transition,
        dragStart: 0,
        dragging: false,
        initialized: false,
    });
    const items = react.useMemo(() => {
        return react.Children.map(children, (node) => {
            if (node.type !== item.default)
                return;
            return node;
        });
    }, [children]);
    const [displayItems, extra, size, total, listSize] = react.useMemo(() => {
        const extra = type === "normal" && loop && items.length > display
            ? display + 1
            : 0;
        let list = [];
        if (extra <= 0) {
            list = [...items];
        }
        else {
            const head = items.slice(0, extra);
            const tail = items.slice(-extra);
            list = [...tail, ...items, ...head];
        }
        const listSize = `${(list.length / display) * 100}%`;
        return [list, extra, items.length, list.length, listSize];
    }, [display, loop, type, items]);
    const offsetPercent = react.useMemo(() => (-100 * (state.current + extra)) / total, [state.current, total]);
    const position = react.useMemo(() => {
        if (size <= display || type === "fade")
            return;
        const offset = vertical
            ? `0, ${offsetPercent}%`
            : `${offsetPercent}%, 0`;
        return `translate3d(${offset}, 0)`;
    }, [offsetPercent, vertical, display, size, type]);
    const trackStyle = react.useMemo(() => {
        if (!vertical || !itemHeight)
            return;
        return {
            height: itemHeight * display,
        };
    }, [vertical, itemHeight, display]);
    const indicatorsLoop = react.useMemo(() => {
        return Array.from({
            length: Math.ceil((size - display) / scroll) + 1,
        });
    }, [loop, indicator]);
    const clearTimer = () => {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    };
    const swipeTo = (i) => {
        if (!state.swipable || i === state.current)
            return;
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
            }
            else if (i < 0) {
                reset = true;
                i = -display;
                next = lastDisplay;
            }
        }
        else {
            next = utils.clamp(next, 0, lastDisplay);
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
        if (!draggable || !state.swipable || type === "fade")
            return;
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
        if (!state.dragging || !listRef.current)
            return;
        e.preventDefault();
        if (e.touches) {
            e = e.touches[0];
        }
        const dragEnd = vertical ? e.clientY : e.clientX;
        const offset = ((dragEnd - state.dragStart) * 61.8) /
            listRef.current[vertical ? "offsetHeight" : "offsetWidth"] +
            offsetPercent;
        listRef.current.style.transform = `translate3d(${vertical ? `0, ${offset}%` : `${offset}%, 0`}, 0)`;
    };
    const handleMouseUp = (e) => {
        if (!state.dragging || !listRef.current)
            return;
        if (e.changedTouches) {
            e = e.changedTouches[0];
        }
        const dragEnd = vertical ? e.clientY : e.clientX;
        const part = listRef.current[vertical ? "offsetHeight" : "offsetWidth"] / total;
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
        if (!pauseOnHover)
            return;
        clearTimer();
    };
    const handleMouseLeave = () => {
        if (!pauseOnHover)
            return;
        clearTimer();
        timerRef.current = setTimeout(swipeNext, interval);
    };
    hooks.useMouseMove(handleMouseMove);
    hooks.useMouseUp(handleMouseUp);
    react.useImperativeHandle(ref, () => ({
        swipeTo,
        swipeNext,
        swipePrev,
    }));
    react.useEffect(() => {
        if (!autoplay)
            return;
        timerRef.current = setTimeout(swipeNext, interval);
        return () => {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        };
    }, [autoplay, interval]);
    return (jsxRuntime.jsxs("div", { style: style, className: classNames__default("i-swiper", {
            "i-swiper-vertical": vertical,
            "i-swiper-initialized": state.initialized,
        }, className), children: [jsxRuntime.jsxs("div", { className: 'i-swiper-track', style: trackStyle, onMouseOver: handleMouseOver, onMouseLeave: handleMouseLeave, children: [jsxRuntime.jsx("div", { ref: listRef, className: classNames__default("i-swiper-list", {
                            "i-swiper-fade": type === "fade",
                        }), style: {
                            [vertical ? "height" : "width"]: listSize,
                            transform: position,
                            transition: state.transition,
                        }, onMouseDown: handleMouseDown, onTouchStart: handleMouseDown, children: displayItems.map((item$1, i) => {
                            const { props: itemProps } = item$1;
                            return (jsxRuntime.jsx(item.default, { index: i, itemIndex: (i - extra + size) % size, active: i - extra === state.current, type: type, gap: gap, transition: transition, itemHeight: itemHeight, vertical: vertical, onItemClick: onItemClick, ...itemProps }, i));
                        }) }), arrow && size > 1 && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [(loop || state.current !== 0) && (jsxRuntime.jsx("a", { className: 'i-swiper-arrow i-swiper-prev', onClick: swipePrev, children: prev })), (loop || state.current < size - display) && (jsxRuntime.jsx("a", { className: 'i-swiper-arrow i-swiper-next', onClick: swipeNext, children: next }))] }))] }), indicator && (jsxRuntime.jsx("div", { className: classNames__default("i-swiper-indicators", {
                    "i-swiper-indicators-fixed": fixedIndicator,
                }), children: indicatorsLoop.map((_, i) => {
                    return (jsxRuntime.jsx("a", { className: classNames__default("i-swiper-indicator", {
                            "i-indicator-active": i ===
                                Math[loop ? "floor" : "ceil"](((state.current + size) % size) /
                                    scroll),
                        }), onClick: () => swipeTo(i * scroll), children: renderIndicator?.(i) }, i));
                }) }))] }));
});
Swiper.Item = item.default;

exports.default = Swiper;
//# sourceMappingURL=swiper.js.map
