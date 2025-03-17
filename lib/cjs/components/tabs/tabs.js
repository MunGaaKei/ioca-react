'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var ahooks = require('ahooks');
var classNames = require('classnames');
var radash = require('radash');
var react = require('react');
var hooks = require('../../js/hooks.js');
require('../button/index.js');
var icon = require('../icon/icon.js');
var popup = require('../popup/popup.js');
var helpericon = require('../utils/helpericon/helpericon.js');
var item = require('./item.js');
var button = require('../button/button.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

const Tabs = ((props) => {
    const { ref, active, tabs: items, type = "default", prepend, append, children, className, vertical, toggable, navsJustify = "start", bar = true, hideMore, barClass, renderMore = () => (jsxRuntime.jsx(button.default, { flat: true, square: true, size: 'small', children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.MoreHorizRound, {}) }) })), onTabChange, ...rest } = props;
    const navRefs = react.useRef([]);
    const barRef = react.useRef(null);
    const navsRef = react.useRef(null);
    const state = ahooks.useReactive({
        active,
        prevActive: undefined,
        barStyle: {},
        cachedTabs: [],
        overflow: false,
        more: [],
        tabs: [],
    });
    const { observe, unobserve } = hooks.useIntersectionObserver();
    const size = ahooks.useSize(navsRef);
    react.useEffect(() => {
        if (!items) {
            if (!children) {
                state.tabs = [];
                return;
            }
            state.tabs = react.Children.map(children, (node, i) => {
                const { key, props: nodeProps } = node;
                const { title, children, content, keepDOM } = nodeProps;
                const cloned = children
                    ? typeof children === "string"
                        ? children
                        : radash.pick(children, ["props", "type", "$$typeof", "ref"])
                    : content;
                return {
                    key: key || String(i),
                    title,
                    content: cloned,
                    keepDOM,
                };
            });
            return;
        }
        state.tabs = items.map((item, i) => {
            if (["string", "number"].includes(typeof item)) {
                return { key: item, title: item };
            }
            if (item.key === undefined) {
                item.key = i;
            }
            return item;
        });
    }, [children, items]);
    const add = (tab) => {
        const { key } = tab;
        const i = state.tabs.findIndex((t) => t.key === key);
        if (i > -1) {
            open(state.tabs[i].key ?? i);
            return;
        }
        const l = state.tabs.length;
        const tkey = tab.key ?? l;
        state.tabs.push({ ...tab, key: tkey });
        open(tkey);
    };
    const close = (key) => {
        const i = state.tabs.findIndex((t) => t.key === key);
        if (i < 0)
            return;
        state.tabs.splice(i, 1);
        if (state.active !== key)
            return;
        const next = state.tabs[i] || state.tabs[i - 1];
        open(state.prevActive ?? next?.key ?? "");
    };
    const open = (key) => {
        if (key === state.active) {
            if (!toggable)
                return;
            onTabChange?.(undefined, key);
            state.active = undefined;
            state.barStyle = {
                height: 0,
                width: 0,
            };
            return;
        }
        state.prevActive = state.active;
        onTabChange?.(key, state.active);
        state.active = key;
    };
    react.useEffect(() => {
        if (!size || hideMore)
            return;
        const { scrollHeight, scrollWidth } = navsRef.current;
        const { width, height } = size;
        state.overflow = scrollHeight > height || scrollWidth > width;
        if (!state.overflow)
            return;
        navRefs.current.map((nav, i) => {
            if (!nav)
                return;
            observe(nav, (tar, visible) => {
                if (!state.tabs[i])
                    return;
                state.tabs[i].intersecting = visible;
                state.more = state.tabs.filter((tab) => !tab.intersecting);
            });
        });
    }, [size, hideMore, state.tabs.length]);
    react.useEffect(() => {
        if (!bar || type === "pane" || state.active === undefined) {
            return;
        }
        const index = state.tabs.findIndex((tab) => tab.key === state.active);
        setTimeout(() => {
            const nav = navRefs.current[index];
            if (!nav)
                return;
            if (state.tabs[index].keepDOM && state.active) {
                const i = state.cachedTabs.findIndex((k) => k === state.active);
                i < 0 && state.cachedTabs.unshift(state.active);
            }
            const { offsetHeight, offsetLeft, offsetTop, offsetWidth } = nav;
            const isLine = type === "line";
            state.barStyle = {
                height: !vertical && isLine ? ".25em" : offsetHeight,
                width: vertical && isLine ? ".25em" : offsetWidth,
                transform: `translate(${offsetLeft}px, ${offsetTop}px)`,
            };
        }, 16);
    }, [state.active, bar, size]);
    react.useEffect(() => {
        if (active === undefined || state.active === active)
            return;
        open(active);
    }, [active]);
    react.useEffect(() => {
        if (hideMore)
            return;
        return () => {
            navRefs.current?.map(unobserve);
        };
    }, [state.tabs.length]);
    react.useEffect(() => {
        if (!navsRef.current || vertical)
            return;
        const handleMouseWheel = (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (vertical)
                return;
            navsRef.current?.scrollBy({
                left: e.deltaY + e.deltaX,
            });
        };
        navsRef.current.addEventListener("wheel", handleMouseWheel, {
            passive: false,
        });
        return () => {
            if (!navsRef.current)
                return;
            navsRef.current.removeEventListener("wheel", handleMouseWheel);
        };
    }, [navsRef.current]);
    react.useImperativeHandle(ref, () => ({
        open,
        close,
        add,
        navs: navsRef,
    }));
    return (jsxRuntime.jsxs("div", { className: classNames__default.default("i-tabs", { flex: vertical, [`i-tabs-${type}`]: type !== "default" }, className), ...rest, children: [jsxRuntime.jsxs("div", { className: classNames__default.default("i-tab-navs-container", {
                    "i-tab-navs-vertical": vertical,
                }), children: [prepend, jsxRuntime.jsxs("div", { ref: navsRef, className: classNames__default.default("i-tab-navs", `justify-${navsJustify}`), children: [state.tabs.map((tab, i) => {
                                const { title, key = i, closable } = tab;
                                return (jsxRuntime.jsxs("a", { ref: (ref) => (navRefs.current[i] = ref), className: classNames__default.default("i-tab-nav", {
                                        "i-tab-active": state.active === key,
                                    }), onClick: () => open(key), children: [title, closable && (jsxRuntime.jsx(helpericon.default, { as: 'i', active: true, className: 'i-tab-nav-close', onClick: (e) => {
                                                e.stopPropagation();
                                                close(key);
                                            } }))] }, key));
                            }), bar && (jsxRuntime.jsx("span", { ref: barRef, className: classNames__default.default("i-tab-navs-bar", barClass), style: state.barStyle }))] }), !hideMore && state.overflow && state.more.length > 0 && (jsxRuntime.jsx(popup.default, { arrow: false, position: vertical ? "right" : "bottom", align: 'end', touchable: true, hideDelay: 500, content: jsxRuntime.jsx("div", { className: 'i-tabs-morelist pd-4', children: state.more.map((tab, i) => {
                                const { key = i, title } = tab;
                                const isActive = state.active === key;
                                return (jsxRuntime.jsx("a", { className: classNames__default.default("i-tab-nav", {
                                        "i-tab-active": isActive,
                                    }), onClick: () => open(key), children: title }, key));
                            }) }), children: renderMore(state.more) })), append] }), jsxRuntime.jsx("div", { className: 'i-tab-contents', children: state.tabs.map((tab, i) => {
                    const { key = i, content } = tab;
                    const isActive = state.active === key;
                    const show = isActive ||
                        (key !== undefined && state.cachedTabs.includes(key));
                    return (show && (jsxRuntime.jsx("div", { className: classNames__default.default("i-tab-content", {
                            "i-tab-active": isActive,
                        }), children: content }, key)));
                }) })] }));
});
Tabs.Item = item.default;

exports.default = Tabs;
//# sourceMappingURL=tabs.js.map
