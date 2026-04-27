import { MoreHorizRound } from "@ricons/material";
import classNames from "classnames";
import {
    CSSProperties,
    Children,
    KeyboardEvent,
    ReactNode,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { useIntersectionObserver, useSize } from "../../js/hooks";
import Button from "../button";
import Icon from "../icon";
import Popup from "../popup";
import Helpericon from "../utils/helpericon";
import "./index.css";
import TabItem from "./item";
import { CompositionTabs, ITabItem, ITabs } from "./type";

const Tabs = ((props: ITabs) => {
    const {
        ref,
        active,
        tabs: items,
        type = "default",
        prepend,
        append,
        children,
        className,
        vertical,
        toggable,
        navsJustify = "start",
        bar = true,
        hideMore,
        barClass,
        renderMore = () => (
            <Button flat square size="small">
                <Icon icon={<MoreHorizRound />} />
            </Button>
        ),
        onTabChange,
        ...rest
    } = props;

    const navRefs = useRef<HTMLElement[]>([]);
    const barRef = useRef<HTMLSpanElement>(null);
    const navsRef = useRef<HTMLDivElement>(null);
    const contentsRef = useRef<Map<string, ReactNode>>(new Map());
    const [activeKey, setActiveKey] = useState<string | undefined>(active);
    const [prevActiveKey, setPrevActiveKey] = useState<string | undefined>(
        undefined,
    );
    const [barStyle, setBarStyle] = useState<CSSProperties>({});
    const [cachedTabs, setCachedTabs] = useState<string[]>([]);
    const [overflow, setOverflow] = useState(false);
    const [tabs, setTabs] = useState<ITabItem[]>([]);
    const { observe, unobserve } = useIntersectionObserver();
    const size = useSize(navsRef);

    const tabsRef = useRef<ITabItem[]>(tabs);
    tabsRef.current = tabs;
    const activeKeyRef = useRef<string | undefined>(activeKey);
    activeKeyRef.current = activeKey;
    const prevActiveKeyRef = useRef<string | undefined>(prevActiveKey);
    prevActiveKeyRef.current = prevActiveKey;

    useEffect(() => {
        contentsRef.current.clear();

        if (!items) {
            if (!children) {
                setTabs([]);
                return;
            }

            setTabs(
                (Children.map(children, (node, i) => {
                    const { key, props: nodeProps } = node as {
                        key?: string;
                        props?: any;
                    };
                    const {
                        title,
                        children: tabChildren,
                        content,
                        keepDOM,
                        closable,
                    } = nodeProps;
                    const tabKey = String(key ?? i);
                    contentsRef.current.set(tabKey, tabChildren ?? content);

                    return {
                        key: tabKey,
                        title,
                        keepDOM,
                        closable,
                    };
                }) as ITabItem[]) ?? [],
            );

            return;
        }

        setTabs(
            items.map((item, i) => {
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
            }),
        );
    }, [children, items]);

    const add = (tab: ITabItem) => {
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

    const close = (key: string) => {
        const currentTabs = tabsRef.current;
        const i = currentTabs.findIndex((t) => t.key === key);

        if (i < 0) return;

        contentsRef.current.delete(key);
        const nextTabs = [...currentTabs];
        nextTabs.splice(i, 1);
        setTabs(nextTabs);

        if (activeKeyRef.current !== key) return;

        const next = nextTabs[i] || nextTabs[i - 1];
        const prev = prevActiveKeyRef.current;
        const nextKey =
            prev && nextTabs.some((t) => t.key === prev) ? prev : next?.key;
        open(nextKey ?? "");
    };

    const open = (key: string) => {
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
            if (!toggable) return;

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

    const handleKeyAction = (e: KeyboardEvent<Element>, action: () => void) => {
        if (!["Enter", " "].includes(e.key)) return;
        e.preventDefault();
        action();
    };

    const scrollToTab = (key: string) => {
        const index = tabsRef.current.findIndex((tab) => tab.key === key);
        const nav = navRefs.current[index];

        nav?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
        });
    };

    const handleMoreTabClick = (key: string) => {
        open(key);
        scrollToTab(key);
    };

    useEffect(() => {
        if (!size || hideMore || !observe || !unobserve) return;
        const { scrollHeight, scrollWidth } = navsRef.current as HTMLElement;
        const { width, height } = size;

        const nextOverflow = scrollHeight > height || scrollWidth > width;
        setOverflow((v) => (v === nextOverflow ? v : nextOverflow));

        if (!nextOverflow) {
            setTabs((ts) => {
                let changed = false;
                const next = ts.map((t) => {
                    if (
                        t.intersecting === undefined ||
                        t.intersecting === true
                    ) {
                        return t;
                    }
                    changed = true;
                    return { ...t, intersecting: true };
                });
                return changed ? next : ts;
            });
            return;
        }

        const observed: HTMLElement[] = [];

        navRefs.current.map((nav, i) => {
            if (!nav) return;
            observed.push(nav);
            observe(nav, (_tar: HTMLElement, visible: boolean) => {
                setTabs((ts) => {
                    if (!ts[i]) return ts;
                    if (ts[i]?.intersecting === visible) return ts;
                    return ts.map((t, idx) =>
                        idx === i ? { ...t, intersecting: visible } : t,
                    );
                });
            });
        });

        return () => {
            observed.map((el) => unobserve(el));
        };
    }, [size, hideMore, tabs.length, observe, unobserve]);

    useEffect(() => {
        if (!bar || type === "pane" || activeKey === undefined) {
            return;
        }

        const index = tabs.findIndex((tab) => tab.key === activeKey);

        const timer = window.setTimeout(() => {
            const nav = navRefs.current[index];

            if (!nav) return;

            if (tabs[index]?.keepDOM && activeKey) {
                setCachedTabs((keys) => {
                    if (keys.includes(activeKey)) return keys;
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

    useEffect(() => {
        if (active === undefined || activeKey === active) return;

        open(active);
    }, [active]);

    useEffect(() => {
        if (!navsRef.current || vertical) return;

        const handleMouseWheel = (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (vertical) return;

            navsRef.current?.scrollBy({
                left: e.deltaY + e.deltaX,
            });
        };

        navsRef.current.addEventListener("wheel", handleMouseWheel, {
            passive: false,
        });

        return () => {
            if (!navsRef.current) return;
            navsRef.current.removeEventListener("wheel", handleMouseWheel);
        };
    }, [vertical]);

    useImperativeHandle(ref, () => ({
        open,
        close,
        add,
        navs: navsRef,
    }));

    const moreTabs =
        !hideMore && overflow
            ? tabs.filter((tab) => tab.intersecting === false)
            : [];

    return (
        <div
            className={classNames(
                "i-tabs",
                { flex: vertical, [`i-tabs-${type}`]: type !== "default" },
                className,
            )}
            {...rest}
        >
            <div
                className={classNames("i-tab-navs-container", {
                    "i-tab-navs-vertical": vertical,
                })}
            >
                {prepend}

                <div
                    ref={navsRef}
                    className={classNames(
                        "i-tab-navs",
                        `justify-${navsJustify}`,
                    )}
                    role="tablist"
                    aria-orientation={vertical ? "vertical" : "horizontal"}
                >
                    {tabs.map((tab, i) => {
                        const { title, key = `${i}`, closable } = tab;
                        const isActive = activeKey === key;

                        return (
                            <a
                                key={key}
                                ref={(ref) => (navRefs.current[i] = ref as any)}
                                className={classNames("i-tab-nav", {
                                    "i-tab-active": isActive,
                                })}
                                role="tab"
                                tabIndex={isActive ? 0 : -1}
                                aria-selected={isActive}
                                onClick={() => open(key)}
                                onKeyDown={(e) =>
                                    handleKeyAction(e, () => open(key))
                                }
                            >
                                {title}

                                {closable && (
                                    <Helpericon
                                        as="i"
                                        active
                                        className="i-tab-nav-close"
                                        role="button"
                                        tabIndex={0}
                                        aria-label="关闭标签页"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            close(key);
                                        }}
                                        onKeyDown={(e) =>
                                            handleKeyAction(e, () => close(key))
                                        }
                                    />
                                )}
                            </a>
                        );
                    })}

                    {bar && (
                        <span
                            ref={barRef}
                            className={classNames("i-tab-navs-bar", barClass)}
                            style={barStyle}
                        />
                    )}
                </div>

                {!hideMore && overflow && moreTabs.length > 0 && (
                    <Popup
                        arrow={false}
                        position={vertical ? "right" : "bottom"}
                        align="end"
                        touchable
                        hideDelay={500}
                        content={
                            <div className="i-tabs-morelist pd-4">
                                {moreTabs.map((tab, i) => {
                                    const { key = `${i}`, title } = tab;
                                    const isActive = activeKey === key;

                                    return (
                                        <a
                                            key={key}
                                            className={classNames("i-tab-nav", {
                                                "i-tab-active": isActive,
                                            })}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() =>
                                                handleMoreTabClick(key)
                                            }
                                            onKeyDown={(e) =>
                                                handleKeyAction(e, () =>
                                                    handleMoreTabClick(key),
                                                )
                                            }
                                        >
                                            {title}
                                        </a>
                                    );
                                })}
                            </div>
                        }
                    >
                        {renderMore(moreTabs)}
                    </Popup>
                )}

                {append}
            </div>

            <div className="i-tab-contents">
                {tabs.map((tab, i) => {
                    const key = tab.key ?? `${i}`;
                    const content = contentsRef.current.get(key);
                    const isActive = activeKey === key;
                    const show =
                        isActive ||
                        (key !== undefined && cachedTabs.includes(key));

                    return (
                        show && (
                            <div
                                key={key}
                                className={classNames("i-tab-content", {
                                    "i-tab-active": isActive,
                                })}
                                role="tabpanel"
                                aria-hidden={!isActive}
                            >
                                {content}
                            </div>
                        )
                    );
                })}
            </div>
        </div>
    );
}) as CompositionTabs;

Tabs.Item = TabItem;

export default Tabs;
