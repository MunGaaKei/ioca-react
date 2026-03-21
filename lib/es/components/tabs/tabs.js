import { jsx, jsxs } from 'react/jsx-runtime';
import { MoreHorizRound } from '@ricons/material';
import classNames from 'classnames';
import { useRef, useState, useEffect, Children, useImperativeHandle } from 'react';
import { useIntersectionObserver, useSize } from '../../js/hooks.js';
import Button from '../button/button.js';
import Icon from '../icon/icon.js';
import Popup from '../popup/popup.js';
import Helpericon from '../utils/helpericon/helpericon.js';
import Item from './item.js';

const Tabs = ((props) => {
    const { ref, active, tabs: items, type = "default", prepend, append, children, className, vertical, toggable, navsJustify = "start", bar = true, hideMore, barClass, renderMore = () => (jsx(Button, { flat: true, square: true, size: 'small', children: jsx(Icon, { icon: jsx(MoreHorizRound, {}) }) })), onTabChange, ...rest } = props;
    const navRefs = useRef([]);
    const barRef = useRef(null);
    const navsRef = useRef(null);
    const contentsRef = useRef(new Map());
    const [activeKey, setActiveKey] = useState(active);
    const [prevActiveKey, setPrevActiveKey] = useState(undefined);
    const [barStyle, setBarStyle] = useState({});
    const [cachedTabs, setCachedTabs] = useState([]);
    const [overflow, setOverflow] = useState(false);
    const [moreTabs, setMoreTabs] = useState([]);
    const [tabs, setTabs] = useState([]);
    const { observe, unobserve } = useIntersectionObserver();
    const size = useSize(navsRef);
    useEffect(() => {
        contentsRef.current.clear();
        if (!items) {
            if (!children) {
                setTabs([]);
                return;
            }
            setTabs(Children.map(children, (node, i) => {
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
        const tkey = String(tab.key ?? tabs.length);
        const i = tabs.findIndex((t) => t.key === tkey);
        if (i > -1) {
            open(tabs[i].key ?? `${i}`);
            return;
        }
        contentsRef.current.set(tkey, tab.content);
        const { content, ...rest } = tab;
        setTabs((ts) => [...ts, { ...rest, key: tkey }]);
        open(tkey);
    };
    const close = (key) => {
        const i = tabs.findIndex((t) => t.key === key);
        if (i < 0)
            return;
        contentsRef.current.delete(key);
        const nextTabs = [...tabs];
        nextTabs.splice(i, 1);
        setTabs(nextTabs);
        if (activeKey !== key)
            return;
        const next = nextTabs[i] || nextTabs[i - 1];
        open(prevActiveKey ?? next?.key ?? "");
    };
    const open = (key) => {
        if (key === activeKey) {
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
        onTabChange?.(key, activeKey);
        setActiveKey(key);
    };
    useEffect(() => {
        if (!size || hideMore || !observe)
            return;
        const { scrollHeight, scrollWidth } = navsRef.current;
        const { width, height } = size;
        const nextOverflow = scrollHeight > height || scrollWidth > width;
        setOverflow(nextOverflow);
        if (!nextOverflow)
            return;
        navRefs.current.map((nav, i) => {
            if (!nav)
                return;
            observe(nav, (tar, visible) => {
                setTabs((ts) => {
                    if (!ts[i])
                        return ts;
                    const nextTabs = ts.map((t, idx) => idx === i ? { ...t, intersecting: visible } : t);
                    setMoreTabs(nextTabs.filter((tab) => !tab.intersecting));
                    return nextTabs;
                });
            });
        });
    }, [size, hideMore, tabs.length, observe]);
    useEffect(() => {
        if (!bar || type === "pane" || activeKey === undefined) {
            return;
        }
        const index = tabs.findIndex((tab) => tab.key === activeKey);
        setTimeout(() => {
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
    }, [activeKey, bar, size, tabs, type, vertical]);
    useEffect(() => {
        if (active === undefined || activeKey === active)
            return;
        open(active);
    }, [active]);
    useEffect(() => {
        if (hideMore || !unobserve)
            return;
        return () => {
            navRefs.current?.map(unobserve);
        };
    }, [tabs.length, hideMore, unobserve]);
    useEffect(() => {
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
    useImperativeHandle(ref, () => ({
        open,
        close,
        add,
        navs: navsRef,
    }));
    return (jsxs("div", { className: classNames("i-tabs", { flex: vertical, [`i-tabs-${type}`]: type !== "default" }, className), ...rest, children: [jsxs("div", { className: classNames("i-tab-navs-container", {
                    "i-tab-navs-vertical": vertical,
                }), children: [prepend, jsxs("div", { ref: navsRef, className: classNames("i-tab-navs", `justify-${navsJustify}`), children: [tabs.map((tab, i) => {
                                const { title, key = `${i}`, closable } = tab;
                                return (jsxs("a", { ref: (ref) => (navRefs.current[i] = ref), className: classNames("i-tab-nav", {
                                        "i-tab-active": activeKey === key,
                                    }), onClick: () => open(key), children: [title, closable && (jsx(Helpericon, { as: 'i', active: true, className: 'i-tab-nav-close', onClick: (e) => {
                                                e.stopPropagation();
                                                close(key);
                                            } }))] }, key));
                            }), bar && (jsx("span", { ref: barRef, className: classNames("i-tab-navs-bar", barClass), style: barStyle }))] }), !hideMore && overflow && moreTabs.length > 0 && (jsx(Popup, { arrow: false, position: vertical ? "right" : "bottom", align: 'end', touchable: true, hideDelay: 500, content: jsx("div", { className: 'i-tabs-morelist pd-4', children: moreTabs.map((tab, i) => {
                                const { key = `${i}`, title } = tab;
                                const isActive = activeKey === key;
                                return (jsx("a", { className: classNames("i-tab-nav", {
                                        "i-tab-active": isActive,
                                    }), onClick: () => open(key), children: title }, key));
                            }) }), children: renderMore(moreTabs) })), append] }), jsx("div", { className: 'i-tab-contents', children: tabs.map((tab, i) => {
                    const key = tab.key ?? `${i}`;
                    const content = contentsRef.current.get(key);
                    const isActive = activeKey === key;
                    const show = isActive ||
                        (key !== undefined && cachedTabs.includes(key));
                    return (show && (jsx("div", { className: classNames("i-tab-content", {
                            "i-tab-active": isActive,
                        }), children: content }, key)));
                }) })] }));
});
Tabs.Item = Item;

export { Tabs as default };
//# sourceMappingURL=tabs.js.map
