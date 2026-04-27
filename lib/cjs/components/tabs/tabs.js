'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var react = require('react');
var hooks = require('../../js/hooks.js');
var button = require('../button/button.js');
var icon = require('../icon/icon.js');
var popup = require('../popup/popup.js');
var helpericon = require('../utils/helpericon/helpericon.js');
var item = require('./item.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Tabs = ((props) => {
    const { ref, active, tabs: items, type = "default", prepend, append, children, className, vertical, toggable, navsJustify = "start", bar = true, hideMore, barClass, renderMore = () => (jsxRuntime.jsx(button.default, { flat: true, square: true, size: "small", children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.MoreHorizRound, {}) }) })), onTabChange, ...rest } = props;
    const navRefs = react.useRef([]);
    const barRef = react.useRef(null);
    const navsRef = react.useRef(null);
    const contentsRef = react.useRef(new Map());
    const [activeKey, setActiveKey] = react.useState(active);
    const [prevActiveKey, setPrevActiveKey] = react.useState(undefined);
    const [barStyle, setBarStyle] = react.useState({});
    const [cachedTabs, setCachedTabs] = react.useState([]);
    const [overflow, setOverflow] = react.useState(false);
    const [tabs, setTabs] = react.useState([]);
    const { observe, unobserve } = hooks.useIntersectionObserver();
    const size = hooks.useSize(navsRef);
    const tabsRef = react.useRef(tabs);
    tabsRef.current = tabs;
    const activeKeyRef = react.useRef(activeKey);
    activeKeyRef.current = activeKey;
    const prevActiveKeyRef = react.useRef(prevActiveKey);
    prevActiveKeyRef.current = prevActiveKey;
    react.useEffect(() => {
        contentsRef.current.clear();
        if (!items) {
            if (!children) {
                setTabs([]);
                return;
            }
            setTabs(react.Children.map(children, (node, i) => {
                const { key, props: nodeProps } = node;
                const { title, children: tabChildren, content, keepDOM, closable, } = nodeProps;
                const tabKey = String(key ?? i);
                contentsRef.current.set(tabKey, tabChildren ?? content);
                return {
                    key: tabKey,
                    title,
                    keepDOM,
                    closable,
                };
            }) ?? []);
            return;
        }
        setTabs(items.map((item, i) => {
            if (["string", "number"].includes(typeof item)) {
                const key = String(item);
                return { key, title: item };
            }
            const key = String(item.key ?? i);
            contentsRef.current.set(key, item.content);
            const { content, ...rest } = item;
            return {
                ...rest,
                key,
            };
        }));
    }, [children, items]);
    const add = (tab) => {
        const currentTabs = tabsRef.current;
        const tkey = String(tab.key ?? currentTabs.length);
        const i = currentTabs.findIndex((t) => t.key === tkey);
        if (i > -1) {
            open(currentTabs[i].key ?? `${i}`);
            return;
        }
        contentsRef.current.set(tkey, tab.content);
        const { content, ...rest } = tab;
        setTabs((ts) => [...ts, { ...rest, key: tkey }]);
        open(tkey);
    };
    const close = (key) => {
        const currentTabs = tabsRef.current;
        const i = currentTabs.findIndex((t) => t.key === key);
        if (i < 0)
            return;
        contentsRef.current.delete(key);
        const nextTabs = [...currentTabs];
        nextTabs.splice(i, 1);
        setTabs(nextTabs);
        if (activeKeyRef.current !== key)
            return;
        const next = nextTabs[i] || nextTabs[i - 1];
        const prev = prevActiveKeyRef.current;
        const nextKey = prev && nextTabs.some((t) => t.key === prev) ? prev : next?.key;
        open(nextKey ?? "");
    };
    const open = (key) => {
        const nextKey = key || undefined;
        if (nextKey === undefined) {
            onTabChange?.(undefined, activeKey);
            setPrevActiveKey(activeKey);
            setActiveKey(undefined);
            setBarStyle({
                height: 0,
                width: 0,
            });
            return;
        }
        if (nextKey === activeKey) {
            if (!toggable)
                return;
            onTabChange?.(undefined, key);
            setActiveKey(undefined);
            setBarStyle({
                height: 0,
                width: 0,
            });
            return;
        }
        setPrevActiveKey(activeKey);
        onTabChange?.(nextKey, activeKey);
        setActiveKey(nextKey);
    };
    const handleKeyAction = (e, action) => {
        if (!["Enter", " "].includes(e.key))
            return;
        e.preventDefault();
        action();
    };
    const scrollToTab = (key) => {
        const index = tabsRef.current.findIndex((tab) => tab.key === key);
        const nav = navRefs.current[index];
        nav?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
        });
    };
    const handleMoreTabClick = (key) => {
        open(key);
        scrollToTab(key);
    };
    react.useEffect(() => {
        if (!size || hideMore || !observe || !unobserve)
            return;
        const { scrollHeight, scrollWidth } = navsRef.current;
        const { width, height } = size;
        const nextOverflow = scrollHeight > height || scrollWidth > width;
        setOverflow((v) => (v === nextOverflow ? v : nextOverflow));
        if (!nextOverflow) {
            setTabs((ts) => {
                let changed = false;
                const next = ts.map((t) => {
                    if (t.intersecting === undefined ||
                        t.intersecting === true) {
                        return t;
                    }
                    changed = true;
                    return { ...t, intersecting: true };
                });
                return changed ? next : ts;
            });
            return;
        }
        const observed = [];
        navRefs.current.map((nav, i) => {
            if (!nav)
                return;
            observed.push(nav);
            observe(nav, (_tar, visible) => {
                setTabs((ts) => {
                    if (!ts[i])
                        return ts;
                    if (ts[i]?.intersecting === visible)
                        return ts;
                    return ts.map((t, idx) => idx === i ? { ...t, intersecting: visible } : t);
                });
            });
        });
        return () => {
            observed.map((el) => unobserve(el));
        };
    }, [size, hideMore, tabs.length, observe, unobserve]);
    react.useEffect(() => {
        if (!bar || type === "pane" || activeKey === undefined) {
            return;
        }
        const index = tabs.findIndex((tab) => tab.key === activeKey);
        const timer = window.setTimeout(() => {
            const nav = navRefs.current[index];
            if (!nav)
                return;
            if (tabs[index]?.keepDOM && activeKey) {
                setCachedTabs((keys) => {
                    if (keys.includes(activeKey))
                        return keys;
                    return [activeKey, ...keys];
                });
            }
            const { offsetHeight, offsetLeft, offsetTop, offsetWidth } = nav;
            const isLine = type === "line";
            setBarStyle({
                height: !vertical && isLine ? ".25em" : offsetHeight,
                width: vertical && isLine ? ".25em" : offsetWidth,
                transform: `translate(${offsetLeft}px, ${offsetTop}px)`,
            });
        }, 16);
        return () => {
            window.clearTimeout(timer);
        };
    }, [activeKey, bar, size, tabs, type, vertical]);
    react.useEffect(() => {
        if (active === undefined || activeKey === active)
            return;
        open(active);
    }, [active]);
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
    }, [vertical]);
    react.useImperativeHandle(ref, () => ({
        open,
        close,
        add,
        navs: navsRef,
    }));
    const moreTabs = !hideMore && overflow
        ? tabs.filter((tab) => tab.intersecting === false)
        : [];
    return (jsxRuntime.jsxs("div", { className: classNames__default("i-tabs", { flex: vertical, [`i-tabs-${type}`]: type !== "default" }, className), ...rest, children: [jsxRuntime.jsxs("div", { className: classNames__default("i-tab-navs-container", {
                    "i-tab-navs-vertical": vertical,
                }), children: [prepend, jsxRuntime.jsxs("div", { ref: navsRef, className: classNames__default("i-tab-navs", `justify-${navsJustify}`), role: "tablist", "aria-orientation": vertical ? "vertical" : "horizontal", children: [tabs.map((tab, i) => {
                                const { title, key = `${i}`, closable } = tab;
                                const isActive = activeKey === key;
                                return (jsxRuntime.jsxs("a", { ref: (ref) => (navRefs.current[i] = ref), className: classNames__default("i-tab-nav", {
                                        "i-tab-active": isActive,
                                    }), role: "tab", tabIndex: isActive ? 0 : -1, "aria-selected": isActive, onClick: () => open(key), onKeyDown: (e) => handleKeyAction(e, () => open(key)), children: [title, closable && (jsxRuntime.jsx(helpericon.default, { as: "i", active: true, className: "i-tab-nav-close", role: "button", tabIndex: 0, "aria-label": "\u5173\u95ED\u6807\u7B7E\u9875", onClick: (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                close(key);
                                            }, onKeyDown: (e) => handleKeyAction(e, () => close(key)) }))] }, key));
                            }), bar && (jsxRuntime.jsx("span", { ref: barRef, className: classNames__default("i-tab-navs-bar", barClass), style: barStyle }))] }), !hideMore && overflow && moreTabs.length > 0 && (jsxRuntime.jsx(popup.default, { arrow: false, position: vertical ? "right" : "bottom", align: "end", touchable: true, hideDelay: 500, content: jsxRuntime.jsx("div", { className: "i-tabs-morelist pd-4", children: moreTabs.map((tab, i) => {
                                const { key = `${i}`, title } = tab;
                                const isActive = activeKey === key;
                                return (jsxRuntime.jsx("a", { className: classNames__default("i-tab-nav", {
                                        "i-tab-active": isActive,
                                    }), role: "button", tabIndex: 0, onClick: () => handleMoreTabClick(key), onKeyDown: (e) => handleKeyAction(e, () => handleMoreTabClick(key)), children: title }, key));
                            }) }), children: renderMore(moreTabs) })), append] }), jsxRuntime.jsx("div", { className: "i-tab-contents", children: tabs.map((tab, i) => {
                    const key = tab.key ?? `${i}`;
                    const content = contentsRef.current.get(key);
                    const isActive = activeKey === key;
                    const show = isActive ||
                        (key !== undefined && cachedTabs.includes(key));
                    return (show && (jsxRuntime.jsx("div", { className: classNames__default("i-tab-content", {
                            "i-tab-active": isActive,
                        }), role: "tabpanel", "aria-hidden": !isActive, children: content }, key)));
                }) })] }));
});
Tabs.Item = item.default;

exports.default = Tabs;
//# sourceMappingURL=tabs.js.map
