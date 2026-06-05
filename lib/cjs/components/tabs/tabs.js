'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var hooks = require('../../js/hooks.js');
var contents = require('./contents.js');
var helper = require('./helper.js');
var item = require('./item.js');
var navs = require('./navs.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Tabs = ((props) => {
    const { ref, active, tabs: items, type = "default", prepend, append, children, className, vertical, toggable, navsJustify = "start", navsClass, bar = true, hideMore, barClass, renderMore = helper.defaultRenderMore, onTabChange, ...rest } = props;
    const navRefs = react.useRef([]);
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
    const sourceKeysRef = react.useRef(new Set());
    const hiddenSourceKeysRef = react.useRef(new Set());
    const parsedTabs = react.useMemo(() => helper.getParsedTabs(items, children), [children, items]);
    react.useEffect(() => {
        const prevContents = new Map(contentsRef.current);
        const nextContents = new Map(parsedTabs.contents);
        const sourceTabs = parsedTabs.tabs;
        const sourceKeys = parsedTabs.keys;
        hiddenSourceKeysRef.current.forEach((key) => {
            if (!sourceKeys.has(key)) {
                hiddenSourceKeysRef.current.delete(key);
            }
        });
        const dynamicTabs = tabsRef.current.filter((tab) => {
            const key = String(tab.key);
            return !sourceKeysRef.current.has(key) && !sourceKeys.has(key);
        });
        dynamicTabs.forEach((tab) => {
            const key = String(tab.key);
            nextContents.set(key, prevContents.get(key));
        });
        sourceKeysRef.current = sourceKeys;
        contentsRef.current = nextContents;
        const nextTabs = [...sourceTabs.filter((tab) => !hiddenSourceKeysRef.current.has(String(tab.key))), ...dynamicTabs];
        setTabs((currentTabs) => (helper.isSameTabs(currentTabs, nextTabs) ? currentTabs : nextTabs));
    }, [parsedTabs]);
    const add = (tab, position) => {
        const currentTabs = tabsRef.current;
        const tkey = String(tab.key ?? currentTabs.length);
        const i = currentTabs.findIndex((t) => t.key === tkey);
        if (i > -1) {
            open(currentTabs[i].key ?? `${i}`);
            return;
        }
        contentsRef.current.set(tkey, tab.content);
        const { content, ...rest } = tab;
        setTabs((ts) => {
            const nextTabs = [...ts];
            const index = position === undefined ? nextTabs.length : Math.max(0, Math.min(position, nextTabs.length));
            nextTabs.splice(index, 0, { ...rest, key: tkey });
            return nextTabs;
        });
        open(tkey);
    };
    const close = (key) => {
        const currentTabs = tabsRef.current;
        const i = currentTabs.findIndex((t) => t.key === key);
        if (i < 0)
            return;
        if (sourceKeysRef.current.has(key)) {
            hiddenSourceKeysRef.current.add(key);
        }
        else {
            contentsRef.current.delete(key);
        }
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
            setBarStyle(helper.emptyBarStyle);
            return;
        }
        if (nextKey === activeKey) {
            if (!toggable)
                return;
            onTabChange?.(undefined, key);
            setActiveKey(undefined);
            setBarStyle(helper.emptyBarStyle);
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
    const setNavRef = (index, node) => {
        navRefs.current[index] = node;
    };
    const getContent = (key) => contentsRef.current.get(key);
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
                    if (t.intersecting === undefined || t.intersecting === true) {
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
        navRefs.current.forEach((nav, i) => {
            if (!nav)
                return;
            observed.push(nav);
            observe(nav, (_tar, visible) => {
                setTabs((ts) => {
                    if (!ts[i])
                        return ts;
                    if (ts[i]?.intersecting === visible)
                        return ts;
                    return ts.map((t, idx) => (idx === i ? { ...t, intersecting: visible } : t));
                });
            });
        });
        return () => {
            observed.forEach((el) => unobserve(el));
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
            setBarStyle({
                height: offsetHeight * 0.5,
                width: offsetWidth,
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
        setPrevActiveKey(activeKey);
        setActiveKey(active);
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
    const cachedTabKeySet = react.useMemo(() => new Set(cachedTabs), [cachedTabs]);
    const moreTabs = react.useMemo(() => (!hideMore && overflow ? tabs.filter((tab) => tab.intersecting === false) : []), [hideMore, overflow, tabs]);
    return (jsxRuntime.jsxs("div", { className: classNames__default("i-tabs", { flex: vertical, [`i-tabs-${type}`]: type !== "default" }, className), ...rest, children: [jsxRuntime.jsxs("div", { className: classNames__default("i-tab-navs-container", navsClass, {
                    "i-tab-navs-vertical": vertical,
                }), children: [prepend, jsxRuntime.jsx(navs.default, { tabs: tabs, moreTabs: moreTabs, activeKey: activeKey, vertical: vertical, overflow: overflow, hideMore: hideMore, navsJustify: navsJustify, bar: bar, barClass: barClass, barStyle: barStyle, navsRef: navsRef, renderMore: renderMore, setNavRef: setNavRef, onOpen: open, onClose: close, onMoreTabClick: handleMoreTabClick, onKeyAction: handleKeyAction }), append] }), jsxRuntime.jsx(contents.default, { tabs: tabs, activeKey: activeKey, cachedTabKeySet: cachedTabKeySet, getContent: getContent })] }));
});
Tabs.Item = item.default;

exports.default = Tabs;
//# sourceMappingURL=tabs.js.map
