import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import classNames from 'classnames';
import { debounce, uid, throttle, title } from 'radash';
import { useState, useRef, useCallback, useEffect, useMemo, Children, cloneElement, createElement, isValidElement, Fragment as Fragment$1, useTransition, forwardRef, useLayoutEffect, memo, createContext, useContext, useImperativeHandle } from 'react';
import { SkipPreviousRound, CloseRound, MinusRound, PlusRound, InboxTwotone, ClearAllRound, UndoRound, RedoRound, StrikethroughSRound, FormatUnderlinedRound, FormatItalicRound, FormatBoldRound, PlayArrowRound, PauseRound, StopRound, VolumeDownRound, VolumeOffRound, FullscreenRound, FullscreenExitRound, FeedOutlined, AspectRatioRound, OpenInNewRound, FileDownloadOutlined, RotateRightRound, RotateLeftRound, KeyboardArrowLeftRound, KeyboardArrowRightRound, KeyboardDoubleArrowUpRound, SyncAltRound, VisibilityRound, VisibilityOffRound, MoreHorizRound, SearchRound, CheckRound, UnfoldMoreRound, CalendarMonthTwotone, AccessTimeRound, InfoOutlined, KeyboardArrowDownRound, ListAltRound, DriveFolderUploadOutlined, PlusSharp } from '@ricons/material';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import xss, { escapeAttrValue } from 'xss';
import { renderToStaticMarkup } from 'react-dom/server';
import PubSub from 'pubsub-js';
import { findAll } from 'highlight-words-core';
import ColorsPanel from '@rc-component/color-picker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import SortableContainer, { SortableItem } from 'react-easy-sort';

const TIMEOUT = 500;
const useRipple = () => {
    if (!document)
        return;
    if (document.documentElement.dataset["iocaRipple"])
        return;
    document.documentElement.dataset["iocaRipple"] = "enable";
    document.addEventListener("mousedown", listener);
};
function listener(e) {
    const target = e.target;
    const parent = target.closest("[data-ripple]");
    if (!target || !parent)
        return;
    triggerRipple(parent, e);
}
function triggerRipple(target, e) {
    if (!document)
        return;
    const [$box, $ripple] = createRipple();
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    $ripple.style.cssText = `
        left: ${e.pageX - rect.left}px;
        top: ${e.pageY - rect.top}px;
        width: ${size}px;
        height: ${size}px;
        transition: all ${TIMEOUT / 1000}s;
    `;
    target.insertAdjacentElement("afterbegin", $box);
    target.offsetHeight;
    $ripple.classList.add("i-ripple-active");
    setTimeout(() => {
        $box.remove();
    }, TIMEOUT);
}
function createRipple() {
    const $box = document.createElement("SPAN");
    const $ripple = document.createElement("SPAN");
    $box.className = "i-ripple-container";
    $ripple.className = "i-ripple";
    $box.append($ripple);
    return [$box, $ripple];
}

const Loading = (props) => {
    const { icon, text, size, absolute, style, className, ...restProps } = props;
    return (jsxs("div", { className: classNames("i-loading-container", {
            absolute,
        }, className), style: {
            ...style,
            inset: absolute ? 0 : "unset",
        }, ...restProps, children: [icon ?? (jsx("svg", { width: '24', height: '24', stroke: '#000', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg', className: 'i-loading-icon', style: {
                    fontSize: size,
                }, children: jsx("circle", { cx: '12', cy: '12', r: '9.5', fill: 'none', strokeWidth: '3', strokeLinecap: 'round', strokeDasharray: 40, strokeDashoffset: 0 }) })), text] }));
};

const MouseMoveEvents = new Set();
const MouseUpEvents = new Set();
const KeydownEvents = new Set();
let initialized = false;
const initEvents = () => {
    if (typeof document === "undefined" || initialized)
        return;
    initialized = true;
    const touchable = "ontouchend" in document;
    const EVENTS = {
        MOVE: touchable ? "touchmove" : "mousemove",
        UP: touchable ? "touchend" : "mouseup",
        KEYDOWN: "keydown",
    };
    document.addEventListener(EVENTS.MOVE, (e) => {
        for (const listener of MouseMoveEvents.values()) {
            listener(e);
        }
    }, { passive: false });
    document.addEventListener(EVENTS.UP, (e) => {
        for (const listener of MouseUpEvents.values()) {
            listener(e);
        }
    });
    document.addEventListener(EVENTS.KEYDOWN, (e) => {
        for (const listener of KeydownEvents.values()) {
            listener(e);
        }
    });
};
function initEventsOnce() {
    useEffect(initEvents, []);
}
function useMouseMove(listener, options) {
    initEventsOnce();
    useEffect(() => {
        MouseMoveEvents.add(listener);
        return () => {
            MouseMoveEvents.delete(listener);
        };
    }, []);
}
function useMouseUp(listener, options) {
    initEventsOnce();
    useEffect(() => {
        MouseUpEvents.add(listener);
        return () => {
            MouseUpEvents.delete(listener);
        };
    }, []);
}
function useKeydown(listener, options) {
    initEventsOnce();
    useEffect(() => {
        if (options?.disabled)
            return;
        KeydownEvents.add(listener);
        return () => {
            KeydownEvents.delete(listener);
        };
    }, []);
}
function useReactive(initialState) {
    const [, setFlag] = useState(0);
    const scheduledRef = useRef(false);
    const proxyCacheRef = useRef(new WeakMap());
    const rootRef = useRef(null);
    const proxyRef = useRef(null);
    const notify = () => {
        if (scheduledRef.current)
            return;
        scheduledRef.current = true;
        const flush = () => {
            scheduledRef.current = false;
            setFlag((n) => n + 1);
        };
        if (typeof queueMicrotask !== "undefined") {
            queueMicrotask(flush);
            return;
        }
        Promise.resolve().then(flush);
    };
    const createProxy = (target) => {
        if (!target || typeof target !== "object")
            return target;
        if (!Array.isArray(target)) {
            const proto = Object.getPrototypeOf(target);
            const isPlainObject = proto === Object.prototype || proto === null;
            if (!isPlainObject)
                return target;
        }
        const cached = proxyCacheRef.current.get(target);
        if (cached)
            return cached;
        const proxy = new Proxy(target, {
            get(t, p, r) {
                return createProxy(Reflect.get(t, p, r));
            },
            set(t, p, v, r) {
                const prev = Reflect.get(t, p, r);
                const ok = Reflect.set(t, p, v, r);
                if (prev !== v)
                    notify();
                return ok;
            },
            deleteProperty(t, p) {
                const had = Object.prototype.hasOwnProperty.call(t, p);
                const ok = Reflect.deleteProperty(t, p);
                if (had)
                    notify();
                return ok;
            },
        });
        proxyCacheRef.current.set(target, proxy);
        return proxy;
    };
    if (!proxyRef.current) {
        rootRef.current = initialState;
        proxyRef.current = createProxy(rootRef.current);
    }
    return proxyRef.current;
}
function useSize(target) {
    const [size, setSize] = useState();
    useEffect(() => {
        if (typeof window === "undefined")
            return;
        const resolveTarget = () => {
            if (!target)
                return null;
            if (typeof target === "function")
                return target();
            if (typeof target === "object" && "current" in target) {
                return target.current;
            }
            return target;
        };
        const el = resolveTarget();
        if (!el)
            return;
        const update = () => {
            const rect = el.getBoundingClientRect();
            setSize({ width: rect.width, height: rect.height });
        };
        update();
        let ro;
        if (typeof ResizeObserver !== "undefined") {
            ro = new ResizeObserver(update);
            ro.observe(el);
        }
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("resize", update);
            ro?.disconnect();
        };
    }, [target]);
    return size;
}
const defaultObserver = {
    observe: undefined,
    unobserve: undefined,
    disconnect: undefined,
};
function useIntersectionObserver(configs) {
    const wmRef = useRef(new WeakMap());
    const ioRef = useRef(undefined);
    if (typeof window !== "undefined" && !ioRef.current) {
        ioRef.current = new IntersectionObserver((entries) => {
            entries.map((entry) => {
                const callback = wmRef.current.get(entry.target);
                callback?.(entry.target, entry.isIntersecting);
            });
        }, configs);
    }
    const observe = useCallback((target, callback) => {
        if (!target || !ioRef.current || wmRef.current.get(target))
            return;
        wmRef.current.set(target, callback);
        ioRef.current.observe(target);
    }, []);
    const unobserve = useCallback((target) => {
        if (!target || !ioRef.current)
            return;
        ioRef.current.unobserve(target);
        wmRef.current.delete(target);
    }, []);
    const disconnect = useCallback(() => {
        ioRef.current?.disconnect();
    }, []);
    useEffect(() => {
        return () => {
            ioRef.current?.disconnect();
        };
    }, []);
    if (typeof window === "undefined") {
        return {
            ...defaultObserver,
        };
    }
    return {
        observe,
        unobserve,
        disconnect,
    };
}
function useResizeObserver() {
    const wmRef = useRef(new WeakMap());
    const ioRef = useRef(undefined);
    if (typeof window !== "undefined" && !ioRef.current) {
        ioRef.current = new ResizeObserver((entries) => {
            entries.map((entry) => {
                const callback = wmRef.current.get(entry.target);
                callback?.(entry.target);
            });
        });
    }
    const observe = useCallback((target, callback) => {
        if (!target || !ioRef.current || wmRef.current.get(target))
            return;
        ioRef.current.observe(target);
        wmRef.current.set(target, callback);
    }, []);
    const unobserve = useCallback((target) => {
        if (!target || !ioRef.current)
            return;
        ioRef.current.unobserve(target);
        wmRef.current.delete(target);
    }, []);
    const disconnect = useCallback(() => {
        ioRef.current?.disconnect();
    }, []);
    useEffect(() => {
        return () => {
            ioRef.current?.disconnect();
        };
    }, []);
    if (typeof window === "undefined") {
        return {
            ...defaultObserver,
        };
    }
    return {
        observe,
        unobserve,
        disconnect,
    };
}

const defaultOk$1 = {
    children: "确定",
    className: "bg-error",
};
const defaultCancel$1 = {
    children: "取消",
    secondary: true,
};
function Confirm(props) {
    const { ref, size, defaultActive, okButtonProps, cancelButtonProps, onOk, onCancel, onClick, ...restProps } = props;
    const state = useReactive({
        active: defaultActive ?? false,
        loading: false,
    });
    const ok = okButtonProps
        ? Object.assign({}, defaultOk$1, okButtonProps)
        : defaultOk$1;
    const cancel = cancelButtonProps
        ? Object.assign({}, defaultCancel$1, cancelButtonProps)
        : defaultCancel$1;
    const handleClick = (e) => {
        onClick?.(e);
        state.active = true;
    };
    const hanldeOk = async () => {
        if (state.loading)
            return;
        state.loading = true;
        try {
            const res = await onOk?.();
            if (res !== false) {
                state.active = false;
            }
        }
        finally {
            state.loading = false;
        }
    };
    const handleCancel = () => {
        onCancel?.();
        state.active = false;
    };
    if (!state.active) {
        return (jsx(Button, { ref: ref, size: size, ...restProps, onClick: handleClick }));
    }
    return (jsxs(Button.Group, { children: [jsx(Button, { size: size, ...ok, loading: state.loading, onClick: hanldeOk }), jsx(Button, { size: size, ...cancel, disabled: state.loading, onClick: handleCancel })] }));
}

function Group(props) {
    const { children, vertical, buttonProps, className, style } = props;
    const nodes = useMemo(() => {
        return Children.map(children, (node) => {
            const { type } = node;
            if (type === Button) {
                return cloneElement(node, Object.assign({}, node.props, buttonProps));
            }
            return node;
        });
    }, [children]);
    return (jsx("div", { className: classNames(className, vertical ? "i-btn-group-vertical" : "i-btn-group-horizonal"), style: style, children: nodes }));
}

function Toggle(props) {
    const { ref, active, activeClass, after, disabled, children, className, toggable, onClick, onToggle, ...restProps } = props;
    const [isActive, setIsActive] = useState(active);
    const [done, setDone] = useState(true);
    const toggle = async () => {
        const hasAfter = !!after;
        const nextActive = !isActive;
        const canToggle = toggable ? await toggable() : true;
        if (!canToggle)
            return;
        setIsActive(nextActive);
        setDone(!hasAfter);
        onToggle?.(nextActive);
        if (!hasAfter)
            return;
        setTimeout(() => {
            setDone(true);
        }, 16);
    };
    const handleClick = (e) => {
        onClick?.(e);
        !disabled && toggle();
    };
    useEffect(() => {
        setIsActive(active);
        setDone(true);
    }, [active]);
    return (jsx(Button, { ref: ref, className: classNames(className, { [activeClass || ""]: isActive }, "i-btn-toggle"), ...restProps, onClick: handleClick, children: jsx("div", { className: classNames("i-btn-toggle-content", {
                "i-btn-toggle-active": done,
            }), children: isActive ? (after ?? children) : children }) }));
}

const formatClass = ({ outline, flat, loading, disabled, size = "normal", block, round, square, secondary, className, }) => classNames("i-btn", className, {
    "i-btn-outline": outline,
    "i-btn-flat": flat,
    "i-btn-block": block,
    "i-btn-loading": loading,
    "i-btn-square": square,
    "i-btn-secondary": secondary,
    [`i-btn-${size}`]: size !== "normal",
    round,
    disabled,
});
const Button = (props) => {
    const { as: As = "a", ref, children, className, loading, flat, outline, square, secondary, size, round, href, ripple = true, onClick, ...restProps } = props;
    const handleClick = (e) => {
        if (loading || restProps.disabled) {
            e.stopPropagation();
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };
    if (!children)
        return jsx(Fragment, {});
    const childNodes = [
        loading && jsx(Loading, {}, 'loading'),
        createElement("span", { key: "content", className: "i-btn-content" }, children),
    ];
    const attrs = {
        className: formatClass(props),
        ["data-ripple"]: ripple && !loading && !restProps.disabled ? "" : undefined,
        onClick: handleClick,
    };
    useEffect(() => {
        ripple && useRipple();
    }, [ripple]);
    if (typeof As === "string") {
        return createElement(As, {
            ref,
            href,
            ...attrs,
            ...restProps,
        }, childNodes);
    }
    return createElement(As, {
        to: href || "",
        ...attrs,
        ...restProps,
    }, childNodes);
};
Button.Toggle = Toggle;
Button.Confirm = Confirm;
Button.Group = Group;

const Icon = (props) => {
    const { ref, icon, size = "1.425em", rotate, style, className, ...restProps } = props;
    if (!isValidElement(icon))
        return icon;
    const iconProps = {
        ref,
        style: {
            transform: rotate ? `rotate(${rotate}deg)` : undefined,
            ...style,
            width: size,
            height: size,
        },
        className: classNames("i-icon", className),
        ...restProps,
    };
    return cloneElement(icon, iconProps);
};

function ToTop(props) {
    const { style, className, onClick } = props;
    return (jsx(Button, { square: true, className: classNames("i-affix-totop", className), style: { ...style }, onClick: onClick, children: jsx(Icon, { icon: jsx(SkipPreviousRound, {}), rotate: 90 }) }));
}

const Affix = (props) => {
    const { position = "fixed", left, top, right, bottom, offset, style, className, children, getContainer = () => {
        if (typeof document === "undefined")
            return null;
        return document.body;
    }, } = props;
    const [hidden, setHidden] = useState(false);
    const hijackChildren = useMemo(() => {
        return Children.map(children, (node) => {
            if (node.type === ToTop) {
                const { onClick } = node.props;
                return cloneElement(node, {
                    key: node.key,
                    ...node.props,
                    onClick: (e) => {
                        const container = getContainer();
                        onClick?.(e);
                        container?.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: "smooth",
                        });
                    },
                });
            }
            return node;
        });
    }, [children, getContainer]);
    useEffect(() => {
        const container = getContainer();
        if (!offset || !container)
            return;
        const listener = debounce({ delay: 160 }, () => {
            const top = container.scrollTop;
            setHidden(top < offset);
        });
        listener();
        container.addEventListener("scroll", listener);
        return () => {
            container.removeEventListener("scroll", listener);
        };
    }, [offset, getContainer]);
    return (jsx("div", { className: classNames("i-affix", className, {
            "i-affix-hidden": hidden,
        }), style: {
            ...style,
            position,
            left,
            top,
            right,
            bottom,
        }, children: hijackChildren }));
};
Affix.ToTop = ToTop;

const Badge = (props) => {
    const { content, contentClass, dot, dotSize, round, disabled, style, className, children, } = props;
    return (jsxs("div", { style: style, className: classNames("i-badge", { rounded: round }, className), children: [children, jsx("div", { className: classNames("i-badge-content", contentClass, {
                    "i-badge-dot": dot,
                    "i-badge-hidden": disabled,
                }), style: { fontSize: dotSize }, children: content })] }));
};

const Card = (props) => {
    const { hideShadow, border, className, children, header, footer, ...restProps } = props;
    return (jsxs("div", { className: classNames("i-card", className, {
            shadow: !hideShadow,
            "i-card-bordered": border,
        }), ...restProps, children: [header && jsx("div", { className: 'i-card-header', children: header }), children && jsx("div", { className: 'i-card-content', children: children }), footer && jsx("div", { className: 'i-card-footer', children: footer })] }));
};

function getPosition($source, $popup, options = {}) {
    const { refWindow, gap = 0, offset = 0, position = "top", align } = options;
    if (!$source || !$popup)
        return [
            0,
            0,
            {
                arrowX: 0,
                arrowY: 0,
                arrowPos: "bottom",
            },
        ];
    const rectT = $source.getBoundingClientRect();
    const rectC = $popup.getBoundingClientRect();
    let w = window.innerWidth;
    let h = window.innerHeight;
    let { left: tl, top: tt, right: tr, bottom: tb, width: tw, height: th, } = rectT;
    const { height: ch, width: cw } = rectC;
    if (!refWindow) {
        const rectPa = $source.offsetParent?.getBoundingClientRect();
        w = rectPa?.width || w;
        h = rectPa?.height || h;
        tl = $source.offsetLeft;
        tt = $source.offsetTop;
        tr = tl + rectT.width;
        tb = tt + rectT.height;
    }
    let y = 0;
    let x = 0;
    let arrowX = 0;
    let arrowY = 0;
    let arrowPos = "bottom";
    switch (position) {
        case "left":
        case "right":
            y =
                th !== ch
                    ? computePosition({
                        containerSize: h,
                        targetSize: th,
                        targetOffset: tt,
                        contentSize: ch,
                        gap,
                        align,
                    })
                    : tt;
            arrowY = y < tt ? tt - y + th / 2 : th / 2;
            const xl = tl - offset - cw;
            const xr = tr + offset + cw;
            if (position === "left") {
                const R = xl < 0 && xr <= w;
                x = R ? tr + offset : xl;
                arrowX = R ? 0 : cw;
                arrowPos = R ? "left" : "right";
            }
            else {
                const R = w > xr || xl < 0;
                x = R ? tr + offset : xl;
                arrowX = R ? 0 : cw;
                arrowPos = R ? "left" : "right";
            }
            break;
        case "top":
        case "bottom":
            x =
                tw !== cw
                    ? computePosition({
                        containerSize: w,
                        targetOffset: tl,
                        targetSize: tw,
                        contentSize: cw,
                        gap,
                        align,
                    })
                    : tl;
            arrowX = x > tl ? cw / 2 : tl - x + tw / 2;
            const yt = tt - offset - ch;
            const yb = tb + offset + ch;
            if (position === "top") {
                const T = yt < 0 && yb <= h;
                y = T ? tb + offset : yt;
                arrowY = T ? 0 : ch;
                arrowPos = T ? "top" : "bottom";
            }
            else {
                const B = h > yb || yt < 0;
                y = B ? tb + offset : yt;
                arrowY = B ? 0 : ch;
                arrowPos = B ? "top" : "bottom";
            }
            break;
    }
    return [
        x,
        y,
        {
            arrowX,
            arrowY,
            arrowPos,
        },
    ];
}
function getPointPosition(e, content) {
    const { width: w, height: h } = content.getBoundingClientRect();
    const parent = content.offsetParent;
    let pw, ph, pl = 0, pt = 0;
    if (parent) {
        const { width: ow, height: oh, left: ol, top: ot, } = parent.getBoundingClientRect();
        const st = parent.scrollTop ?? 0;
        pw = ow;
        ph = oh;
        pt = ot - st;
        pl = ol;
    }
    else {
        pw = window.innerWidth;
        ph = window.innerHeight;
    }
    const x = e.pageX - pl;
    const y = e.pageY - pt;
    const left = x + w >= pw ? (x - w > 0 ? x - w : x) : x;
    const top = y + h >= ph ? (y - h > 0 ? y - h : y) : y;
    return [left, top];
}
function computePosition({ containerSize, targetSize, targetOffset, contentSize, gap, align = "center", }) {
    const centerPoint = targetOffset + targetSize / 2;
    switch (align) {
        case "start":
            return targetOffset + contentSize > containerSize
                ? containerSize - contentSize - gap
                : targetOffset;
        case "center":
            if (targetSize >= contentSize) {
                return centerPoint - contentSize / 2;
            }
            if (centerPoint + contentSize / 2 + gap > containerSize) {
                return targetOffset + targetSize - contentSize;
            }
            if (centerPoint - contentSize / 2 - gap < 0) {
                return gap;
            }
            return centerPoint - contentSize / 2;
        case "end":
            const result = targetOffset + targetSize - contentSize;
            return result > 0 ? result : gap;
        default:
            return centerPoint - contentSize / 2;
    }
}
function formatOption(options) {
    return options.map((option) => ["string", "number"].includes(typeof option)
        ? { label: option, value: option }
        : option);
}
function animate(from, to, duration = 1000, callback, easing = (t) => 1 - Math.pow(1 - t, 4)) {
    const start = performance.now();
    const diff = to - from;
    let raf = requestAnimationFrame(loop);
    function loop() {
        raf = requestAnimationFrame(loop);
        const past = performance.now() - start;
        let percent = past / duration;
        if (percent >= 1) {
            percent = 1;
            cancelAnimationFrame(raf);
        }
        const pass = diff * easing(percent);
        callback?.(pass);
    }
}
function formatNumber(value, options = {}) {
    const { precision, thousand } = options;
    const result = value.toFixed(precision);
    if (!thousand)
        return result;
    const points = result.split(".");
    const integer = points[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, `$&${thousand}`);
    if (points.length === 1)
        return integer;
    return `${integer}.${points[1]}`;
}
function renderNode(node, container = document.body) {
    const div = document.createElement("div");
    container.append(div);
    const root = createRoot(div);
    const sto = setTimeout(() => {
        root?.render(node);
    }, 0);
    return () => {
        div?.remove();
        root?.unmount();
        sto && clearTimeout(sto);
    };
}
function getSuffixByUrl(url) {
    return url.match(/\.([^\./\?]+)($|\?)/)?.[1];
}
function getFileType(suffix, type) {
    switch (true) {
        case [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "svg",
            "avif",
            "heif",
            "heic",
            "apng",
            "bmp",
            "ico",
        ].includes(suffix) || type?.startsWith("image/"):
            return "IMAGE";
        case [
            "mp4",
            "avi",
            "webm",
            "ogv",
            "mov",
            "mkv",
            "mpd",
            "m3u8",
        ].includes(suffix) || type?.startsWith("video/"):
            return "VIDEO";
        default:
            return "UNKNOWN";
    }
}
function fullScreen(el) {
    el.requestFullscreen?.();
}
function exitFullScreen() {
    document.exitFullscreen?.();
}
function formatTime(time, options) {
    const result = [];
    const { zero = true, units = ["", ":", ":"] } = options || {};
    const l = units.length;
    let i = 0;
    while (i < l) {
        if (time <= 0 && i > 1)
            break;
        const n = Math.round(time % 60);
        time = Math.floor(time / 60);
        result.unshift((zero && n < 10 ? `0${n}` : n) + units[i++]);
    }
    return result.join("");
}
function getNextSorter(prevSortBy, prevSortType, sortBy) {
    const types = ["desc", "asc"];
    if (prevSortBy === sortBy) {
        const i = types.findIndex((t) => t === prevSortType) + 1;
        const type = types[i] || "";
        const by = type === "" ? "" : sortBy;
        return [by, type];
    }
    return [sortBy, "desc"];
}
function formatBytes(bytes, decimals = 2) {
    if (!+bytes)
        return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
}
const arrayMove = (array, fromIndex, toIndex) => {
    if (toIndex >= array.length) {
        let k = toIndex - array.length + 1;
        while (k--) {
            array.push(undefined);
        }
    }
    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
    return array;
};

function CheckboxItem(props) {
    const { type = "default", label, name, value = false, className, status = "normal", message, disabled, partof, optionValue, children, onChange, ...restProps } = props;
    const [checked, setChecked] = useState(value);
    const [itemStatus, setItemStatus] = useState(status);
    const [itemMessage, setItemMessage] = useState(message);
    const isChildrenFn = typeof children === "function";
    const handleChange = (e) => {
        const next = e.target.checked;
        setChecked(next);
        setItemStatus(status);
        setItemMessage(message);
        onChange?.(next, e);
    };
    useEffect(() => {
        setChecked(value);
    }, [value]);
    useEffect(() => {
        setItemStatus(status);
        setItemMessage(message);
    }, [status, message]);
    return (jsxs("label", { className: classNames("i-checkbox-item", {
            [`i-checkbox-${itemStatus}`]: itemStatus !== "normal",
            disabled,
        }, className), ...restProps, children: [jsx("input", { type: 'checkbox', name: name, className: classNames("i-checkbox-input", {
                    [`i-checkbox-${type}`]: !partof,
                    "i-checkbox-partof": partof,
                }), checked: checked, disabled: disabled, onChange: handleChange }), isChildrenFn ? (children(checked, optionValue)) : (jsx("span", { className: 'i-checkbox-text', children: children || label })), itemMessage && (jsxs("span", { className: 'i-checkbox-message', children: ["*", itemMessage] }))] }));
}

function Checkbox(props) {
    const { label, name, options = [], value = "", type = "default", optionInline = true, labelInline, disabled, status = "normal", message, required, className, renderItem, onChange, ...restProps } = props;
    const [selectedValues, setSelectedValues] = useState(value);
    const formattedOptions = useMemo(() => formatOption(options), [options]);
    const handleChange = (checked, opt, e) => {
        const group = [...selectedValues];
        const i = group.findIndex((item) => item === opt.value);
        if (checked && i < 0) {
            group.push(opt.value);
        }
        else if (!checked && i > -1) {
            group.splice(i, 1);
        }
        setSelectedValues(group);
        onChange?.(group, opt, e);
    };
    useEffect(() => {
        setSelectedValues(value);
    }, [value]);
    return (jsxs("div", { className: classNames("i-checkbox i-input-label", {
            [`i-checkbox-${status}`]: status !== "normal",
            "i-input-inline": labelInline,
        }, className), ...restProps, children: [label && (jsxs("span", { className: 'i-input-label-text', children: [required && jsx("span", { className: 'error', children: "*" }), label, message && jsx("p", { className: 'i-checkbox-message', children: message })] })), jsx("div", { className: classNames("i-checkbox-options", {
                    "i-options-block": !optionInline,
                    "i-checkbox-options-button": type === "button",
                }), children: formattedOptions.map((option) => {
                    return (jsx(CheckboxItem, { name: name, value: selectedValues.includes(option.value), optionValue: option.value, type: type, disabled: disabled || option.disabled, onChange: (checked, e) => handleChange(checked, option, e), children: renderItem ?? option.label }, option.value));
                }) })] }));
}
Checkbox.Item = CheckboxItem;

const Helpericon = (props) => {
    const { as = "a", active, className, icon = jsx(CloseRound, {}), ...restProps } = props;
    if (!active)
        return jsx(Fragment, {});
    return createElement(as, {
        className: classNames("i-helpericon", className),
        ...restProps,
    }, [
        createElement(Icon, {
            key: uid(3),
            icon,
        }),
    ]);
};

function Item$5(props) {
    return jsx(Fragment, {});
}

const Collapse = (props) => {
    const { active, items, multiple, border, headerClickable, className, children, renderToggle = (active) => active ? jsx(MinusRound, {}) : jsx(PlusRound, {}), onCollapse, ...restProps } = props;
    const [activeKey, setActiveKey] = useState(active);
    const collapses = useMemo(() => {
        if (!items) {
            if (!children)
                return [];
            return (Children.map(children, (node, i) => {
                const { key, props: nodeProps } = node;
                const { title, children, content, disabled, ...restProps } = nodeProps;
                return {
                    ...restProps,
                    key: key || i,
                    title,
                    content: children || content,
                    disabled,
                };
            }) || []);
        }
        return items;
    }, [children]);
    const handleHeaderClick = (item) => {
        if (!headerClickable)
            return;
        handleToggle(item);
    };
    const handleToggle = (item, e) => {
        const { key, disabled } = item;
        e?.stopPropagation();
        if (disabled)
            return;
        if (!multiple) {
            const nextActive = activeKey === key ? undefined : key;
            setActiveKey(nextActive);
            onCollapse?.(key, nextActive !== undefined);
            return;
        }
        const group = Array.isArray(activeKey) ? [...activeKey] : [];
        const i = group.findIndex((k) => k === key);
        if (i > -1) {
            group.splice(i, 1);
        }
        else {
            key !== undefined && group.push(key);
        }
        setActiveKey(group);
        onCollapse?.(key, i < 0);
    };
    return (jsx("div", { className: classNames("i-collapse", {
            "i-collapse-bordered": border,
        }, className), ...restProps, children: collapses.map((item) => {
            const { key, title, content, disabled, className, ...restProps } = item;
            const isActive = multiple
                ? (activeKey || []).includes(key)
                : activeKey === key;
            return (jsxs("div", { className: classNames("i-collapse-item", className, {
                    "i-collapse-active": isActive,
                    "i-collapse-disabled": disabled,
                }), ...restProps, children: [jsxs("div", { className: 'i-collapse-header', onClick: () => handleHeaderClick(item), children: [title, jsx(Helpericon, { active: true, className: 'i-collapse-toggle', icon: renderToggle(isActive), onClick: (e) => handleToggle(item, e) })] }), jsx("div", { className: 'i-collapse-content', children: content })] }, key));
        }) }));
};
Collapse.Item = Item$5;

function Empty(props) {
    const { className, ...restProps } = props;
    return (jsx(InboxTwotone, { className: classNames("i-empty", className), ...restProps }));
}

function getCellStyle({ justify, col, row, colSpan = 1, rowSpan = 1, }) {
    const style = {
        "--datagrid-justify": justify,
        gridArea: `${row + 1} / ${col + 1} / ${row + 1 + rowSpan} / ${col + 1 + colSpan}`,
        insetInline: `var(--datagrid-cell-inset-${col})`,
    };
    return style;
}
function Cell(props) {
    const { column, row, col, data, cellEllipsis, onCellClick, onCellDoubleClick, } = props;
    const { id, fixed, justify, rowSpan, render } = column;
    const style = getCellStyle({ justify, col, row, rowSpan });
    return (jsx("div", { className: classNames("i-datagrid-cell", {
            [`i-datagrid-cell-fixed-${fixed}`]: fixed,
        }), "data-col": id, style: style, onClick: (e) => onCellClick?.(data, column, row, col, e), onDoubleClick: (e) => onCellDoubleClick?.(data, column, row, col, e), children: render?.(data[id], data, row, col) ?? (jsx("div", { className: classNames("i-datagrid-cell-content", {
                "i-datagrid-cell-content-ellipsis": cellEllipsis,
            }), children: data[id] })) }));
}

function Resize(props) {
    const { index, onWidthChange } = props;
    const state = useReactive({
        resizing: false,
        x: 0,
        width: 0,
    });
    const handleMouseDown = (e) => {
        const tar = e.target;
        const width = tar.offsetParent.offsetWidth;
        Object.assign(state, {
            x: e.pageX,
            resizing: true,
            width,
        });
    };
    const handleMouseMove = (e) => {
        if (!state.resizing)
            return;
        e.preventDefault();
        const after = state.width + e.pageX - state.x;
        if (after <= 24)
            return;
        onWidthChange(index, after);
    };
    const handleMouseUp = () => {
        if (!state.resizing)
            return;
        state.resizing = false;
    };
    useMouseMove(handleMouseMove);
    useMouseUp(handleMouseUp);
    return (jsx("i", { className: 'i-datagrid-resizor', onMouseDown: handleMouseDown, onClick: (e) => e.stopPropagation() }));
}

const Arrow = (props) => (jsx("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', ...props, children: jsx("g", { fill: 'none', children: jsx("path", { d: 'M9 17.898c0 1.074 1.265 1.648 2.073.941l6.31-5.522a1.75 1.75 0 0 0 0-2.634l-6.31-5.522C10.265 4.454 9 5.028 9 6.102v11.796z', fill: 'currentColor' }) }) }));
function Sorter(props) {
    const { type } = props;
    return (jsxs("a", { className: classNames("i-datagrid-sorter", {
            [`i-datagrid-sorter-${type}`]: type,
        }), children: [jsx(Arrow, { className: 'i-datagrid-sorter-caret' }), jsx(Arrow, { className: 'i-datagrid-sorter-caret' })] }));
}

function Row(props) {
    const { row, data, columns, cellEllipsis, onRowClick, onCellClick, onCellDoubleClick, } = props;
    return (jsx("div", { className: 'i-datagrid-row', onClick: () => onRowClick?.(data, row), children: columns.map((col, i) => (jsx(Cell, { column: col, col: i, row: row, data: data, cellEllipsis: cellEllipsis, onCellClick: onCellClick, onCellDoubleClick: onCellDoubleClick }, i))) }));
}
function Header$1(props) {
    const { columns, resizable, cellEllipsis, sortBy, sortType, onWidthChange, onHeaderClick, } = props;
    return (jsx("div", { className: 'i-datagrid-header i-datagrid-row', children: columns.map((column, col) => {
            const { id, title, fixed, colSpan, sorter, justify, renderHeader, } = column;
            const style = getCellStyle({
                justify,
                row: 0,
                col,
                colSpan,
            });
            const order = sortBy === id ? sortType : "";
            return (jsxs("div", { "data-col": id, className: classNames("i-datagrid-cell", {
                    "i-datagrid-has-sorter": sorter,
                    "i-datagrid-cell-fixed": fixed,
                }), style: { ...style, insetBlockStart: 0 }, onClick: (e) => onHeaderClick?.(column, e), children: [renderHeader?.(column, col) ?? (jsx("div", { className: classNames("i-datagrid-cell-content", {
                            "i-datagrid-cell-content-ellipsis": cellEllipsis,
                        }), children: title || id })), sorter && jsx(Sorter, { type: order }), resizable && (jsx(Resize, { index: col, onWidthChange: onWidthChange }))] }, col));
        }) }));
}

const Datagrid = (props) => {
    const { data = [], columns = [], border, striped, header = true, resizable, cellPadding = ".5em", cellEllipsis, empty = jsx(Empty, {}), loading, height = "unset", style, className, renderLoading = () => (jsx(Loading, { size: '1.5em', className: 'color-3', absolute: true })), onCellClick, onRowClick, onCellDoubleClick, onHeaderClick, onSort, onScroll, onResize, } = props;
    const container = useRef(null);
    const state = useReactive({
        rows: data,
        widths: columns.map((col) => col.width ?? "min-content"),
        sortBy: "",
        sortType: "",
    });
    const styles = useMemo(() => {
        const { widths } = state;
        const o = {
            ...style,
            "--grid-template-columns": widths
                .map((w) => {
                return typeof w === "number" ? `${w}px` : w;
            })
                .join(" "),
        };
        if (!resizable)
            return o;
        const fws = columns.map((col, i) => {
            const { fixed } = col;
            if (!fixed)
                return 0;
            return widths[i];
        });
        columns.map((col, i) => {
            const { fixed } = col;
            if (!fixed)
                return;
            if (i === 0) {
                o[`--datagrid-cell-inset-0`] = 0;
            }
            else if (i === fws.length - 1) {
                o[`--datagrid-cell-inset-${fws.length - 1}`] = "auto 0";
            }
            else {
                const isLeft = fixed === "left";
                const before = isLeft ? fws.slice(0, i) : fws.slice(i + 1);
                const sum = before.reduce((pre, cur) => pre + cur) + "px";
                const result = isLeft ? `${sum} auto` : `auto ${sum}`;
                o[`--datagrid-cell-inset-${i}`] = result;
            }
        });
        return o;
    }, [state.widths, resizable]);
    const handleWidthChange = (i, w) => {
        if (!resizable)
            return;
        const [...ws] = state.widths;
        ws[i] = w;
        state.widths = ws;
        onResize?.(columns[i], w);
    };
    const handleHeaderClick = (column, e) => {
        if (column?.sorter) {
            const [sortBy, sortType] = getNextSorter(state.sortBy, state.sortType, column.id);
            Object.assign(state, {
                sortBy,
                sortType,
            });
            onSort?.(sortBy, sortType);
        }
        onHeaderClick?.(column, e);
    };
    const rows = useMemo(() => {
        const { sortBy, sortType } = state;
        if (sortBy && !onSort) {
            const sorter = columns.find((col) => col.id === sortBy)?.sorter;
            const sortFn = typeof sorter === "function"
                ? sorter
                : (a, b) => b[sortBy] - a[sortBy];
            const sorted = [...data].sort(sortFn);
            return sortType === "desc" ? sorted : sorted.reverse();
        }
        return data;
    }, [data, columns, state.sortBy, state.sortType]);
    useEffect(() => {
        if (!container.current)
            return;
        const { current: div } = container;
        const tds = div.querySelector(".i-datagrid-row")?.children;
        if (!tds?.length)
            return;
        state.widths = Array.from(tds).map((node) => node.offsetWidth);
    }, [columns, resizable]);
    useEffect(() => {
        loading && container.current?.scrollTo({ top: 0, left: 0 });
    }, [loading]);
    const mergedStyle = {
        "--cell-padding": cellPadding,
        ...styles,
    };
    return (jsxs("div", { style: { maxHeight: height, ...mergedStyle }, className: classNames("i-datagrid-container", className, {
            "i-datagrid-bordered": border,
            "i-datagrid-striped": striped,
        }), children: [jsxs("div", { ref: container, className: classNames("i-datagrid", {
                    "i-datagrid-loading": loading,
                }), onWheel: onScroll, children: [header && (jsx(Header$1, { columns: columns, resizable: resizable, sortType: state.sortType, sortBy: state.sortBy, cellEllipsis: cellEllipsis, onWidthChange: handleWidthChange, onHeaderClick: handleHeaderClick })), rows.map((row, i) => (jsx(Row, { row: i + (header ? 1 : 0), data: row, cellEllipsis: cellEllipsis, columns: columns, onCellClick: onCellClick, onRowClick: onRowClick, onCellDoubleClick: onCellDoubleClick }, i))), rows.length < 1 && empty] }), loading && renderLoading()] }));
};

const Description = (props) => {
    const { data, colon, columns = 1, gap = ".5em", align, labelWidth, labelAlign, vertical, equally, style, className, } = props;
    return (jsx("div", { className: classNames("i-description", className), style: {
            ["--description-label-width"]: labelWidth,
            gridTemplateColumns: `repeat(${columns}, ${equally ? "1fr" : "auto"})`,
            gap,
            textAlign: align,
            ...style,
        }, children: data.map((item, i) => {
            const { label, value, style, hidden, rowSpan = 1, colSpan = 1, } = item;
            if (hidden)
                return jsx(Fragment$1, {}, i);
            return (jsxs("div", { className: classNames("i-description-item", {
                    "i-description-item-vertical": vertical,
                }), style: {
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                    ...style,
                }, children: [label && (jsxs("div", { className: 'i-description-label', style: { textAlign: labelAlign }, children: [label, colon] })), jsx("div", { className: 'i-description-value', children: value })] }, i));
        }) }));
};

function Drawer(props) {
    const { visible, position = "left", header, footer, backdropClosable = true, hideCloseButton, keepDOM, className, disabledEsc, children, onVisibleChange, onClose, ...restProps } = props;
    const toggable = useRef(true);
    const state = useReactive({
        show: visible,
        active: visible,
    });
    const [isPending, startTransition] = useTransition();
    const handleHide = () => {
        if (!toggable.current || isPending)
            return;
        toggable.current = false;
        startTransition(() => {
            state.active = false;
            setTimeout(() => {
                if (!keepDOM) {
                    state.show = false;
                }
                onVisibleChange?.(false);
                toggable.current = true;
                onClose?.();
            }, 240);
        });
    };
    const handleShow = () => {
        if (!toggable.current || isPending)
            return;
        state.show = true;
        onVisibleChange?.(true);
        toggable.current = false;
        startTransition(() => {
            requestAnimationFrame(() => {
                state.active = true;
                toggable.current = true;
            });
        });
    };
    useEffect(() => {
        visible ? handleShow() : handleHide();
    }, [visible]);
    const handleBackdropClick = () => {
        backdropClosable && handleHide();
    };
    useKeydown((e) => {
        if (e.code !== "Escape" || !visible)
            return;
        handleHide();
    }, {
        disabled: disabledEsc,
    });
    if (!state.show)
        return null;
    return createPortal(jsx("div", { className: classNames("i-backdrop-drawer", className, {
            "i-active": state.active,
        }), onClick: handleBackdropClick, ...restProps, children: jsxs("div", { className: classNames("i-drawer", `i-drawer-${position}`), onClick: (e) => e.stopPropagation(), children: [header && (jsxs("header", { className: 'i-drawer-header', children: [header, !hideCloseButton && (jsx(Helpericon, { className: 'i-drawer-close', onClick: handleHide }))] })), jsx("div", { className: 'i-drawer-content', children: children }), footer && jsx("div", { className: 'i-drawer-footer', children: footer })] }) }), document.body);
}

const Item$4 = (props) => {
    const { ref, active, type, align, disabled, label, style, border, className, children, ...restProps } = props;
    return (jsxs("li", { ref: ref, className: classNames("i-list-item", className, {
            "i-list-item-active": active,
            "i-list-option": type === "option",
            "i-list-item-bordered": border,
            disabled,
        }), style: { alignItems: align, ...style }, ...restProps, children: [label !== undefined && (jsx("span", { className: 'i-list-item-label', children: label })), children] }));
};

const List$1 = (props) => {
    const { label, type, border, className, children, ...restProps } = props;
    return (jsx("ul", { className: classNames("i-list", className), ...restProps, children: Children.map(children, (node, i) => {
            const renderLabel = typeof label === "function" ? label(i) : label;
            const { type, props: nodeProps } = node;
            if (type === Item$4) {
                return cloneElement(node, {
                    label: renderLabel,
                    ...nodeProps,
                    type: props.type,
                    border,
                });
            }
            return node;
        }) }));
};
List$1.Item = Item$4;

const Content$2 = forwardRef((props, ref) => {
    const { arrow, arrowProps = {}, className, children, ...restProps } = props;
    const arrowCSS = useMemo(() => {
        let { left = 0, top = 0, pos } = arrowProps;
        let transform = "";
        switch (pos) {
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
        return {
            left,
            top,
            transform,
        };
    }, [arrowProps]);
    const content = (jsxs("div", { ref: ref, className: classNames("i-popup", className), ...restProps, children: [arrow && (jsx("svg", { xmlns: 'http://www.w3.org/2000/svg', className: 'i-popup-arrow', style: arrowCSS, children: jsx("path", { d: 'M0.5 0L1.5 0C1.5 4, 3 5.5, 5 7.5S8,10 8,12S7 14.5, 5 16.5S1.5,20 1.5,24L0.5 24L0.5 0z' }) })), children] }));
    const container = typeof document === "undefined" ? null : document.body;
    if (!container)
        return null;
    return createPortal(content, container);
});

const REACT_FORWARD_REF = Symbol.for("react.forward_ref");
const REACT_FRAGMENT = Symbol.for("react.fragment");
const canAttachRef = (el) => {
    if (!isValidElement(el))
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
    const { visible = false, content, trigger = "hover", gap = 12, offset = 8, position = "top", showDelay = 16, hideDelay = 12, touchable, arrow = true, align = "center", fitSize, disabled, style, className, children, onVisibleChange, } = props;
    const triggerRef = useRef(null);
    const contentRef = useRef(null);
    const timerRef = useRef(null);
    const afterHideTimerRef = useRef(null);
    const rafRef = useRef(null);
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
    const phaseRef = useRef("");
    const lastPosRef = useRef(null);
    const lastArrowRef = useRef(null);
    const arrowElRef = useRef(null);
    const pointRef = useRef(null);
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
        const [left, top, { arrowX, arrowY, arrowPos }] = getPosition(triggerEl, contentEl, {
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
        const [left, top] = getPointPosition(point, contentEl);
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
    const hideRef = useRef(handleHide);
    const toggleRef = useRef(handleToggle);
    hideRef.current = handleHide;
    toggleRef.current = handleToggle;
    const doHide = useMemo(() => () => hideRef.current(), []);
    const doToggle = useMemo(() => (action) => toggleRef.current(action), []);
    const mergeRefs = useMemo(() => {
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
    const triggerEvents = useMemo(() => {
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
    const triggerNode = useMemo(() => {
        const events = triggerEvents;
        const eventKeys = Object.keys(events);
        const items = Children.toArray(children);
        let attachedRef = false;
        let cloned = false;
        const nextItems = items.map((item) => {
            if (!isValidElement(item))
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
            return cloneElement(item, patchedProps);
        });
        if (!cloned)
            return children;
        return nextItems.length === 1 ? nextItems[0] : jsx(Fragment, { children: nextItems });
    }, [children, triggerEvents, mergeRefs]);
    const contentTouch = useMemo(() => {
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
    const { observe, unobserve, disconnect } = useResizeObserver();
    useEffect(() => {
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
    useLayoutEffect(() => {
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
    useLayoutEffect(() => {
        doToggle(visible);
    }, [visible]);
    useEffect(() => {
        return () => {
            clearAllTimers();
        };
    }, []);
    const mouseUpHandlerRef = useRef(() => { });
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
    const onGlobalMouseUp = useMemo(() => (e) => mouseUpHandlerRef.current(e), []);
    useMouseUp(onGlobalMouseUp);
    useEffect(() => {
        if (!show)
            return;
        if (typeof window === "undefined")
            return;
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
    return (jsxs(Fragment, { children: [triggerNode, show && (jsx(Content$2, { ref: contentRef, arrow: arrow && trigger !== "contextmenu", style: {
                    ...style,
                    position: "fixed",
                }, className: className, ...contentTouch, trigger: triggerRef.current, children: content }))] }));
}

const { Item: ListItem } = List$1;
const Item$3 = (props) => {
    const { more, moreProps, onClick, ...restProps } = props;
    const Li = (jsx(ListItem, { onClick: (e) => {
            e.stopPropagation();
            onClick?.(e);
        }, ...restProps }));
    if (!more)
        return Li;
    return (jsx(Popup, { position: 'right', touchable: true, arrow: false, align: 'start', offset: 10, hideDelay: 240, ...moreProps, content: jsx(List$1, { className: 'i-dropdown-content', onClick: (e) => e.stopPropagation(), children: more }), children: Li }));
};

const Dropdown = (props) => {
    const { visible, width, content, children, ...restProps } = props;
    const [active, setActive] = useState(visible);
    if (!content) {
        return children;
    }
    const handleVisibleChange = (v) => {
        setActive(v);
        if (props.onVisibleChange) {
            props.onVisibleChange(v);
        }
    };
    useEffect(() => {
        setActive(visible);
    }, [visible]);
    return (jsx(Popup, { trigger: 'click', position: 'bottom', content: jsx(List$1, { className: 'i-dropdown-content', style: { minWidth: width }, children: typeof content === "function"
                ? content(() => setActive(false))
                : content }), ...restProps, touchable: true, visible: active, onVisibleChange: handleVisibleChange, children: children }));
};
Dropdown.Item = Item$3;

const exec = (a, b, c) => {
    if (typeof document === "undefined")
        return;
    return document.execCommand(a, b, c);
};
const xssOptions = {
    onIgnoreTagAttr(tag, name, value) {
        if (["class", "contenteditable"].includes(name)) {
            return name + '="' + escapeAttrValue(value) + '"';
        }
        if (["data-", "style"].includes(name.substring(0, 5))) {
            return name + '="' + escapeAttrValue(value) + '"';
        }
    },
};
const handleMouseDown = (e) => {
    e.preventDefault();
};
const fnMap = {
    bold: {
        icon: jsx(FormatBoldRound, {}),
        onClick: () => exec("bold"),
    },
    italic: {
        icon: jsx(FormatItalicRound, {}),
        onClick: () => exec("italic"),
    },
    underline: {
        icon: jsx(FormatUnderlinedRound, {}),
        onClick: () => exec("underline"),
    },
    strike: {
        icon: jsx(StrikethroughSRound, {}),
        onClick: () => exec("strikeThrough"),
    },
    redo: {
        icon: jsx(RedoRound, {}),
        onClick: () => exec("redo"),
    },
    undo: {
        icon: jsx(UndoRound, {}),
        onClick: () => exec("undo"),
    },
    clear: {
        icon: jsx(ClearAllRound, {}),
        onClick: () => exec("removeFormat"),
    },
};
const defaultKeys = [
    "undo",
    "redo",
    "bold",
    "italic",
    "underline",
    "strike",
    "clear",
];
const typedFnMap = fnMap;
function getControls(options) {
    const { controlBtnProps, addtionControls, getSelection } = options;
    const controls = defaultKeys.map((k) => {
        const { icon, onClick } = typedFnMap[k];
        return (jsx(Button, { ...controlBtnProps, onMouseDown: handleMouseDown, onClick: onClick, children: jsx(Icon, { icon: icon }) }, k));
    });
    const extControls = (addtionControls ?? []).map((item, index) => (jsx(Button, { ...controlBtnProps, onMouseDown: handleMouseDown, onClick: (e) => item.onClick?.(getSelection(), e), children: item.icon }, `addtion-${index}`)));
    return [...controls, ...extControls];
}

const MEMTION_TAG_CLASS_NAME = "i-memtion-tag";
const getInsertNode = (memtion, option) => memtion?.insert?.(option) ?? option.value;
const getInsertText = (memtion, option) => {
    const nextNode = getInsertNode(memtion, option);
    if (typeof nextNode === "string" || typeof nextNode === "number") {
        return `${String(nextNode)} `;
    }
    return `${String(option.value)} `;
};
const getInsertHtml = (memtion, option, sanitizeValue) => {
    const nextNode = getInsertNode(memtion, option);
    if (nextNode === null || nextNode === undefined || nextNode === false) {
        return "";
    }
    const content = sanitizeValue(renderToStaticMarkup(jsx(Fragment, { children: nextNode })));
    return `<span class="${MEMTION_TAG_CLASS_NAME}" contenteditable="false" data-memtion-value="${escapeAttrValue(String(option.value))}">${content}</span>`;
};
const getSelectionRect = (range) => {
    if (!range)
        return null;
    const rect = range.getBoundingClientRect();
    if (rect.width || rect.height) {
        return rect;
    }
    return range.getClientRects()[0] ?? rect;
};
const insertMemtionOption = ({ editor, range, mode, memtion, option, sanitizeValue, }) => {
    if (!editor || !range)
        return null;
    const browserSelection = window.getSelection();
    if (!browserSelection)
        return null;
    const nextRange = range.cloneRange();
    browserSelection.removeAllRanges();
    browserSelection.addRange(nextRange);
    editor.focus();
    nextRange.deleteContents();
    if (mode === "plaintext") {
        const text = document.createTextNode(getInsertText(memtion, option));
        nextRange.insertNode(text);
        nextRange.setStartAfter(text);
    }
    else {
        const html = getInsertHtml(memtion, option, sanitizeValue);
        const fragment = nextRange.createContextualFragment(html);
        const lastNode = fragment.lastChild;
        const spacing = document.createTextNode(" ");
        nextRange.insertNode(fragment);
        if (lastNode) {
            nextRange.setStartAfter(lastNode);
            nextRange.collapse(true);
        }
        nextRange.insertNode(spacing);
        nextRange.setStartAfter(spacing);
    }
    nextRange.collapse(true);
    browserSelection.removeAllRanges();
    browserSelection.addRange(nextRange);
    return nextRange;
};
const getMemtionText = (triggerRange, selectionRange) => {
    if (!triggerRange || !selectionRange)
        return "";
    const range = triggerRange.cloneRange();
    range.setEnd(selectionRange.endContainer, selectionRange.endOffset);
    return range.toString();
};
const getMemtionReplaceRange = (triggerRange, selectionRange) => {
    if (!triggerRange || !selectionRange)
        return null;
    const range = triggerRange.cloneRange();
    range.setEnd(selectionRange.endContainer, selectionRange.endOffset);
    return range;
};
const filterMemtionOptions = (options, keyword) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) {
        return options;
    }
    return options.filter((option) => String(option.value).toLowerCase().includes(normalizedKeyword));
};
const isMemtionTag = (node) => node instanceof HTMLElement &&
    node.classList.contains(MEMTION_TAG_CLASS_NAME);
const getAdjacentMemtionTag = (range, direction) => {
    const { startContainer, startOffset } = range;
    if (startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = startContainer;
        if (direction === "backward" && startOffset === 0) {
            return isMemtionTag(textNode.previousSibling)
                ? textNode.previousSibling
                : null;
        }
        if (direction === "forward" && startOffset === textNode.data.length) {
            return isMemtionTag(textNode.nextSibling)
                ? textNode.nextSibling
                : null;
        }
        return null;
    }
    const element = startContainer;
    const targetIndex = direction === "backward" ? startOffset - 1 : startOffset;
    const targetNode = element.childNodes.item(targetIndex);
    return isMemtionTag(targetNode) ? targetNode : null;
};
const removeAdjacentMemtionTag = (editor, key) => {
    if (!editor)
        return false;
    const selection = window.getSelection();
    if (!selection?.rangeCount || !selection.isCollapsed)
        return false;
    const activeRange = selection.getRangeAt(0);
    const tag = getAdjacentMemtionTag(activeRange, key === "Backspace" ? "backward" : "forward");
    if (!tag || !tag.parentNode)
        return false;
    const parent = tag.parentNode;
    const nextSibling = tag.nextSibling;
    const index = Array.prototype.indexOf.call(parent.childNodes, tag);
    if (nextSibling?.nodeType === Node.TEXT_NODE) {
        const textNode = nextSibling;
        if (textNode.data.startsWith(" ")) {
            textNode.deleteData(0, 1);
            if (!textNode.data.length) {
                nextSibling.remove();
            }
        }
    }
    tag.remove();
    const range = document.createRange();
    range.setStart(parent, Math.min(index, parent.childNodes.length));
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    editor.focus();
    return true;
};
const Memtion = (props) => {
    const { visible, rect, options, activeIndex, onActiveChange, onSelect } = props;
    if (!visible || !rect || !options?.length) {
        return null;
    }
    return (jsx(List$1, { className: "i-editor-memtion", type: "option", style: {
            position: "fixed",
            top: rect.bottom,
            left: rect.left,
        }, children: options.map((option, i) => (jsx(List$1.Item, { type: "option", active: i === activeIndex, onMouseDown: (e) => e.preventDefault(), onMouseEnter: () => onActiveChange?.(i), onClick: () => onSelect?.(option), children: option.label }, `${option.value}-${i}`))) }));
};
var Memtion$1 = memo(Memtion);

const controlBtnProps = {
    square: true,
    flat: true,
    size: "small",
};
const Editor = (props) => {
    const { ref, value = "", width, height = "10em", placeholder, autosize, border = true, mode = "rich", hideControl, addtionControls, memtion, className, style, onChange, onEnter, onFocus, onBlur, onPaste, onMouseUp, onKeyUp, onKeyDown, ...restProps } = props;
    const editorRef = useRef(null);
    const selectionRef = useRef(null);
    const memtionTriggerRangeRef = useRef(null);
    const pendingMemtionRef = useRef(false);
    const [memtionVisible, setMemtionVisible] = useState(false);
    const [memtionRect, setMemtionRect] = useState(null);
    const [memtionKeyword, setMemtionKeyword] = useState("");
    const [memtionActiveIndex, setMemtionActiveIndex] = useState(0);
    const memtionOptions = useMemo(() => filterMemtionOptions(memtion?.options ?? [], memtionKeyword), [memtion?.options, memtionKeyword]);
    const sanitizeValue = (nextValue) => {
        if (mode === "plaintext") {
            return nextValue === "\n" ? "" : nextValue;
        }
        const safeHtml = xss(nextValue, xssOptions);
        return safeHtml === "<br>" ? "" : safeHtml;
    };
    const rememberSelection = () => {
        if (!editorRef.current)
            return;
        const selection = window.getSelection();
        if (!selection?.rangeCount)
            return;
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const parent = container.nodeType === Node.ELEMENT_NODE
            ? container
            : container.parentElement;
        if (!parent || !editorRef.current.contains(parent))
            return;
        selectionRef.current = range.cloneRange();
    };
    const setEditorValue = (nextValue) => {
        if (!editorRef.current)
            return;
        const safeValue = sanitizeValue(nextValue);
        if (mode === "plaintext") {
            editorRef.current.textContent = safeValue;
            return;
        }
        editorRef.current.innerHTML = safeValue;
    };
    const getEditorValue = (sanitize = false) => {
        if (!editorRef.current)
            return "";
        const nextValue = mode === "plaintext"
            ? (editorRef.current.textContent ?? "")
            : editorRef.current.innerHTML;
        return sanitize ? sanitizeValue(nextValue) : nextValue;
    };
    const hideMemtion = () => {
        pendingMemtionRef.current = false;
        memtionTriggerRangeRef.current = null;
        setMemtionVisible(false);
        setMemtionRect(null);
        setMemtionKeyword("");
        setMemtionActiveIndex(0);
    };
    const insertMemtion = (option) => {
        const replaceRange = getMemtionReplaceRange(memtionTriggerRangeRef.current, selectionRef.current);
        const range = insertMemtionOption({
            editor: editorRef.current,
            range: replaceRange,
            mode,
            memtion,
            option,
            sanitizeValue,
        });
        if (!range || !editorRef.current)
            return;
        selectionRef.current = range.cloneRange();
        hideMemtion();
        editorRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const handlePaste = (e) => {
        onPaste?.(e);
        if (e.defaultPrevented)
            return;
        e.preventDefault();
        if (mode === "plaintext") {
            const text = e.clipboardData.getData("text/plain");
            exec("insertText", false, text);
            return;
        }
        const html = e.clipboardData.getData("text/html");
        if (html) {
            exec("insertHTML", false, sanitizeValue(html));
            return;
        }
        const text = e.clipboardData.getData("text/plain");
        exec("insertText", false, text);
    };
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        if (mode === "rich" &&
            (e.key === "Backspace" || e.key === "Delete") &&
            removeAdjacentMemtionTag(editorRef.current, e.key)) {
            e.preventDefault();
            rememberSelection();
            editorRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
            return;
        }
        const memtionKey = memtion?.key ?? "@";
        if (memtionVisible && e.key === " ") {
            hideMemtion();
        }
        if (memtionVisible && memtionOptions.length) {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setMemtionActiveIndex((index) => index + 1 >= memtionOptions.length ? 0 : index + 1);
                    return;
                case "ArrowUp":
                    e.preventDefault();
                    setMemtionActiveIndex((index) => index - 1 < 0 ? memtionOptions.length - 1 : index - 1);
                    return;
                case "Enter":
                    e.preventDefault();
                    insertMemtion(memtionOptions[memtionActiveIndex]);
                    return;
            }
        }
        if (memtion && e.key === memtionKey) {
            rememberSelection();
            memtionTriggerRangeRef.current =
                selectionRef.current?.cloneRange() ?? null;
            pendingMemtionRef.current = true;
        }
        switch (e.key) {
            case "Tab":
                e.preventDefault();
                exec(mode === "plaintext" ? "insertText" : "insertHTML", false, mode === "plaintext" ? "\t" : "&#09;");
                break;
            case "Enter":
                if (!onEnter)
                    break;
                e.preventDefault();
                onEnter(e);
                break;
        }
    };
    useEffect(() => {
        if (!editorRef.current)
            return;
        const nextValue = sanitizeValue(value);
        if (getEditorValue(true) === nextValue)
            return;
        setEditorValue(nextValue);
        if (autosize) {
            editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
        }
    }, [autosize, mode, value]);
    useEffect(() => {
        if (!memtionOptions.length) {
            setMemtionActiveIndex(0);
            return;
        }
        setMemtionActiveIndex((index) => index >= memtionOptions.length ? 0 : index);
    }, [memtionOptions]);
    const handleInput = (e) => {
        const rawValue = getEditorValue();
        let nextValue = sanitizeValue(rawValue);
        if (!nextValue && rawValue && editorRef.current) {
            nextValue = "";
            setEditorValue(nextValue);
        }
        rememberSelection();
        if (memtion && (pendingMemtionRef.current || memtionVisible)) {
            const memtionKey = memtion?.key ?? "@";
            const memtionText = getMemtionText(memtionTriggerRangeRef.current, selectionRef.current);
            if (!memtionText.startsWith(memtionKey) || /\s/.test(memtionText)) {
                hideMemtion();
            }
            else {
                const keyword = memtionText.slice(memtionKey.length);
                pendingMemtionRef.current = false;
                setMemtionRect(getSelectionRect(selectionRef.current));
                setMemtionKeyword(keyword);
                setMemtionActiveIndex(0);
                setMemtionVisible(true);
            }
        }
        if (autosize && editorRef.current) {
            editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
        }
        onChange?.(nextValue, e);
    };
    const handleFocus = (e) => {
        rememberSelection();
        onFocus?.(e);
    };
    const handleBlur = (e) => {
        hideMemtion();
        onBlur?.(e);
    };
    const handleMouseUp = (e) => {
        rememberSelection();
        onMouseUp?.(e);
    };
    const handleKeyUp = (e) => {
        rememberSelection();
        onKeyUp?.(e);
    };
    const handleRef = (node) => {
        editorRef.current = node;
        if (typeof ref === "function") {
            ref(node);
            return;
        }
        if (ref) {
            ref.current = node;
        }
    };
    const getSelection = useCallback(() => selectionRef.current?.cloneRange() ?? null, []);
    const controls = useMemo(() => getControls({
        controlBtnProps,
        addtionControls,
        getSelection,
    }), [addtionControls, getSelection]);
    return (jsxs("div", { className: classNames("i-editor", className, {
            "i-editor-borderless": !border,
        }), style: {
            ...style,
            [autosize ? "minHeight" : "height"]: height,
            width,
        }, children: [!hideControl && (jsx("div", { className: "i-editor-controls", children: controls })), memtion && (jsx(Memtion$1, { visible: memtionVisible, rect: memtionRect, options: memtionOptions, activeIndex: memtionActiveIndex, onActiveChange: setMemtionActiveIndex, onSelect: insertMemtion })), jsx("div", { ref: handleRef, className: "i-editor-content", "data-placeholder": placeholder, contentEditable: mode === "plaintext" ? "plaintext-only" : true, onFocus: handleFocus, onBlur: handleBlur, onMouseUp: handleMouseUp, onPaste: handlePaste, onInput: handleInput, onKeyUp: handleKeyUp, onKeyDown: handleKeyDown, ...restProps })] }));
};

const Flex = (props) => {
    const { as: Component = "div", align, justify, direction, wrap, gap, columns, className, style, ...restProps } = props;
    const gridColumns = useMemo(() => {
        if (!columns)
            return;
        if (typeof columns === "number")
            return `repeat(${columns}, 1fr)`;
        return columns;
    }, [columns]);
    return (jsx(Component, { ...restProps, style: {
            alignItems: align,
            justifyContent: justify,
            gap,
            flexDirection: direction,
            flexWrap: wrap === true ? "wrap" : wrap,
            gridTemplateColumns: gridColumns,
            ...style,
        }, className: classNames(className, {
            [columns ? "grid" : "flex"]: true,
        }) }));
};

const Context = createContext({});

function Field(props) {
    const { name, required, children } = props;
    const [fieldValue, setFieldValue] = useState(undefined);
    const [fieldStatus, setFieldStatus] = useState("normal");
    const [fieldMessage, setFieldMessage] = useState(undefined);
    const form = useContext(Context);
    const { id } = form;
    const handleChange = (v) => {
        if (!name)
            return;
        form.set(name, v);
        PubSub.publish(`${id}:change`, {
            name,
            value: v,
        });
    };
    const hijackChildren = useMemo(() => {
        return Children.map(children, (node) => {
            if (!isValidElement(node))
                return null;
            const { onChange } = node.props;
            return cloneElement(node, {
                value: fieldValue,
                status: fieldStatus,
                message: fieldMessage,
                required,
                onChange: (...args) => {
                    handleChange(args[0]);
                    onChange?.(...args);
                    setFieldStatus("normal");
                    setFieldMessage(undefined);
                },
            });
        });
    }, [children, fieldValue, fieldStatus, fieldMessage, required]);
    useEffect(() => {
        if (!name)
            return;
        PubSub.subscribe(`${id}:set:${name}`, (evt, v) => {
            setFieldValue(v);
        });
        PubSub.subscribe(`${id}:invalid:${name}`, (evt, v) => {
            if (v?.value !== undefined)
                setFieldValue(v.value);
            if (v?.status)
                setFieldStatus(v.status);
            if ("message" in (v ?? {}))
                setFieldMessage(v.message);
        });
        Promise.resolve().then(() => {
            form.set(name, form.cacheData[name] ?? undefined);
        });
        return () => {
            PubSub.unsubscribe(`${id}:set:${name}`);
            PubSub.unsubscribe(`${id}:invalid:${name}`);
            form.delete(name);
        };
    }, [name, children]);
    if (!name)
        return children;
    return hijackChildren;
}

class IFormInstance {
    id;
    data = {};
    cacheData = {};
    rules = {};
    constructor() {
        this.id = uid(8);
        this.data = {};
    }
    get(field) {
        return field ? this.data[field] : this.data;
    }
    set(field, value) {
        const id = this.id;
        if (!this.data)
            return;
        if (typeof field === "string") {
            this.data[field] = value;
            this.cacheData[field] = value;
            PubSub.publish(`${id}:set:${field}`, value);
            return;
        }
        Object.keys(field).map((name) => {
            this.data[name] = field[name];
            this.cacheData[name] = field[name];
            PubSub.publish(`${id}:set:${name}`, field[name]);
        });
    }
    delete(field) {
        delete this.data[field];
    }
    clear() {
        if (!this.data)
            return;
        this.cacheData = {};
        Object.keys(this.data).map((name) => {
            PubSub.publish(`${this.id}:set:${name}`, undefined);
            this.data[name] = undefined;
        });
    }
    async validate(field) {
        const { id, rules, data } = this;
        if (!rules)
            return data;
        if (field) {
            const o = rules[field];
            const rule = {
                validator: (v) => Array.isArray(v)
                    ? v.length > 0
                    : ![undefined, null, ""].includes(v),
                message: undefined,
            };
            if (typeof o === "function") {
                rule.validator = o;
            }
            else if (o === true) {
                rule.validator = (v) => ![undefined, null, ""].includes(v);
                rule.message = "required";
            }
            else {
                Object.assign(rule, o);
            }
            const isValid = rule.validator?.(data[field], this);
            if (typeof isValid === "string") {
                rule.message = isValid;
            }
            if (isValid !== true) {
                PubSub.publish(`${id}:invalid:${field}`, {
                    message: rule.message,
                    status: "error",
                });
                return false;
            }
            PubSub.publish(`${id}:invalid:${name}`, {
                message: null,
                status: "normal",
            });
            return true;
        }
        let isAllValid = true;
        Object.keys(data).map((name) => {
            const o = rules[name];
            if (o === undefined)
                return;
            const rule = {
                validator: (v) => (Array.isArray(v) ? v.length > 0 : !!v),
                message: undefined,
            };
            if (typeof o === "function") {
                rule.validator = o;
            }
            else if (o === true) {
                rule.validator = (v) => ![undefined, null, ""].includes(v);
                rule.message = "required";
            }
            else {
                Object.assign(rule, o);
            }
            const isValid = rule.validator?.(data[name], this);
            if (typeof isValid === "string") {
                rule.message = isValid;
            }
            if (isValid !== true) {
                PubSub.publish(`${id}:invalid:${name}`, {
                    message: rule.message,
                    status: "error",
                });
                isAllValid = false;
            }
            else {
                PubSub.publish(`${id}:invalid:${name}`, {
                    message: null,
                    status: "normal",
                });
            }
        });
        return isAllValid ? Promise.resolve(data) : false;
    }
}
function useForm(form) {
    const formRef = useRef(null);
    if (!formRef.current) {
        formRef.current = form ?? new IFormInstance();
    }
    return formRef.current;
}

function useConfig(configs, formProps) {
    const form = useForm();
    const { onChange } = formProps ?? {};
    const [values, setValues] = useState({});
    const handleChange = (name, value) => {
        setValues(() => ({ ...form.get() }));
        onChange?.(name, value);
    };
    const node = useMemo(() => {
        return (jsx(Form, { ...formProps, onChange: handleChange, form: form, children: configs.map((config) => {
                const { name, label, required, component: El, componentProps = {}, colspan = 1, render, shouldUpdate, shouldRender, } = config;
                const { className, style } = componentProps;
                if (shouldRender && !shouldRender(values, form)) {
                    return jsx(Fragment$1, {}, name);
                }
                return (jsx(Field, { name: name, required: required, children: render?.(config, values) ?? (jsx(El, { label: label, required: required, ...componentProps, className: `${className ?? ""} ${colspan !== 1
                            ? `colspan-${colspan}`
                            : ""}` })) }, name));
            }) }));
    }, [configs, values]);
    return {
        form,
        node,
    };
}

const Form = (props) => {
    const { form = {}, rules, initialValues, style, className, width, columns, itemMaxWidth, gap = "1em", labelInline, labelWidth, labelRight, children, onKeyDown, onEnter, onChange, ...restProps } = props;
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        if (e.keyCode !== 13)
            return;
        onEnter?.(e, form.data, form);
    };
    const gridColumns = useMemo(() => {
        if (!columns && !itemMaxWidth)
            return;
        if (itemMaxWidth) {
            return `repeat(auto-fill, minmax(${itemMaxWidth}, 1fr))`;
        }
        if (typeof columns === "number") {
            return `minmax(0, 1fr) `.repeat(columns);
        }
        return columns;
    }, [columns]);
    useEffect(() => {
        Object.assign(form, {
            data: { ...initialValues },
            rules,
        });
    }, [form]);
    useEffect(() => {
        PubSub.subscribe(`${form.id}:change`, (evt, v) => {
            onChange?.(v.name, v.value);
        });
        return () => {
            PubSub.unsubscribe(`${form.id}:change`);
        };
    }, []);
    return (jsx(Context, { value: form, children: jsx("form", { style: {
                ...style,
                width,
                gap,
                gridTemplateColumns: gridColumns,
                "--label-width": labelWidth,
                "--label-align": labelRight ? "right" : undefined,
            }, className: classNames("i-form", className, {
                "i-form-inline": labelInline,
            }), onKeyDown: handleKeyDown, ...restProps, children: children }) }));
};
Form.useForm = useForm;
Form.Field = Field;
Form.useConfig = useConfig;

function Content$1(props) {
    const { title, footer, hideCloseButton, footerLeft, okButtonProps, cancelButtonProps, children, onOk, onClose, } = props;
    const showHeader = title || !hideCloseButton;
    const handleOk = async () => {
        const ret = await onOk?.();
        if (ret === false)
            return;
        onClose?.();
    };
    const renderFooter = useMemo(() => {
        if (footer || footer === null)
            return footer;
        const propsOk = Object.assign({
            children: "确定",
            onClick: handleOk,
        }, okButtonProps);
        const propsCancel = Object.assign({
            secondary: true,
            children: "关闭",
            onClick: onClose,
        }, cancelButtonProps);
        return (jsxs(Fragment, { children: [footerLeft, jsx(Button, { ...propsOk }), jsx(Button, { ...propsCancel })] }));
    }, [footer, okButtonProps, cancelButtonProps]);
    return (jsxs(Fragment, { children: [showHeader && (jsxs("header", { className: 'i-modal-header', children: [title && jsx("b", { children: title }), jsx(Helpericon, { active: !hideCloseButton, className: 'i-modal-close', onClick: onClose })] })), jsx("div", { className: 'i-modal-content', children: children }), jsx("footer", { className: 'i-modal-footer', children: renderFooter })] }));
}

const ModalContext = createContext(false);

function useModal() {
    const ref = useRef(null);
    const handleOpen = (props) => {
        const unMount = renderNode(jsx(HookModal, { ref: ref, visible: true, ...props, onClose: () => {
                props.onClose?.();
                unMount?.();
            } }));
    };
    const handleUpdate = (props) => {
        if (!ref.current)
            return;
        const { update } = ref.current;
        update(props);
    };
    const handleClose = () => {
        if (!ref.current)
            return;
        const { close } = ref.current;
        close();
    };
    return {
        open: handleOpen,
        update: handleUpdate,
        close: handleClose,
    };
}

function Modal(props) {
    const { visible, title, footer, okButtonProps, cancelButtonProps, closable = true, hideBackdrop, backdropClosable = true, hideCloseButton, disableEsc, width, height, customized, fixed, hideShadow, children, style, className, keepDOM, footerLeft, onClick, onVisibleChange, onClose, onOk, ...restProps } = props;
    const [show, setShow] = useState(visible);
    const [active, setActive] = useState(false);
    const [bounced, setBounced] = useState(false);
    const [mounted, setMounted] = useState(false);
    const toggable = useRef(true);
    const handleShow = async () => {
        if (!toggable.current)
            return;
        (!keepDOM || !show) && setShow(true);
        toggable.current = false;
        const timer = setTimeout(() => {
            setActive(true);
            onVisibleChange?.(true);
            toggable.current = true;
        }, 64);
        return () => clearTimeout(timer);
    };
    const handleHide = () => {
        if (!toggable.current)
            return;
        toggable.current = false;
        if (!closable) {
            setBounced(true);
            const timer = setTimeout(() => {
                setBounced(false);
                toggable.current = true;
            }, 400);
            return () => clearTimeout(timer);
        }
        setActive(false);
        const timer = setTimeout(() => {
            !keepDOM && setShow(false);
            toggable.current = true;
            onVisibleChange?.(false);
            onClose?.();
        }, 240);
        return () => clearTimeout(timer);
    };
    const handleBackdropClick = () => {
        backdropClosable && handleHide();
    };
    useKeydown((e) => {
        if (e.code !== "Escape" || !visible)
            return;
        handleHide();
    }, { disabled: disableEsc });
    useEffect(() => {
        visible ? handleShow() : handleHide();
    }, [visible]);
    useEffect(() => {
        setMounted(true);
    }, []);
    const handleClick = () => {
        if (typeof document === "undefined")
            return;
        document.documentElement.click();
    };
    if (!show || !mounted)
        return null;
    return createPortal(jsx("div", { className: classNames("i-modal-container", {
            "i-modal-backdrop": !hideBackdrop,
            "i-modal-customized": customized,
            "i-modal-active": active,
            fixed,
        }, className), style: style, onClick: handleBackdropClick, "aria-modal": 'true', inert: !active, children: jsx("div", { className: classNames("i-modal", {
                bounced,
                shadow: !hideShadow,
            }), style: {
                width,
                height,
            }, onClick: (e) => {
                e.stopPropagation();
                handleClick();
                onClick?.(e);
            }, role: 'dialog', "aria-labelledby": title ? "modal-title" : undefined, ...restProps, children: jsxs(ModalContext.Provider, { value: true, children: [customized && children, !customized && (jsx(Content$1, { title: title, hideCloseButton: hideCloseButton, footer: footer, okButtonProps: okButtonProps, cancelButtonProps: cancelButtonProps, children: children, footerLeft: footerLeft, onOk: onOk, onClose: handleHide }))] }) }) }), document?.body ?? null);
}
Modal.useModal = useModal;

const HookModal = (props) => {
    const { ref, ...restProps } = props;
    const state = useReactive({});
    const mergedProps = Object.assign({}, restProps, state);
    useImperativeHandle(ref, () => ({
        update: (config = {}) => {
            Object.assign(state, config);
        },
        close: () => {
            state.visible = false;
            if (mergedProps.closable ?? true)
                return;
            Promise.resolve().then(() => {
                state.visible = true;
            });
        },
    }));
    return jsx(Modal, { ...mergedProps });
};

function HighLight(props) {
    const { keyword, text, escape, caseSensitive, renderWord = (word) => jsx("mark", { children: word }), ...restProps } = props;
    const content = useMemo(() => {
        const source = text;
        const searchWords = typeof keyword === "string" ? [keyword] : keyword;
        const chunks = findAll({
            searchWords,
            textToHighlight: text,
            caseSensitive,
            autoEscape: escape,
        });
        const result = chunks.map((chunk, i) => {
            const { end, highlight, start } = chunk;
            const word = source.slice(start, end);
            return highlight ? (jsx(Fragment$1, { children: renderWord(word) }, i)) : (word);
        });
        return result;
    }, [keyword, text, escape, caseSensitive]);
    return jsx(Text, { ...restProps, children: content });
}

function Number$3(props) {
    const { count, to, decimal, thousand = ",", duration = 2400, easing, ...restProps } = props;
    const [n, setN] = useState(count);
    const number = useMemo(() => {
        if (n === undefined)
            return;
        const z = n.toFixed(decimal);
        if (!thousand)
            return z;
        return formatNumber(n, { precision: decimal, thousand });
    }, [n, thousand]);
    useEffect(() => {
        if (count === undefined || to === undefined)
            return;
        animate(count, to, duration, (v) => setN(count + v), easing);
    }, [to]);
    useEffect(() => setN(count), [count]);
    return jsx(Text, { ...restProps, children: number });
}

function Number$2(props) {
    const { seconds, zero, units, ...restProps } = props;
    const text = useMemo(() => {
        if (seconds === undefined)
            return "";
        return formatTime(seconds, {
            zero,
            units,
        });
    }, [seconds]);
    return jsx(Text, { ...restProps, children: text });
}

const Text = (props) => {
    const { as: Tag = "span", size, weight, decoration, gradient, wave, style, className, children, } = props;
    const gradients = useMemo(() => {
        if (!gradient || !Array.isArray(gradient))
            return {};
        return {
            backgroundImage: `-webkit-linear-gradient(${gradient.join(",")})`,
            backgroundClip: "text",
        };
    }, [gradient]);
    return (jsx(Tag, { style: {
            fontSize: size,
            fontWeight: weight,
            textDecoration: decoration,
            ...gradients,
            ...style,
        }, className: classNames(className, {
            "i-text-gradient": gradient,
            "i-text-gradient-wave": wave,
        }), children: children }));
};
Text.Number = Number$3;
Text.Time = Number$2;
Text.HighLight = HighLight;

function Circle(props) {
    const { value, circleSize = 40, lineWidth = 8 } = props;
    return (jsxs("div", { className: 'i-progress-circle', children: [jsxs("svg", { width: circleSize, height: circleSize, children: [jsx("circle", { cx: circleSize / 2, cy: circleSize / 2, r: circleSize / 2 - lineWidth / 2, fill: 'none', stroke: 'var(--background-opacity-2)', strokeWidth: lineWidth }), jsx("circle", { cx: circleSize / 2, cy: circleSize / 2, r: circleSize / 2 - lineWidth / 2, fill: 'none', stroke: 'var(--color-main)', strokeWidth: lineWidth, strokeDasharray: 100, pathLength: 100, className: 'i-progress-circle-path', strokeLinecap: 'round', style: {
                            strokeDashoffset: `calc(100 - ${value})`,
                        } })] }), jsxs("span", { className: 'i-progress-circle-value', children: [jsx("span", { children: value }), jsx(Text, { size: '.81em', className: 'color-7', children: "%" })] })] }));
}

const Line = (props) => {
    const { ref, value, lineWidth, vertical, barClass, dragging, renderCursor, onMouseDown, onTouchStart, } = props;
    return (jsx("div", { ref: ref, className: classNames("i-progress", {
            "i-progress-vertical": vertical,
        }), style: { [vertical ? "width" : "height"]: lineWidth }, onMouseDown: onMouseDown, onTouchStart: onTouchStart, children: jsx("div", { className: classNames("i-progress-bar", barClass, {
                "no-transition": dragging,
            }), style: { [vertical ? "height" : "width"]: `${value}%` }, children: renderCursor && (jsx("a", { className: 'i-progress-cursor', children: renderCursor(value ?? 0) })) }) }));
};

const Progress = (props) => {
    const { value = 0, lineWidth = 8, circleSize = 40, precision = 0, style, draggable = true, type = "line", barClass, vertical, label, labelInline, className, renderCursor, onChange, onDraggingChange, } = props;
    const ref = useRef(null);
    const state = useReactive({
        value,
        dragging: false,
        size: 0,
        start: 0,
    });
    const pageXY = vertical ? "pageY" : "pageX";
    const rectTL = vertical ? "top" : "left";
    const rectWH = vertical ? "height" : "width";
    const getFixedValue = () => {
        let value = +state.value.toFixed(precision);
        value = Math.min(100, value);
        value = Math.max(0, value);
        return value;
    };
    const handleMouseDown = (e) => {
        if (!ref.current || !draggable)
            return;
        if (e.touches) {
            e = e.touches[0];
        }
        const rect = ref.current.getBoundingClientRect();
        const value = ((e[pageXY] - rect[rectTL]) * 100) / rect[rectWH];
        Object.assign(state, {
            value: vertical ? 100 - value : value,
            size: rect[rectWH],
            start: rect[rectTL],
            dragging: true,
        });
        onDraggingChange?.(true);
    };
    const handleMouseMove = (e) => {
        if (!state.dragging || !draggable)
            return;
        e.preventDefault();
        if (e.touches) {
            e = e.touches[0];
        }
        const { start, size } = state;
        const offset = e[pageXY] - start;
        if (offset < 0 || offset > size)
            return;
        const value = ((e[pageXY] - start) * 100) / size;
        state.value = vertical ? 100 - value : value;
    };
    const handleMouseUp = () => {
        if (!state.dragging || !draggable)
            return;
        onChange?.(getFixedValue());
        state.dragging = false;
        onDraggingChange?.(false);
    };
    useMouseMove(handleMouseMove);
    useMouseUp(handleMouseUp);
    useEffect(() => {
        if (value > 100) {
            state.value = 100;
            return;
        }
        if (value < 0) {
            state.value = 0;
            return;
        }
        state.value = value;
    }, [value]);
    return (jsxs("div", { className: classNames("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && jsx("span", { className: 'i-input-label-text', children: label }), type === "line" && (jsx(Line, { ref: ref, vertical: vertical, lineWidth: lineWidth, barClass: barClass, dragging: state.dragging, value: state.value, renderCursor: renderCursor, onMouseDown: handleMouseDown, onTouchStart: handleMouseDown })), type === "circle" && (jsx(Circle, { value: state.value, circleSize: circleSize, lineWidth: lineWidth }))] }));
};

const Video = (props) => {
    const { ref, style, hideControls, autoplay, muted, volume = 50, height, width, useOriginControls, timeProgressProps = {
        barClass: "bg-blue",
    }, volumeProgressProps = {
        barClass: "bg-blue",
    }, className, onFullScreenChange, ...restProps } = props;
    const state = useReactive({
        playing: autoplay,
        volume: muted ? 0 : volume,
        volumeCache: 0,
        muted,
        current: 0,
        duration: 0,
        isFullscreen: false,
        controlHidden: true,
        draggingProgress: false,
    });
    const videoRef = useRef(null);
    const hiddenTO = useRef(null);
    const timeUpdateListener = (e) => {
        const tar = e.target;
        if (tar.paused || state.draggingProgress)
            return;
        Object.assign(state, {
            current: tar.currentTime,
        });
    };
    const playChangeListener = (e) => {
        state.playing = !e.target.paused;
    };
    const fsChangeListener = () => {
        if (typeof document === "undefined")
            return;
        const tar = videoRef.current?.parentElement;
        if (!tar)
            return;
        state.isFullscreen = document.fullscreenElement === tar;
    };
    const volumeChangeListener = (e) => {
        const tar = e.target;
        Object.assign(state, {
            volume: tar.volume * 100,
            muted: tar.volume === 0,
        });
    };
    const handlePlay = () => {
        const v = videoRef.current;
        if (!v)
            return;
        v.paused ? v.play() : v.pause();
    };
    const handleReady = (e) => {
        const tar = e.target;
        Object.assign(state, {
            duration: tar.duration,
            current: tar.currentTime,
        });
        tar.volume = state.volume / 100;
    };
    const handleMuted = () => {
        const v = videoRef.current;
        if (!v)
            return;
        if (v.volume > 0) {
            state.volumeCache = v.volume;
            v.volume = 0;
            return;
        }
        v.volume = state.volumeCache === 0 ? 0.5 : state.volumeCache;
    };
    const handleStop = () => {
        const v = videoRef.current;
        if (!v)
            return;
        v.currentTime = 0;
        v.pause();
    };
    const handleFullscreen = () => {
        const tar = videoRef.current?.parentElement;
        if (!tar)
            return;
        state.isFullscreen ? exitFullScreen() : fullScreen(tar);
        onFullScreenChange?.(!state.isFullscreen);
    };
    const handleUpdateTime = (t) => {
        const v = videoRef.current;
        if (!v)
            return;
        v.currentTime = (state.duration * t) / 100;
    };
    const handleUpdateVolume = (t) => {
        const v = videoRef.current;
        if (!v)
            return;
        v.volume = t / 100;
    };
    const showControls = !hideControls && !useOriginControls;
    const clearHiddenTO = () => {
        if (!hiddenTO.current)
            return;
        clearTimeout(hiddenTO.current);
        hiddenTO.current = null;
    };
    const setHiddenFalse = () => {
        if (!showControls || !state.controlHidden)
            return;
        state.controlHidden = false;
        clearHiddenTO();
        hiddenTO.current = setTimeout(() => {
            state.controlHidden = true;
        }, 1000);
    };
    const handleDraggingProgress = (dragging) => {
        state.draggingProgress = dragging;
    };
    const handleMouseMove = throttle({ interval: 900 }, setHiddenFalse);
    useImperativeHandle(ref, () => ({
        play: () => {
            const v = videoRef.current;
            if (!v)
                return;
            v.play();
        },
        pause: () => {
            const v = videoRef.current;
            if (!v)
                return;
            v.pause();
        },
        stop: handleStop,
        fullscreen: handleFullscreen,
        getVideo: () => videoRef.current,
    }));
    useEffect(() => {
        if (typeof document === "undefined")
            return;
        const v = videoRef.current;
        if (!v)
            return;
        v.addEventListener("timeupdate", timeUpdateListener);
        v.addEventListener("play", playChangeListener);
        v.addEventListener("pause", playChangeListener);
        v.addEventListener("volumechange", volumeChangeListener);
        document.addEventListener("fullscreenchange", fsChangeListener);
        return () => {
            clearHiddenTO();
            v.removeEventListener("timeupdate", timeUpdateListener);
            v.removeEventListener("play", playChangeListener);
            v.removeEventListener("pause", playChangeListener);
            v.removeEventListener("volumechange", volumeChangeListener);
            document.removeEventListener("fullscreenchange", fsChangeListener);
        };
    }, []);
    const currentValue = (state.current / state.duration) * 100;
    return (jsxs("div", { className: classNames("i-video", className), style: { height, width, ...style }, onClick: handlePlay, onDoubleClick: () => handleFullscreen(), onMouseMove: handleMouseMove, children: [jsx("video", { ref: videoRef, onCanPlay: handleReady, ...restProps, controls: useOriginControls }), showControls && (jsxs("div", { className: classNames("i-video-controls", {
                    "i-video-controls-hidden": state.controlHidden,
                }), onClick: (e) => e.stopPropagation(), children: [jsx(Button.Toggle, { className: 'i-video-btn', flat: true, square: true, after: jsx(Icon, { icon: jsx(PauseRound, {}) }), active: state.playing, onClick: handlePlay, children: jsx(Icon, { icon: jsx(PlayArrowRound, {}) }) }), jsx(Button, { className: 'i-video-btn', flat: true, square: true, onClick: handleStop, children: jsx(Icon, { icon: jsx(StopRound, {}) }) }), jsxs("span", { className: 'i-video-times font-sm', children: [jsx(Text.Time, { seconds: state.current }), " /", jsx(Text.Time, { seconds: state.duration })] }), jsx(Progress, { ...timeProgressProps, value: currentValue, onChange: handleUpdateTime, onDraggingChange: handleDraggingProgress }), jsxs("div", { className: 'i-video-control-volume', children: [jsx(Button.Toggle, { className: 'i-video-btn', flat: true, square: true, active: state.volume <= 0, after: jsx(Icon, { icon: jsx(VolumeOffRound, {}), style: { padding: ".125em" } }), onClick: handleMuted, children: jsx(Icon, { icon: jsx(VolumeDownRound, {}) }) }), jsx("div", { className: 'i-video-volume', children: jsx(Progress, { style: { height: 100 }, vertical: true, ...volumeProgressProps, value: state.volume, onChange: handleUpdateVolume }) })] }), jsx(Button.Toggle, { className: 'i-video-btn', flat: true, square: true, after: jsx(Icon, { icon: jsx(FullscreenExitRound, {}) }), active: state.isFullscreen, onClick: () => handleFullscreen(), children: jsx(Icon, { icon: jsx(FullscreenRound, {}) }) })] }))] }));
};

var TFileType;
(function (TFileType) {
    TFileType["IMAGE"] = "IMAGE";
    TFileType["VIDEO"] = "VIDEO";
    TFileType["AUDIO"] = "AUDIO";
    TFileType["PDF"] = "PDF";
    TFileType["EXCEL"] = "EXCEL";
    TFileType["TXT"] = "TXT";
    TFileType["UNKNOWN"] = "UNKNOWN";
})(TFileType || (TFileType = {}));

function renderFile(props) {
    const { name, suffix, type } = props;
    switch (type) {
        case TFileType.IMAGE:
            return jsx("img", { src: props.src });
        case TFileType.VIDEO:
            return jsx(Video, { ...props });
        default:
            return (jsxs("div", { className: 'i-preview-unknown', children: [jsx(Icon, { icon: jsx(FeedOutlined, {}), size: '3em' }), jsx("h5", { className: 'mt-4', children: name || suffix || "?" })] }));
    }
}

function Content(props) {
    const { items = [], initial = 0, renderFile: renderFile$1 = renderFile, onRotate, onChange, onClose, onZoom, } = props;
    const state = useReactive({
        current: initial,
        rotate: 0,
        scale: 1,
        translate: [0, 0],
        start: [0, 0],
        dragging: false,
        controlHidden: true,
    });
    const box = useRef(null);
    const translate = useRef([0, 0]);
    const hiddenTO = useRef(null);
    const files = useMemo(() => {
        return items.map((item) => {
            const o = {
                src: "",
            };
            if (typeof item === "string") {
                o.src = item;
            }
            else {
                Object.assign(o, item);
            }
            o.suffix = getSuffixByUrl(o.src) || "";
            o.type = getFileType(o.suffix, item["type"]);
            return o;
        });
    }, [items]);
    const { file, content } = useMemo(() => {
        const file = files[state.current];
        const content = renderFile$1(file);
        return {
            file,
            content,
        };
    }, [state.current, items]);
    const isImage = file.type === TFileType.IMAGE;
    const handleSwitch = (next) => {
        const l = files.length;
        const { current: before } = state;
        if (next >= l) {
            state.current = 0;
        }
        else if (next < 0) {
            state.current = l - 1;
        }
        else {
            state.current = next;
        }
        onChange?.(state.current, before);
        state.rotate = files[state.current].rotate || 0;
        if (state.scale !== 1) {
            state.scale = 1;
            onZoom?.(1);
        }
        onRotate?.(state.rotate);
        state.translate = translate.current = [0, 0];
    };
    const handleRotate = (deg) => {
        state.rotate += deg;
        onRotate?.(state.rotate);
    };
    const handleMouseWheel = throttle({ interval: 60 }, (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isImage)
            return;
        let after = state.scale + (e.deltaY < 0 ? 0.05 : -0.05);
        if (after > 2)
            after = 2;
        if (after < 0.25)
            after = 0.25;
        onZoom?.(after);
        state.scale = after;
    });
    const handleMouseDown = (e) => {
        if (!isImage)
            return;
        e.preventDefault();
        state.dragging = true;
        state.start = [e.pageX, e.pageY];
    };
    const clearHiddenTO = () => {
        if (!hiddenTO.current || state.controlHidden)
            return;
        clearTimeout(hiddenTO.current);
        hiddenTO.current = null;
    };
    const setHiddenFalse = () => {
        if (!state.controlHidden)
            return;
        state.controlHidden = false;
        clearHiddenTO();
        hiddenTO.current = setTimeout(() => {
            state.controlHidden = true;
        }, 1000);
    };
    const throttleMouseMove = throttle({ interval: 300 }, setHiddenFalse);
    const handleMouseMove = (e) => {
        throttleMouseMove();
        if (!state.dragging)
            return;
        e.preventDefault();
        const [x, y] = translate.current;
        const [ox, oy] = state.start;
        const offsetX = e.pageX - ox;
        const offsetY = e.pageY - oy;
        state.translate = [x + offsetX, y + offsetY];
    };
    const handleMouseUp = () => {
        if (!state.dragging)
            return;
        state.dragging = false;
        translate.current = state.translate;
    };
    useMouseMove(handleMouseMove);
    useMouseUp(handleMouseUp);
    useEffect(() => {
        if (!box.current)
            return;
        box.current.addEventListener("wheel", handleMouseWheel, {
            passive: false,
        });
        return () => {
            if (!box.current)
                return;
            box.current.removeEventListener("wheel", handleMouseWheel);
        };
    }, []);
    return (jsxs(Fragment, { children: [jsx("div", { ref: box, className: classNames("i-preview-content", {
                    "no-transition": state.dragging,
                }), style: {
                    transform: `translate(${state.translate
                        .map((n) => `${n}px`)
                        .join(",")}) rotate(${state.rotate}deg) scale(${state.scale})`,
                }, onMouseDown: handleMouseDown, onClick: (e) => e.stopPropagation(), children: content }), jsxs("div", { className: classNames("i-preview-controls", {
                    "i-preview-controls-hidden": state.controlHidden,
                }), children: [jsx(Button, { square: true, flat: true, onClick: onClose, children: jsx(Icon, { icon: jsx(CloseRound, {}) }) }), files.length > 1 && (jsxs("span", { className: 'px-8', children: [state.current + 1, " / ", files.length] })), state.scale !== 1 && (jsxs(Button, { flat: true, onClick: () => (state.scale = 1), children: [jsx(Icon, { icon: jsx(AspectRatioRound, {}) }), jsxs("span", { className: 'mt-2', children: [(state.scale * 100).toFixed(0), "%"] })] })), jsx(Button, { square: true, flat: true, href: file.src, target: '_blank', children: jsx(Icon, { icon: jsx(OpenInNewRound, {}) }) }), jsx(Button, { square: true, flat: true, href: file.src, download: true, target: '_blank', children: jsx(Icon, { icon: jsx(FileDownloadOutlined, {}) }) }), jsx(Button, { square: true, flat: true, onClick: () => handleRotate(90), children: jsx(Icon, { icon: jsx(RotateRightRound, {}) }) }), jsx(Button, { square: true, flat: true, onClick: () => handleRotate(-90), children: jsx(Icon, { icon: jsx(RotateLeftRound, {}) }) }), files.length > 1 && (jsxs(Fragment, { children: [jsx(Button, { square: true, flat: true, onClick: () => handleSwitch(state.current - 1), children: jsx(Icon, { icon: jsx(KeyboardArrowLeftRound, {}) }) }), jsx(Button, { square: true, flat: true, onClick: () => handleSwitch(state.current + 1), children: jsx(Icon, { icon: jsx(KeyboardArrowRightRound, {}) }) })] }))] })] }));
}

function usePreview() {
    const ref = useRef(null);
    const preview = (config) => {
        const { items, modalProps, onClose, ...restProps } = config;
        const handleClose = () => {
            onClose?.();
            unMount?.();
        };
        const unMount = renderNode(jsx(HookModal, { ref: ref, visible: true, className: 'i-preview', customized: true, hideShadow: true, ...modalProps, children: jsx(Content, { ...restProps, items: items, onClose: () => {
                    ref.current?.update({ visible: false });
                } }), fixed: true, onClose: handleClose }));
    };
    return preview;
}

function List(props) {
    const { items = [], gap = 8, columns, wrap, direction, usePreview: previewable, onClick, ...restProps } = props;
    const preview = usePreview();
    const files = useMemo(() => {
        return items.map((item) => {
            const o = {
                src: "",
            };
            if (typeof item === "string") {
                o.src = item;
            }
            else {
                Object.assign(o, item);
            }
            o.suffix = getSuffixByUrl(o.src) || "";
            o.type = getFileType(o.suffix, item["type"]);
            return o;
        });
    }, [items]);
    const handleClick = (e, i) => {
        onClick?.(e);
        previewable &&
            preview({
                items: files,
                initial: i,
            });
    };
    if (!files.length)
        return "";
    return (jsx(Flex, { className: 'i-image-list', gap: gap, columns: columns, wrap: wrap, direction: direction, children: files.map((img, i) => {
            return (jsx(MemoImage, { src: img.src, usePreview: false, onClick: (e) => handleClick(e, i), ...restProps }, i));
        }) }));
}

const STATUS_LOADING = "loading";
const STATUS_ERROR = "error";
const Image = (props) => {
    const { src, thumb, round, size, height, width, ratio, initSize, lazyload, fallback, fit, style, className, cover, coverClass, usePreview: previewable, onLoad, onError, onClick, ...restProps } = props;
    const state = useReactive({
        status: STATUS_LOADING,
    });
    const ref = useRef(null);
    const { observe, unobserve } = useIntersectionObserver();
    const preview = usePreview();
    const setStatus = useCallback((status) => {
        if (state.status === status)
            return;
        state.status = status;
    }, [state]);
    const handleError = useCallback((err) => {
        onError?.(err);
        setStatus(STATUS_ERROR);
    }, [onError, setStatus]);
    const handleLoad = useCallback((e) => {
        onLoad?.(e);
        setStatus(undefined);
    }, [onLoad, setStatus]);
    const handleClick = useCallback((e) => {
        onClick?.(e);
        if (!previewable || !src)
            return;
        const previewConfigs = typeof previewable === "boolean" ? {} : previewable;
        preview({
            ...previewConfigs,
            items: [
                {
                    src,
                    type: "IMAGE",
                },
            ],
        });
    }, [onClick, preview, previewable, src]);
    useEffect(() => {
        if (!src || typeof window === "undefined")
            return;
        const img = ref.current;
        if (!img)
            return;
        const hasSrcAttr = img?.getAttribute("src");
        const canSyncStatus = Boolean(img && (!lazyload || hasSrcAttr));
        if (canSyncStatus && img.complete) {
            setStatus(img.naturalWidth > 0 ? undefined : STATUS_ERROR);
        }
        if (!img.complete && observe && lazyload) {
            setStatus(STATUS_LOADING);
        }
        if (!lazyload || !observe)
            return;
        observe(img, (tar, visible) => {
            if (!visible)
                return;
            tar.setAttribute("src", tar.dataset.src || "");
            unobserve(tar);
        });
        return () => {
            unobserve(img);
        };
    }, [lazyload, observe, setStatus, src, unobserve]);
    const imageStatus = state.status;
    const iSize = imageStatus === STATUS_LOADING ? initSize : undefined;
    const wrapperStyle = useMemo(() => ({
        width: width ?? size ?? iSize,
        height: height ?? size ?? iSize,
        aspectRatio: ratio,
        ...style,
    }), [height, iSize, ratio, size, style, width]);
    const wrapperClassName = useMemo(() => classNames("i-image", className, {
        rounded: round,
        [`i-image-${imageStatus}`]: imageStatus,
    }), [className, imageStatus, round]);
    const imageStyle = useMemo(() => ({ objectFit: fit }), [fit]);
    const imageSrcProps = lazyload
        ? { "data-src": thumb ?? src }
        : { src: thumb ?? src };
    return (jsx("div", { style: wrapperStyle, className: wrapperClassName, onClick: handleClick, children: imageStatus === STATUS_ERROR ? ((fallback ?? null)) : (jsxs(Fragment, { children: [src && (jsx("img", { ref: ref, style: imageStyle, ...imageSrcProps, ...restProps, onLoad: handleLoad, onError: handleError })), src && imageStatus === STATUS_LOADING && (jsx(Loading, { absolute: true })), cover && (jsx("div", { className: classNames("i-image-cover", coverClass), children: cover }))] })) }));
};
const MemoImage = memo(Image);
MemoImage.List = List;

function InputContainer(props) {
    const { as: As = "label", label, className, labelInline, style, children, status, tip, required, } = props;
    return (jsxs(As, { className: classNames("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && (jsxs("span", { className: 'i-input-label-text', children: [required && jsx("span", { className: 'error', children: "*" }), label] })), children, tip && (jsx("span", { className: classNames("i-input-message", {
                    [`i-input-${status}`]: status !== "normal",
                }), children: tip }))] }));
}

const Number$1 = (props) => {
    const { ref, label, name, value = "", labelInline, step = 1, min = -Infinity, max = Infinity, thousand, precision, type, className, width, status = "normal", append, border, underline, prepend, disabled, message, tip, hideControl, showMax, style, onChange, onEnter, onInput, onBlur, ...restProps } = props;
    const [inputValue, setInputValue] = useState(value === undefined || value === null ? "" : String(value));
    const formatOut = (num) => {
        const v = clamp(num, min, max);
        if (precision !== undefined)
            return formatNumber(v, { precision, thousand });
        const s = String(v);
        if (!thousand)
            return s;
        const negative = s.startsWith("-");
        const body = negative ? s.slice(1) : s;
        const [integer, decimal] = body.split(".");
        const withThousand = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
        return decimal
            ? `${negative ? "-" : ""}${withThousand}.${decimal}`
            : `${negative ? "-" : ""}${withThousand}`;
    };
    const sanitizeNumberInput = (raw) => {
        const hasMinus = raw.startsWith("-");
        let v = raw.replace(/[^\d.]/g, "");
        if (hasMinus)
            v = `-${v}`;
        const parts = v.split(".");
        if (parts.length > 1) {
            v = `${parts.shift()}.${parts.join("")}`;
        }
        return v;
    };
    const formatInputValue = (v) => {
        if (!v)
            return "";
        if (typeof v === "number")
            return v.toString();
        if (!thousand)
            return v;
        return v.split(thousand).join("");
    };
    const handleChange = (e) => {
        const { value } = e.target;
        const v = sanitizeNumberInput(formatInputValue(value));
        const isIntermediate = v === "" || v === "-" || v === "." || v === "-." || v.endsWith(".");
        setInputValue(v);
        if (isIntermediate)
            return;
        const num = parseFloat(v);
        if (globalThis.Number.isNaN(num))
            return;
        onChange?.(clamp(num, min, max), e);
        if (precision !== undefined)
            setInputValue(formatOut(num));
    };
    const handleOperate = (param) => {
        const value = parseFloat(formatInputValue(inputValue)) || 0; // 确保值为数字，默认值为 0
        const result = value + param;
        setInputValue(formatOut(result));
        onChange?.(clamp(result, min, max));
    };
    const handleMax = () => {
        setInputValue(formatOut(max));
        onChange?.(clamp(max, min, max));
    };
    const handleBlur = (e) => {
        onBlur?.(e);
        const v = sanitizeNumberInput(formatInputValue(inputValue));
        if (!v || v === "-" || v === "." || v === "-.") {
            setInputValue("");
            return;
        }
        const num = parseFloat(v);
        if (globalThis.Number.isNaN(num))
            return;
        const numValue = clamp(num, min, max);
        setInputValue(formatOut(numValue));
        onChange?.(numValue, e);
    };
    useEffect(() => {
        setInputValue(value === undefined || value === null ? "" : String(value));
    }, [value]);
    const inputProps = {
        ref,
        name,
        disabled,
        value: inputValue,
        className: "i-input i-input-number",
        onChange: handleChange,
        onKeyDown: (e) => {
            e.code === "Enter" && onEnter?.(e);
        },
        onInput,
        onBlur: handleBlur,
        ...restProps,
    };
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, children: jsxs("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
                "i-input-underline": underline,
            }), children: [prepend && jsx("div", { className: 'i-input-prepend', children: prepend }), !hideControl && !disabled && (jsx(Helpericon, { active: true, icon: jsx(MinusRound, {}), onClick: () => handleOperate(-step) })), jsx("input", { ...inputProps }), !hideControl && !disabled && (jsx(Helpericon, { active: true, icon: jsx(PlusRound, {}), onClick: () => handleOperate(step) })), showMax && max && !disabled && (jsx(Helpericon, { active: true, icon: jsx(KeyboardDoubleArrowUpRound, {}), onClick: handleMax })), append && jsx("div", { className: 'i-input-append', children: append })] }) }));
};

const Range = (props) => {
    const { label, name, value, labelInline, min = -Infinity, max = Infinity, type, className, status = "normal", message, tip, append, prepend, step = 1, width, thousand, precision, hideControl, placeholder, border, underline, autoSwitch, onChange, onBlur, style, ...restProps } = props;
    const [rangeValue, setRangeValue] = useState(value);
    const getRangeNumber = (v) => clamp(v, min, max);
    const getFormatNumber = (v) => formatNumber(v, { precision, thousand });
    const formatInputValue = (v) => {
        if (!v)
            return "";
        if (typeof v === "number" || !thousand)
            return v;
        return v.replaceAll(thousand, "");
    };
    const handleChange = (e, i) => {
        const { value } = e.target;
        const v = formatInputValue(value.replace(/[^\d\.-]/g, ""));
        const range = Array.isArray(rangeValue) ? [...rangeValue] : [];
        range[i] = v;
        setRangeValue(range);
        onChange?.(range, e);
    };
    const handleOperate = (e, param, i) => {
        e.preventDefault();
        e.stopPropagation();
        const range = Array.isArray(rangeValue) ? [...rangeValue] : [];
        const value = formatInputValue(range[i]) ?? 0;
        const result = getRangeNumber(+value + param);
        range[i] = getFormatNumber(result);
        setRangeValue(range);
        onChange?.(range, e);
    };
    const handleSwitch = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        const range = Array.isArray(rangeValue) ? [...rangeValue] : [];
        [range[0], range[1]] = [range[1], range[0]];
        setRangeValue(range);
        onChange?.(range);
    };
    useEffect(() => {
        setRangeValue(value);
    }, [value]);
    const inputProps = {
        name,
        className: "i-input i-input-number",
        ...restProps,
    };
    const handleBlur = () => {
        if (!autoSwitch)
            return;
        const range = Array.isArray(rangeValue) ? rangeValue : [];
        if (range.length < 2)
            return;
        const [left, right] = range.map(Number);
        if (left > right) {
            handleSwitch();
        }
    };
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, children: jsxs("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
                "i-input-underline": underline,
            }), children: [prepend && jsx("div", { className: 'i-input-prepend', children: prepend }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(MinusRound, {}), onClick: (e) => handleOperate(e, -step, 0) })), jsx("input", { value: rangeValue?.[0] || "", placeholder: placeholder?.[0], ...inputProps, onBlur: handleBlur, onChange: (e) => handleChange(e, 0) }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(PlusRound, {}), onClick: (e) => handleOperate(e, step, 0) })), jsx(Helpericon, { active: true, icon: jsx(SyncAltRound, {}), style: { margin: 0 }, onClick: handleSwitch }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(MinusRound, {}), onClick: (e) => handleOperate(e, -step, 1) })), jsx("input", { value: rangeValue?.[1] || "", placeholder: placeholder?.[1], ...inputProps, onBlur: handleBlur, onChange: (e) => handleChange(e, 1) }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(PlusRound, {}), onClick: (e) => handleOperate(e, step, 1) })), append && jsx("div", { className: 'i-input-append', children: append })] }) }));
};

const Textarea = (props) => {
    const { ref, label, name, value = "", labelInline, className, status = "normal", message, tip, autoSize, border, width, style, resize, onChange, onEnter, ...restProps } = props;
    const [textareaValue, setTextareaValue] = useState(value);
    const refTextarea = useRef(null);
    const syncTextareaHeight = () => {
        const ta = refTextarea.current;
        if (!autoSize || !ta)
            return;
        ta.style.height = "auto";
        ta.style.height = `${ta.scrollHeight}px`;
    };
    const handleChange = (e) => {
        const v = e.target.value;
        setTextareaValue(v);
        onChange?.(v, e);
    };
    const handleKeydown = (e) => {
        if (e.code !== "Enter")
            return;
        e.stopPropagation();
        onEnter?.(e);
    };
    useEffect(() => {
        setTextareaValue(value);
    }, [value]);
    useEffect(() => {
        syncTextareaHeight();
    }, [autoSize, textareaValue]);
    useImperativeHandle(ref, () => {
        return {
            input: refTextarea.current,
        };
    });
    const inputProps = {
        ref: refTextarea,
        name,
        value: textareaValue,
        className: "i-input i-textarea",
        style: resize === false ? { resize: "none" } : undefined,
        onChange: handleChange,
        onKeyDown: handleKeydown,
        ...restProps,
    };
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, children: jsx("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
            }), children: jsx("textarea", { ...inputProps }) }) }));
};

const Input = ((props) => {
    const { ref, type = "text", label, name, value = "", prepend, append, labelInline, className, status = "normal", message, tip, clear, width, hideVisible, border, underline, required, maxLength, onChange, onEnter, onClear, style, ...restProps } = props;
    const [inputValue, setInputValue] = useState(value);
    const [inputType, setInputType] = useState(type);
    const [visible, setVisible] = useState(false);
    const handleChange = (e) => {
        const v = e.target.value;
        setInputValue(v);
        onChange?.(v, e);
    };
    const handleKeydown = (e) => {
        e.code === "Enter" && onEnter?.(e);
    };
    const handleHelperClick = () => {
        if (type === "password" && !hideVisible) {
            setVisible((v) => {
                const next = !v;
                setInputType(next ? "text" : "password");
                return next;
            });
            return;
        }
        const v = "";
        setInputValue(v);
        onChange?.(v);
        onClear?.();
    };
    const HelperIcon = useMemo(() => {
        if (type === "password") {
            return visible ? jsx(VisibilityRound, {}) : jsx(VisibilityOffRound, {});
        }
        return undefined;
    }, [type, visible]);
    useEffect(() => {
        setInputValue(value);
    }, [value]);
    const inputProps = {
        ref,
        type: inputType,
        name,
        value: inputValue,
        maxLength,
        className: classNames("i-input", `i-input-${type}`),
        onChange: handleChange,
        onKeyDown: handleKeydown,
        ...restProps,
    };
    useEffect(() => {
        setInputType(type);
        setVisible(false);
    }, [type]);
    const clearable = clear && inputValue;
    const showHelper = type === "password" && !!inputValue;
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, required: required, children: jsxs("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
                "i-input-underline": underline,
            }), children: [prepend && jsx("div", { className: 'i-input-prepend', children: prepend }), jsx("input", { ...inputProps }), maxLength && inputValue?.length > 0 && (jsxs("span", { className: 'color-8 pr-4 font-sm', children: [inputValue.length, " / ", maxLength] })), jsx(Helpericon, { active: !!clearable || showHelper, icon: HelperIcon, onClick: handleHelperClick }), append && jsx("div", { className: 'i-input-append', children: append })] }) }));
});
Input.Textarea = Textarea;
Input.Number = Number$1;
Input.Range = Range;

const AlignMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
};
const GlobalConfig = {
    gap: 12,
};
const ItemDefaultConfig = {
    duration: 3000,
    closable: true,
    active: false,
};
const handler = {
    oneInstance: null,
    callout(item) { },
    close() { },
};
const queue = {
    left: [],
    center: [],
    right: [],
};
const heights = {
    left: [],
    center: [],
    right: [],
};
const MessageItem = function ({ ref, active, content, top, className, style, onClick, }) {
    return (jsx("div", { ref: ref, className: classNames("i-message", className, {
            "i-message-active": active,
        }), style: {
            ...style,
            top,
        }, onClick: onClick, children: content }));
};
function Messages() {
    const ref = useRef(null);
    const state = useReactive({
        items: {
            left: [],
            center: [],
            right: [],
        },
        tops: {
            left: [],
            center: [],
            right: [],
        },
    });
    const offsetTop = {
        left: 0,
        center: 0,
        right: 0,
    };
    useEffect(() => {
        Object.assign(handler, {
            callout: function (item) {
                const { align = "center", unshift, onShow } = item;
                const size = queue[align][unshift ? "unshift" : "push"](item);
                state.items[align] = [...queue[align]];
                item.close = this.close.bind(item);
                setTimeout(() => {
                    const h = ref.current?.offsetHeight || 0;
                    queue[align][unshift ? 0 : size - 1].active = true;
                    state.items[align] = [...queue[align]];
                    heights[align][unshift ? "unshift" : "push"](h);
                    state.tops[align] = [...heights[align]];
                    onShow?.();
                }, 12);
                if (item.duration !== 0) {
                    item.timer = setTimeout(() => {
                        this.close.call(item);
                    }, item.duration);
                }
            },
            close: function () {
                const item = this;
                const { align = "center", onHide } = item;
                const index = queue[align].findIndex((i) => i.id === item.id);
                if (index < 0)
                    return;
                queue[align][index].active = false;
                state.items[align] = [...queue[align]];
                item.timer = setTimeout(() => {
                    const index = queue[align].findIndex((i) => i.id === item.id);
                    queue[align].splice(index, 1);
                    heights[align].splice(index, 1);
                    state.tops[align] = [...heights[align]];
                    state.items[align] = [...queue[align]];
                    item.timer && clearTimeout(item.timer);
                    onHide?.();
                }, 240);
            },
        });
    }, []);
    const renderItems = (item, i) => {
        if (!item)
            return jsx(Fragment, {});
        const { id, active, content, align = "center", className } = item;
        offsetTop[align] += state.tops[align][i - 1] || 0;
        const top = GlobalConfig.gap * i + offsetTop[align];
        return (jsx(MessageItem, { ref: ref, active: active, content: content, top: top, className: className, style: { alignSelf: AlignMap[align] }, onClick: handler.close.bind(item) }, id));
    };
    return (jsxs("div", { className: 'i-messages', children: [state.items.left.map(renderItems), state.items.center.map(renderItems), state.items.right.map(renderItems)] }));
}
function message(config) {
    if (["string", "number"].includes(typeof config) ||
        isValidElement(config)) {
        config = { content: config };
    }
    config = Object.assign({ id: uid(7) }, ItemDefaultConfig, config);
    handler.callout(config);
    return {
        instance: config,
        close: handler.close.bind(config),
    };
}
function createContainer() {
    if (typeof document === "undefined")
        return null;
    const container = document.createElement("div");
    container.dataset.id = "messages";
    document.body.append(container);
    return container;
}
message.error = (content) => {
    return message({
        content,
        className: "bg-error",
    });
};
message.success = (content) => {
    return message({
        content,
        className: "bg-success",
    });
};
message.warning = (content) => {
    return message({
        content,
        className: "bg-warning",
    });
};
message.info = (content) => {
    return message({
        content,
        className: "bg-blue",
    });
};
message.one = (config) => {
    const o = handler.oneInstance;
    if (o) {
        if (o.active && o.duration !== 0) {
            clearTimeout(o.timer);
            o.timer = setTimeout(() => {
                o.close?.();
            }, o.duration);
        }
        else {
            handler.callout(o);
        }
    }
    else {
        const { instance } = message(config);
        handler.oneInstance = instance;
    }
};
// 初始化消息容器
let container = null;
let root = null;
if (typeof window !== "undefined") {
    container = createContainer();
    if (container) {
        root = createRoot(container);
        root.render(jsx(Messages, {}));
    }
}

const Page = (props) => {
    const { page, active, disabled, children, onChange } = props;
    const [loading, setLoading] = useState(false);
    const handleClick = async () => {
        if (active || loading || disabled)
            return;
        setLoading(true);
        await onChange?.(page);
        setLoading(false);
    };
    return (jsxs("a", { className: classNames("i-page", {
            "i-page-active": active,
            "i-page-loading": loading,
            "i-page-disabled": disabled,
        }), "data-page": page, onClick: handleClick, children: [loading && jsx(Loading, { absolute: true }), children] }));
};

const Pagination = (props) => {
    const { page: defaultPage = 1, size = 10, total = 0, sibling = 2, prev = jsx(Icon, { icon: jsx(KeyboardArrowLeftRound, {}) }), next = jsx(Icon, { icon: jsx(KeyboardArrowRightRound, {}) }), simple, jumper, className, renderEllipsis = () => (jsx(Icon, { icon: jsx(MoreHorizRound, {}), className: 'color-7' })), renderPage = (i) => i, onChange, ...restProps } = props;
    const [page, setPage] = useState(defaultPage);
    const [loading, setLoading] = useState(false);
    const totalPage = useMemo(() => Math.ceil(total / size), [size, total]);
    const [start, end, loop] = useMemo(() => {
        const start = Math.max(1, page - sibling);
        const end = Math.min(totalPage, page + sibling);
        return [
            start,
            end,
            Array.from({ length: end - start + 1 }).map((n, i) => start + i),
        ];
    }, [page, totalPage, sibling]);
    const handlePageChange = async (p) => {
        if (!onChange || loading)
            return;
        setLoading(true);
        return new Promise(async (resolve) => {
            if (p === undefined)
                return;
            await onChange(p);
            setPage(p);
            setLoading(false);
            resolve();
        });
    };
    useEffect(() => setPage(defaultPage), [defaultPage]);
    if (totalPage <= page && page === 1)
        return jsx(Fragment, {});
    return (jsxs("div", { className: classNames("i-pagination", className), ...restProps, children: [prev && (jsx(Page, { page: page - 1 || 1, disabled: page === 1, onChange: handlePageChange, children: prev })), start > 1 && (jsx(Page, { page: 1, onChange: handlePageChange, children: renderPage(1) })), start > 2 && renderEllipsis(), loop.map((p) => {
                return (jsx(Page, { page: p, active: p === page, onChange: handlePageChange, children: renderPage(p) }, p));
            }), end < totalPage - 1 && renderEllipsis(), end < totalPage && (jsx(Page, { page: totalPage, onChange: handlePageChange, children: renderPage(totalPage) })), next && (jsx(Page, { page: page + 1, disabled: page === totalPage, onChange: handlePageChange, children: next }))] }));
};

const Tag = (props) => {
    const { dot, dotClass, outline, round, size = "normal", hoverShowClose, className, children, onClose, onClick, ...restProps } = props;
    return (jsxs("span", { className: classNames("i-tag", {
            "i-tag-outline": outline,
            "i-tag-clickable": onClick,
            [`i-tag-${size}`]: size !== "normal",
            round,
        }, className), onClick: onClick, ...restProps, children: [dot && jsx("span", { className: classNames("i-tag-dot", dotClass) }), children, onClose && (jsx(Helpericon, { active: true, className: classNames("i-tag-close", {
                    "i-tag-hover-close": hoverShowClose,
                }), onClick: onClose }))] }));
};

const Options = (props) => {
    const { value: val, options, filter, filterPlaceholder, multiple, empty = jsx(Empty, {}), onSelect, onFilter, } = props;
    return (jsxs("div", { className: classNames("i-select-options", {
            "i-select-options-multiple": multiple,
        }), children: [filter && multiple && (jsxs("div", { className: 'i-select-filter', children: [jsx(Icon, { icon: jsx(SearchRound, {}), className: 'color-8 ml-8 my-auto', size: '1.2em' }), jsx("input", { type: 'text', className: 'i-input', placeholder: filterPlaceholder, onChange: onFilter })] })), options.length === 0 && empty, options.map((option, i) => {
                const { label, value, disabled } = option;
                const isActive = multiple
                    ? val?.includes(value)
                    : val === value;
                return (jsxs(List$1.Item, { active: isActive, type: 'option', onClick: () => onSelect?.(value, option), disabled: disabled, children: [multiple && (jsx(Icon, { icon: jsx(CheckRound, {}), className: 'i-select-option-check', size: '1em' })), label] }, value || i));
            })] }));
};
const activeOptions = (options = [], value = [], max = 3) => {
    const total = options.flatMap((opt) => value.includes(opt.value) ? [opt] : []);
    if (max >= total.length)
        return total;
    const rest = total.length - max;
    const after = total.slice(0, max);
    after.push(rest);
    return after;
};
const displayValue = (config) => {
    const { options, value, maxDisplay, multiple, onSelect } = config;
    if (multiple) {
        return activeOptions(options, value, maxDisplay).map((opt, i) => {
            if (typeof opt === "number")
                return jsxs(Tag, { children: ["+", opt] }, i);
            const { label, value } = opt;
            return (jsx(Tag, { hoverShowClose: true, onClose: (e) => {
                    e?.stopPropagation();
                    onSelect?.(value, opt);
                }, children: label }, value));
        });
    }
    return options.find((opt) => opt.value === value)?.label;
};

const Select = (props) => {
    const { ref, type = "text", name, label, value = "", placeholder, options = [], multiple, prepend, append, labelInline, style, className, message, status = "normal", hideClear, hideArrow, maxDisplay, border, filter, tip, filterPlaceholder = "...", popupProps, onSelect, onChange, ...restProps } = props;
    const [filterValue, setFilterValue] = useState("");
    const [selectedValue, setSelectedValue] = useState(value);
    const [active, setActive] = useState(false);
    const formattedOptions = useMemo(() => formatOption(options), [options]);
    const filterOptions = useMemo(() => {
        const fv = filterValue;
        if (!fv || !filter)
            return formattedOptions;
        const filterFn = typeof filter === "function"
            ? filter
            : (opt) => opt.value.includes(fv) || opt.label.includes(fv);
        return formattedOptions.filter(filterFn);
    }, [formattedOptions, filter, filterValue]);
    const changeValue = (v) => {
        setSelectedValue(v);
        onChange?.(v);
    };
    const displayLabel = useMemo(() => {
        if (multiple) {
            return "";
        }
        const option = formattedOptions.find((opt) => opt.value === selectedValue);
        return option ? option.label : selectedValue;
    }, [selectedValue, formattedOptions]);
    const handleSelect = (value, option) => {
        onSelect?.(value, option);
        if (multiple) {
            const values = [...selectedValue];
            const i = values.findIndex((v) => v === value);
            i > -1 ? values.splice(i, 1) : values.push(value);
            changeValue(values);
            return;
        }
        setActive(false);
        changeValue(value);
    };
    const handleVisibleChange = (visible) => {
        setActive(visible);
        if (!filter)
            return;
        setFilterValue("");
    };
    const handleHelperClick = (e) => {
        e.stopPropagation();
        setActive(true);
        if (!active)
            return;
        changeValue(multiple ? [] : "");
    };
    const handleFilterChange = debounce({ delay: 400 }, (e) => {
        const v = e.target.value;
        setFilterValue(v);
    });
    const handleInputChange = (e) => {
        setFilterValue(e.target.value);
    };
    useEffect(() => {
        setSelectedValue(value);
    }, [value]);
    const hasValue = multiple
        ? selectedValue.length > 0
        : !!selectedValue;
    const clearable = !hideClear && active && hasValue;
    const text = message ?? tip;
    return (jsxs("label", { className: classNames("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && jsx("span", { className: 'i-input-label-text', children: label }), jsx(Popup, { position: 'bottom', arrow: false, fitSize: true, offset: 0, ...popupProps, visible: active, trigger: 'none', onVisibleChange: handleVisibleChange, content: jsx(Options, { options: filterOptions, value: selectedValue, multiple: multiple, filter: !!filter, filterPlaceholder: filterPlaceholder, onSelect: handleSelect, onFilter: handleFilterChange }), children: jsxs("div", { className: classNames("i-input-item", {
                        [`i-input-${status}`]: status !== "normal",
                        "i-input-borderless": !border,
                        "i-input-focus": active,
                    }), onClick: () => setActive(true), children: [prepend, jsx("input", { ref: ref, type: 'hidden', value: selectedValue, ...restProps }), multiple ? (hasValue ? (jsx("div", { className: classNames("i-input i-select", {
                                "i-select-multiple": multiple,
                            }), children: displayValue({
                                options: formattedOptions,
                                value: selectedValue,
                                multiple,
                                maxDisplay,
                                onSelect: handleSelect,
                            }) })) : (jsx("input", { className: 'i-input i-select', placeholder: placeholder, readOnly: true }))) : null, !multiple && (jsx("input", { value: active ? filterValue : displayLabel, className: 'i-input i-select', placeholder: displayLabel || placeholder, onChange: handleInputChange, readOnly: !filter })), jsx(Helpericon, { active: !hideArrow, icon: clearable ? undefined : jsx(UnfoldMoreRound, {}), onClick: handleHelperClick }), append] }) }), text && jsx("span", { className: 'i-input-message', children: text })] }));
};

const ColorMethods = {
    HEX: "toHexString",
    RGB: "toRgbString",
    HSB: "toHsbString",
};
function Footer(props) {
    const { value, type, onTypeChange, onChange, onOk } = props;
    const [inputValue, setInputValue] = useState(value);
    const [colorType, setColorType] = useState(type);
    const handleChange = (v) => {
        setInputValue(v);
        onChange(v);
    };
    const handleTypeChange = (t) => {
        setColorType(t);
        onTypeChange(t);
    };
    useEffect(() => {
        setInputValue(value);
        setColorType(type);
    }, [value, type]);
    return (jsxs("div", { className: "i-colorpicker-footer", children: [jsx(Select, { readOnly: true, hideClear: true, hideArrow: true, style: { width: "5.6em" }, options: ["RGB", "HEX", "HSB"], value: colorType, onChange: handleTypeChange, popupProps: { fitSize: false } }), jsx(Input, { placeholder: "color", value: inputValue, onChange: handleChange }), jsx(Button, { square: true, onClick: onOk, children: jsx(Icon, { icon: jsx(CheckRound, {}) }) })] }));
}

const Handle = (props) => {
    const { ref, color, handle, placeholder, className, ...restProps } = props;
    return (jsxs("div", { ref: ref, className: classNames("i-colorpicker-handle", className), ...restProps, children: [handle !== "text" && (jsx("i", { className: 'i-colorpicker-square', style: { background: color } })), handle !== "square" && (jsx("span", { className: 'i-colorpicker-text', style: { color }, children: color ?? placeholder }))] }));
};

function ColorPicker(props) {
    const { value, type = "HEX", disabledAlpha, children, usePanel, handle = "both", placeholder = "Colors", popupProps, onChange, } = props;
    const [colorType, setColorType] = useState(type);
    const [colorValue, setColorValue] = useState(value);
    const [syncValue, setSyncValue] = useState(value);
    const [visible, setVisible] = useState(popupProps?.visible);
    const handleChange = (target) => {
        setSyncValue(target);
    };
    const handleComplete = (target) => {
        const method = ColorMethods[colorType];
        if (target.a !== 1) {
            target.a = parseFloat(target.a.toFixed(3));
        }
        setColorValue(target[method]?.());
    };
    const handleVisibleChange = (v) => {
        setVisible(v);
        popupProps?.onVisibleChange?.(v);
    };
    const handleTypeChange = (t) => {
        const method = ColorMethods[t];
        setColorType(t);
        setColorValue(syncValue?.[method]?.());
    };
    const handleValueChange = (v) => {
        setColorValue(v);
        setSyncValue(v);
    };
    const handleOk = () => {
        onChange?.(colorValue);
        setVisible(false);
    };
    useEffect(() => {
        setSyncValue(value);
        setColorValue(value);
    }, [value]);
    useEffect(() => {
        if (popupProps?.visible !== undefined) {
            setVisible(popupProps.visible);
        }
    }, [popupProps?.visible]);
    if (usePanel) {
        return jsx(ColorsPanel, { ...props });
    }
    return (jsx(Popup, { trigger: 'click', touchable: true, position: 'bottom', ...popupProps, visible: visible, content: jsx(ColorsPanel, { value: syncValue, disabledAlpha: disabledAlpha, panelRender: (panel) => {
                return (jsxs(Fragment, { children: [panel, jsx(Footer, { value: colorValue, type: colorType, onTypeChange: handleTypeChange, onChange: handleValueChange, onOk: handleOk })] }));
            }, onChange: handleChange, onChangeComplete: handleComplete }), onVisibleChange: handleVisibleChange, children: children ?? (jsx(Handle, { color: value, handle: handle, placeholder: placeholder })) }));
}

const Dates = (props) => {
    const { value, month, weeks = ["一", "二", "三", "四", "五", "六", "日"], renderDate = (date) => date.date(), disabledDate, onDateClick, } = props;
    const today = dayjs();
    const dates = useMemo(() => {
        const dates = [];
        const lastDateOfLastMonth = month.add(-1, "month").endOf("month");
        let { $W, $D } = lastDateOfLastMonth;
        if ($W !== 0) {
            const lastMonthDates = Array.from({ length: $W }).map((whatever, i) => lastDateOfLastMonth.add(i + 1 - $W, "day"));
            dates.push(...lastMonthDates);
        }
        const lastDate = month.endOf("month");
        $D = lastDate.$D;
        $W = lastDate.$W;
        dates.push(...Array.from({ length: $D }).map((whatever, i) => lastDate.add(i + 1 - $D, "day")));
        if ($W !== 0) {
            dates.push(...Array.from({ length: 7 - $W }).map((whatever, i) => lastDate.add(i + 1, "day")));
        }
        return dates;
    }, [month]);
    const handleDateClick = (date) => {
        if (disabledDate?.(date))
            return;
        onDateClick?.(date);
    };
    return (jsxs(Fragment, { children: [jsx("div", { className: 'i-datepicker-weeks', children: weeks.map((week, i) => (jsx("span", { className: 'i-datepicker-week', children: week }, i))) }), jsx("div", { className: 'i-datepicker-dates', children: dates.map((date, i) => {
                    const active = date.isSame(value, "day");
                    const isSameMonth = date.isSame(month, "month");
                    const isToday = date.isSame(today, "day");
                    const disabled = disabledDate?.(date);
                    return (jsx("div", { className: classNames("i-datepicker-item", {
                            "i-datepicker-active": active,
                            "i-datepicker-same-month": isSameMonth,
                            "i-datepicker-today": isToday,
                            "i-datepicker-disabled": disabled,
                        }), onClick: () => handleDateClick(date), children: renderDate(date) }, i));
                }) })] }));
};

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const YearMonth = (props) => {
    const { value, unitMonth = "月", unitYear = "年", renderYear, renderMonth, onClick, } = props;
    return (jsxs("a", { className: 'i-datepicker-action', "data-ripple": true, onClick: onClick, children: [jsx("span", { children: renderYear?.(value.year()) }), unitYear, jsx("span", { children: renderMonth?.(value.month() + 1) }), unitMonth] }));
};
const Panel$1 = (props) => {
    const { value, unitYear, unitMonth, renderDate, renderMonth = (m) => m, renderYear = (y) => y, disabledDate, onDateClick, } = props;
    const [today, setToday] = useState(value);
    const [month, setMonth] = useState(value || dayjs());
    const [selectedYear, setSelectedYear] = useState(dayjs());
    const [years, setYears] = useState([]);
    const [selectable, setSelectable] = useState(false);
    const $years = useRef(null);
    const handleOperateMonth = (next) => {
        setMonth((m) => m[next ? "add" : "subtract"](1, "month"));
    };
    const handleChangeDate = (date) => {
        if (date.isSame(today, "day"))
            return;
        if (!date.isSame(month, "month")) {
            setMonth(date);
        }
        setToday(date);
        onDateClick?.(date);
    };
    const handleChangeMonth = (month) => {
        setMonth((m) => m.year(selectedYear.year()).month(month - 1));
        setSelectable(false);
    };
    const getMoreYears = throttle({ interval: 100 }, (e) => {
        const isUp = e.deltaY < 0;
        setYears((ys) => ys.map((y) => y + (isUp ? -1 : 1)));
    });
    useEffect(() => {
        if (!selectable)
            return;
        setSelectedYear(month);
        const y = month.year();
        const nextYears = Array.from({ length: 7 }).map((_, i) => y - 3 + i);
        setYears([...nextYears]);
    }, [selectable, month]);
    useEffect(() => {
        setToday(value);
        setMonth(value || dayjs());
    }, [value]);
    return (jsxs("div", { className: 'i-datepicker', children: [jsxs("div", { className: 'i-datepicker-units', children: [jsx(YearMonth, { value: month, unitYear: unitYear, unitMonth: unitMonth, renderMonth: renderMonth, renderYear: renderYear, onClick: () => setSelectable(true) }), jsx("a", { className: 'ml-auto i-datepicker-action', "data-ripple": true, onClick: () => handleOperateMonth(false), children: jsx(Icon, { icon: jsx(KeyboardArrowLeftRound, {}) }) }), jsx("a", { className: 'i-datepicker-action', "data-ripple": true, onClick: () => handleOperateMonth(true), children: jsx(Icon, { icon: jsx(KeyboardArrowRightRound, {}) }) })] }), jsxs("div", { className: classNames("i-datepicker-ym", {
                    "i-datepicker-active": selectable,
                }), children: [jsx(Helpericon, { active: true, className: 'i-datepicker-close', onClick: (e) => {
                            e.stopPropagation();
                            setSelectable(false);
                        } }), jsx("div", { ref: $years, className: 'i-datepicker-years', onWheel: getMoreYears, children: years.map((y) => (jsx("a", { className: classNames("i-datepicker-year", {
                                "i-datepicker-active": y === selectedYear.year(),
                            }), onClick: () => setSelectedYear((sy) => sy.year(y)), children: renderYear(y) }, y))) }), jsx("div", { className: 'i-datepicker-months', children: MONTHS.map((m) => {
                            return (jsx("a", { className: classNames("i-datepicker-month", {
                                    "i-datepicker-active": m === month.month() + 1,
                                }), onClick: () => handleChangeMonth(m), children: renderMonth(m) }, m));
                        }) })] }), jsx(Dates, { value: today, month: month, disabledDate: disabledDate, onDateClick: handleChangeDate, renderDate: renderDate })] }));
};

dayjs.extend(customParseFormat);
const FORMATTYPES = ["YYYY-MM-DD", "YYYY-M-D", "YYYY/MM/DD", "YYYY/M/D"];
const FORMAT$1 = "YYYY-MM-DD";
const Datepicker = (props) => {
    const { name, value, weeks, format = FORMAT$1, placeholder = props.format ?? FORMAT$1, className, renderDate, renderMonth, renderYear, popupProps, disabledDate, onDateClick, onChange, onBlur, ...restProps } = props;
    const [inputValue, setInputValue] = useState(value);
    const [active, setActive] = useState(false);
    const dayJsValue = useMemo(() => {
        if (!inputValue)
            return null;
        const date = dayjs(inputValue, format, true);
        if (date.isValid())
            return date;
        return null;
    }, [inputValue, format]);
    const handleDateClick = (date) => {
        handleChange(date.format(format));
    };
    const handleChange = (v) => {
        setInputValue(v);
        onChange?.(v);
    };
    const handleSetDate = () => {
        if (!inputValue)
            return;
        const date = dayjs(inputValue, FORMATTYPES, true);
        if (date.isValid()) {
            handleChange(date.format(format));
            return;
        }
        handleChange("");
    };
    const handleBlur = (e) => {
        onBlur?.(e);
        handleSetDate();
    };
    const handleVisibleChange = (v) => {
        popupProps?.onVisibleChange?.(v);
        setActive(v);
    };
    useEffect(() => {
        setInputValue(value);
    }, [value]);
    return (jsx(Popup, { visible: active, trigger: 'click', position: 'bottom', arrow: false, align: 'start', onVisibleChange: handleVisibleChange, content: jsx(Panel$1, { value: dayJsValue, weeks: weeks, renderDate: renderDate, renderMonth: renderMonth, renderYear: renderYear, disabledDate: disabledDate, onDateClick: handleDateClick }), ...popupProps, children: jsx(Input, { value: inputValue, append: jsx(Icon, { icon: jsx(CalendarMonthTwotone, {}), className: 'i-datepicker-icon', size: '1em' }), placeholder: placeholder, onChange: handleChange, onBlur: handleBlur, onEnter: handleSetDate, className: classNames("i-datepicker-label", className), ...restProps }) }));
};

function Items(props) {
    const { items = [], active, renderItem, unit, onClick } = props;
    return items.map((n) => {
        const isActive = n === active;
        return (jsx("a", { className: classNames("i-timepicker-item", {
                "i-timepicker-item-active": isActive,
            }), onClick: () => onClick(n), children: renderItem?.(n, isActive, unit) ?? (n < 10 ? `0${n}` : n) }, n));
    });
}

const UnitMaps = {
    h: "hour",
    hh: "hour",
    m: "minute",
    mm: "minute",
    s: "second",
    ss: "second",
};
function Panel(props) {
    const { value, stepH = 1, stepM = 1, stepS = 1, format, periods, renderItem, onChange, onFallback, } = props;
    const [period, setPeriod] = useState(undefined);
    const [hour, setHour] = useState(undefined);
    const [minute, setMinute] = useState(undefined);
    const [second, setSecond] = useState(undefined);
    const [hours, minutes, seconds] = useMemo(() => {
        const hasH = format.includes("h");
        const hasM = format.includes("m");
        const hasS = format.includes("s");
        const hours = hasH
            ? Array.from({ length: (periods ? 12 : 24) / stepH }, (_, i) => i * stepH)
            : [];
        const minutes = hasM
            ? Array.from({ length: 60 / stepM }, (_, i) => i * stepM)
            : [];
        const seconds = hasS
            ? Array.from({ length: 60 / stepS }, (_, i) => i * stepS)
            : [];
        return [hours, minutes, seconds];
    }, [stepH, stepM, stepS, format, periods]);
    const updateValue = (next) => {
        const nextPeriod = next?.period ?? period;
        const nextHour = next?.hour ?? hour;
        const nextMinute = next?.minute ?? minute;
        const nextSecond = next?.second ?? second;
        const reg = /(hh|h){1}|(mm|m){1}|(ss|s){1}/gi;
        let result = format.replace(reg, (pattern) => {
            const p = pattern.toLowerCase();
            const u = UnitMaps[p];
            const n = u === "hour"
                ? (nextHour ?? 0)
                : u === "minute"
                    ? (nextMinute ?? 0)
                    : (nextSecond ?? 0);
            return p.length > 1 && n < 10 ? `0${n ?? 0}` : n ?? 0;
        });
        if (periods && hours.length > 0) {
            result = `${nextPeriod ?? periods[0]} ${result}`;
        }
        onChange(result);
    };
    const handleSetTime = (v, unit) => {
        const next = { period, hour, minute, second, [unit]: v };
        if (unit === "period")
            setPeriod(v);
        if (unit === "hour")
            setHour(v);
        if (unit === "minute")
            setMinute(v);
        if (unit === "second")
            setSecond(v);
        updateValue(next);
    };
    useEffect(() => {
        let time = value ?? "";
        if (periods && hours.length > 0 && value) {
            const [p, t] = value.split(" ");
            time = t ?? "";
            setPeriod(periods.includes(p) ? p : undefined);
        }
        const nums = time.match(/\d+/g) ?? [];
        if (!nums.length) {
            onFallback("");
            return;
        }
        let i = 0;
        const parsed = {
            hour: undefined,
            minute: undefined,
            second: undefined,
        };
        const r = format.replace(/(hh|h)+|(mm|m)+|(ss|s)+/gi, (p) => {
            const n = nums[i++] ?? 0;
            const o = Math.min(59, n);
            parsed[UnitMaps[p]] = o;
            return p.length > 1 && o < 10 ? `0${o}` : o;
        });
        setHour(parsed.hour);
        setMinute(parsed.minute);
        setSecond(parsed.second);
        onFallback(r);
    }, [value, format, hours.length, periods]);
    return (jsxs("div", { className: 'i-timepicker', children: [hours.length > 0 && (jsxs(Fragment, { children: [periods && (jsx("div", { className: 'i-timepicker-list', children: jsx(Items, { items: periods, active: period, onClick: (p) => handleSetTime(p, "period") }) })), jsx("div", { className: 'i-timepicker-list', children: jsx(Items, { items: hours, active: hour, unit: 'hour', renderItem: renderItem, onClick: (h) => handleSetTime(h, "hour") }) })] })), minutes.length > 0 && (jsx("div", { className: 'i-timepicker-list', children: jsx(Items, { items: minutes, active: minute, unit: 'minute', renderItem: renderItem, onClick: (m) => handleSetTime(m, "minute") }) })), seconds.length > 0 && (jsx("div", { className: 'i-timepicker-list', children: jsx(Items, { items: seconds, active: second, unit: 'second', renderItem: renderItem, onClick: (s) => handleSetTime(s, "second") }) }))] }));
}

const FORMAT = "hh:mm:ss";
function TimePicker(props) {
    const { name, value, format = FORMAT, periods, placeholder = props.format ?? FORMAT, className, renderItem, onChange, onBlur, popupProps, ...restProps } = props;
    const [timeValue, setTimeValue] = useState(value);
    const [safeValue, setSafeValue] = useState(undefined);
    const [active, setActive] = useState(false);
    const handleChange = (v) => {
        setTimeValue(v);
    };
    const handleFallback = (v) => {
        setSafeValue(v);
    };
    const handleValidTime = () => {
        if (!timeValue)
            return;
        setTimeValue(safeValue);
    };
    const handleBlur = (e) => {
        onBlur?.(e);
        handleValidTime();
    };
    const handleVisibleChange = (v) => {
        popupProps?.onVisibleChange?.(v);
        setActive(v);
    };
    useEffect(() => {
        setTimeValue(value);
    }, [value]);
    return (jsx(Popup, { visible: active, trigger: 'click', position: 'bottom', arrow: false, align: 'start', ...popupProps, onVisibleChange: handleVisibleChange, content: jsx(Panel, { value: timeValue, format: format, periods: periods, renderItem: renderItem, onChange: handleChange, onFallback: handleFallback }), children: jsx(Input, { value: timeValue, placeholder: placeholder, append: jsx(Icon, { icon: jsx(AccessTimeRound, {}), className: 'i-timepicker-icon', size: '1em' }), onChange: handleChange, onBlur: handleBlur, className: classNames("i-timepicker-label", className), ...restProps }) }));
}

const defaultOk = {
    children: "确定",
};
const defaultCancel = {
    children: "取消",
    flat: true,
};
const Popconfirm = (props) => {
    const { trigger = "click", visible, icon = jsx(Icon, { icon: jsx(InfoOutlined, {}), className: "error", size: "1.2em" }), content, okButtonProps, cancelButtonProps, children, align, position = "top", offset = 12, extra, onOk, onClose, ...restProps } = props;
    const state = useReactive({
        loading: false,
        visible,
    });
    const ok = okButtonProps
        ? Object.assign({}, defaultOk, okButtonProps)
        : defaultOk;
    const cancel = cancelButtonProps
        ? Object.assign({}, defaultCancel, cancelButtonProps)
        : defaultCancel;
    const handleVisibleChange = (v) => {
        state.visible = v;
        restProps.onVisibleChange?.(v);
    };
    const handleOk = async (e) => {
        state.loading = true;
        ok.onClick?.(e);
        try {
            await onOk?.();
            state.visible = false;
        }
        finally {
            state.loading = false;
        }
    };
    const handleCancel = async (e) => {
        cancel.onClick?.(e);
        await onClose?.();
        state.visible = false;
    };
    const popconfirmContent = (jsxs("div", { className: "i-popconfirm", children: [jsxs(Flex, { gap: ".5em", children: [icon, jsx("div", { className: "i-popconfirm-content", children: content })] }), jsxs(Flex, { gap: 12, justify: "flex-end", className: "i-popconfirm-footer", children: [cancelButtonProps !== null && (jsx(Button, { ...cancel, onClick: handleCancel })), extra, okButtonProps !== null && (jsx(Button, { loading: state.loading, ...ok, onClick: handleOk }))] })] }));
    return (jsx(Popup, { content: popconfirmContent, ...restProps, trigger: trigger, visible: state.visible, align: align, offset: offset, position: position, onVisibleChange: handleVisibleChange, children: children }));
};

function RadioItem(props) {
    const { type = "default", name, value, checked, disabled, children, onChange, } = props;
    const isChildrenFn = typeof children === "function";
    const handleChange = (e) => {
        onChange?.(value, e);
    };
    return (jsxs("label", { className: classNames("i-radio-item", {
            disabled,
            "i-radio-item-custom": isChildrenFn,
        }), children: [jsx("input", { type: 'radio', name: name, checked: checked, className: classNames("i-radio-input", `i-radio-${type}`), disabled: disabled, hidden: isChildrenFn, onChange: handleChange }), isChildrenFn ? (children(!!checked, value)) : (jsx("span", { className: 'i-radio-text', children: children }))] }));
}

function Radio(props) {
    const { label, name, options, value, type = "default", status = "normal", message, optionInline = true, labelInline, disabled, required, className, renderItem, onChange, } = props;
    const [selectedValue, setSelectedValue] = useState(value);
    const formattedOptions = useMemo(() => formatOption(options), [options]);
    const handleChange = (value, e) => {
        setSelectedValue(value);
        onChange?.(value, e);
    };
    useEffect(() => {
        setSelectedValue(value);
    }, [value]);
    return (jsxs("div", { className: classNames("i-radio i-input-label", {
            [`i-radio-${status}`]: status !== "normal",
            "i-input-inline": labelInline,
        }, className), children: [label && (jsxs("span", { className: 'i-input-label-text', children: [required && jsx("span", { className: 'error', children: "*" }), label, message && jsx("p", { className: 'i-radio-message', children: message })] })), jsx("div", { className: classNames("i-radio-options", {
                    "i-options-block": !optionInline,
                    "i-radio-options-button": type === "button",
                }), children: formattedOptions.map((option) => {
                    const checked = selectedValue === option.value;
                    return (jsx(RadioItem, { name: name, value: option.value, checked: checked, type: type, disabled: disabled || option.disabled, onChange: handleChange, children: renderItem ?? option.label }, option.value));
                }) })] }));
}
Radio.Item = RadioItem;

const Resizable = (props) => {
    const { other, children, vertical, height, size = "auto", minSize = 0, maxSize = "100%", style, line, className, asPercent, onResize, onResizeComplete, } = props;
    const state = useReactive({
        size,
        resizing: false,
        start: 0,
        total: 0,
    });
    const ref = useRef(null);
    const handleMouseDown = () => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect)
            return;
        state.resizing = true;
        if (vertical) {
            state.total = rect.height;
            state.start = rect.top;
            return;
        }
        state.total = rect.width;
        state.start = rect.left;
    };
    const handleMouseMove = (e) => {
        if (!state.resizing)
            return;
        e.preventDefault();
        if (e.touches) {
            e = e.touches[0];
        }
        const d = e[vertical ? "pageY" : "pageX"];
        const offset = d - state.start;
        state.size = asPercent ? `${(offset / state.total) * 100}%` : offset;
        onResize?.(state.size);
    };
    const handleMouseUp = () => {
        if (!state.resizing)
            return;
        state.resizing = false;
        onResizeComplete?.(state.size);
    };
    useMouseUp(handleMouseUp);
    useMouseMove(handleMouseMove);
    return (jsxs("div", { ref: ref, className: classNames("i-resizable", className, {
            [`i-resizable-vertical`]: vertical,
        }), style: { ...style, height }, children: [jsx("div", { className: 'i-resizable-a', style: {
                    [vertical ? "height" : "width"]: state.size,
                    [vertical ? "minHeight" : "minWidth"]: minSize,
                    [vertical ? "maxHeight" : "maxWidth"]: maxSize,
                }, children: other }), jsx("div", { className: classNames("i-resizable-line", {
                    [`i-resizable-resizing`]: state.resizing,
                }), onMouseDown: handleMouseDown, onTouchStart: handleMouseDown, onContextMenu: (e) => e.preventDefault(), children: jsx("div", { className: 'i-resizable-line-node', children: line }) }), jsx("div", { className: 'i-resizable-b', children: children })] }));
};

const River = (props) => {
    const { children, className, speed = 1, pauseOnHover, ...restProps } = props;
    const trackRef = useRef(null);
    const state = useReactive({
        initialized: false,
        offset: 0,
        queue: [],
        paddingLeft: 0,
        pause: false,
    });
    const rafRef = useRef(null);
    const sizeRef = useRef([]);
    const [items, length] = useMemo(() => {
        const nodes = Children.toArray(children);
        return [nodes, nodes.length];
    }, [children]);
    const animate = () => {
        if (!trackRef.current)
            return;
        let next = state.offset - speed;
        const d = Math.abs(next);
        const [head, ...restQueue] = state.queue;
        const size = sizeRef.current.at(head % length) ?? 0;
        if (d > size) {
            const tail = state.queue.at(-1);
            const newQueue = [...restQueue, tail + 1];
            state.queue = newQueue;
            next += size;
        }
        state.offset = next;
        if (!state.pause) {
            rafRef.current = requestAnimationFrame(animate);
        }
    };
    const cancelRaf = () => {
        if (!rafRef.current)
            return;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    };
    const handleMouseOver = () => {
        if (!pauseOnHover)
            return;
        state.pause = true;
        cancelRaf();
    };
    const handleMouseLeave = () => {
        if (!pauseOnHover)
            return;
        state.pause = false;
        rafRef.current = requestAnimationFrame(animate);
    };
    useLayoutEffect(() => {
        if (!trackRef.current)
            return;
        const pa = trackRef.current.offsetParent;
        const parentWidth = pa.offsetWidth;
        const nodes = Array.from(trackRef.current.childNodes);
        const length = nodes.length;
        if (length < 2)
            return;
        let contentWidth = trackRef.current.scrollWidth;
        let count = 0;
        const tails = [];
        const sizes = nodes.map((node) => {
            return node.offsetWidth;
        });
        sizeRef.current = sizes;
        while (contentWidth < parentWidth) {
            const w = sizes.at(count % length) ?? 0;
            tails.push(length + count);
            contentWidth += w;
            count += 1;
        }
        state.offset = -1 * sizes.at(-1);
        state.queue = [-1, ...sizes.map((_, i) => i), ...tails];
        animate();
        state.initialized = true;
        return () => {
            state.queue = [];
            state.initialized = false;
            state.offset = 0;
            cancelRaf();
        };
    }, [children]);
    return (jsx("div", { ...restProps, className: classNames("i-river", {
            "i-river-initialized": state.initialized,
        }, className), children: jsxs("div", { ref: trackRef, className: 'i-river-track', style: {
                transform: `translate3d(${state.offset}px, 0, 0)`,
                paddingLeft: state.paddingLeft,
            }, onMouseOver: handleMouseOver, onMouseLeave: handleMouseLeave, children: [!state.initialized &&
                    Children.map(children, (item, i) => {
                        return (jsx("div", { className: 'i-river-item', children: item }, i));
                    }), state.initialized &&
                    state.queue.map((index) => {
                        return (jsx("div", { className: 'i-river-item', children: items.at(index % items.length) }, index));
                    })] }) }));
};

function Divider() {
    return jsx("i", { className: 'i-step-divider' });
}

const STATUS = ["finished", "active", "pending"];
function defaultRenderIcon(i, status) {
    return (jsx("span", { className: 'i-step-item-index', children: status === "finished" ? (jsx(CheckRound, { style: { width: "1em", height: "1.5em" } })) : (i + 1) }));
}
function Item$2(props) {
    const { index = 0, active = 0, renderIcon = defaultRenderIcon, title, vertical, line = jsx(Divider, {}), asList, style, className, children, onClick, } = props;
    const status = STATUS[index === active ? 1 : index < active ? 0 : 2];
    const handleClick = () => {
        onClick?.(index);
    };
    return (jsx("div", { style: style, className: classNames("i-step-item", {
            [`i-step-item-${status}`]: !asList,
        }, className), onClick: handleClick, children: vertical ? (jsxs(Fragment, { children: [jsxs("div", { className: 'i-step-item-left', children: [renderIcon?.(index, status), line] }), jsxs("div", { className: 'i-step-item-right', children: [jsx("div", { className: 'i-step-item-title', children: title }), children && (jsx("div", { className: 'i-step-item-content', children: children }))] })] })) : (jsxs(Fragment, { children: [jsxs("div", { className: 'i-step-item-title', children: [renderIcon?.(index, status), jsx("span", { children: title }), line] }), children && (jsx("div", { className: 'i-step-item-content', children: children }))] })) }));
}

const Step = (props) => {
    const { active = 0, vertical, renderIcon, line, style, asList, className, children, onClick, } = props;
    const steps = useMemo(() => {
        const nodes = [];
        let index = 0;
        Children.map(children, (el) => {
            if (!el || el.type !== Item$2)
                return;
            const { props: elProps } = el;
            nodes.push({
                ...el,
                props: {
                    renderIcon,
                    line,
                    onClick,
                    ...elProps,
                    vertical,
                    active,
                    asList,
                    index: index++,
                },
            });
        });
        return nodes;
    }, [active, children]);
    return (jsx("div", { className: classNames("i-step", { "i-step-vertical": vertical }, className), style: style, children: steps }));
};
Step.Item = Item$2;

function Item$1(props) {
    const { index = 0, itemIndex = 0, active, type, transition, gap = 0, itemHeight, vertical, style, className, children, onItemClick, } = props;
    const selfStyle = useMemo(() => {
        if (type === "normal") {
            return {
                [vertical ? "paddingBlock" : "paddingInline"]: gap / 2,
                height: itemHeight,
            };
        }
        return {
            transform: `translate(-${index * 100}%, 0)`,
            transition,
        };
    }, [index, gap, itemHeight, vertical, type]);
    return (jsx("div", { style: { ...style, ...selfStyle }, className: classNames("i-swiper-item", className, {
            "i-swiper-active": active,
        }), "data-index": itemIndex, onClick: (e) => onItemClick?.(itemIndex, e), children: children }));
}

const Swiper = ((props) => {
    const { ref, type = "normal", initial = 0, display = 1, scroll = 1, loop = true, vertical, prev = jsx(Icon, { icon: jsx(KeyboardArrowLeftRound, {}), size: '2em' }), next = jsx(Icon, { icon: jsx(KeyboardArrowRightRound, {}), size: '2em' }), duration = 600, interval = 3000, autoplay, pauseOnHover, arrow = true, reverse, draggable, dragOffset = 40, gap = 0, itemHeight, indicator, fixedIndicator, style, className, children, renderIndicator, onBeforeSwipe, onAfterSwipe, onItemClick, } = props;
    const listRef = useRef(null);
    const timerRef = useRef(null);
    const transition = `all ${duration / 1000}s`;
    const state = useReactive({
        current: initial,
        swipable: true,
        transition: type === "fade" ? "none" : transition,
        dragStart: 0,
        dragging: false,
        initialized: false,
    });
    const items = useMemo(() => {
        return Children.map(children, (node) => {
            if (node.type !== Item$1)
                return;
            return node;
        });
    }, [children]);
    const [displayItems, extra, size, total, listSize] = useMemo(() => {
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
    const offsetPercent = useMemo(() => (-100 * (state.current + extra)) / total, [state.current, total]);
    const position = useMemo(() => {
        if (size <= display || type === "fade")
            return;
        const offset = vertical
            ? `0, ${offsetPercent}%`
            : `${offsetPercent}%, 0`;
        return `translate3d(${offset}, 0)`;
    }, [offsetPercent, vertical, display, size, type]);
    const trackStyle = useMemo(() => {
        if (!vertical || !itemHeight)
            return;
        return {
            height: itemHeight * display,
        };
    }, [vertical, itemHeight, display]);
    const indicatorsLoop = useMemo(() => {
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
            next = clamp(next, 0, lastDisplay);
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
    useMouseMove(handleMouseMove);
    useMouseUp(handleMouseUp);
    useImperativeHandle(ref, () => ({
        swipeTo,
        swipeNext,
        swipePrev,
    }));
    useEffect(() => {
        if (!autoplay)
            return;
        timerRef.current = setTimeout(swipeNext, interval);
        return () => {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        };
    }, [autoplay, interval]);
    return (jsxs("div", { style: style, className: classNames("i-swiper", {
            "i-swiper-vertical": vertical,
            "i-swiper-initialized": state.initialized,
        }, className), children: [jsxs("div", { className: 'i-swiper-track', style: trackStyle, onMouseOver: handleMouseOver, onMouseLeave: handleMouseLeave, children: [jsx("div", { ref: listRef, className: classNames("i-swiper-list", {
                            "i-swiper-fade": type === "fade",
                        }), style: {
                            [vertical ? "height" : "width"]: listSize,
                            transform: position,
                            transition: state.transition,
                        }, onMouseDown: handleMouseDown, onTouchStart: handleMouseDown, children: displayItems.map((item, i) => {
                            const { props: itemProps } = item;
                            return (jsx(Item$1, { index: i, itemIndex: (i - extra + size) % size, active: i - extra === state.current, type: type, gap: gap, transition: transition, itemHeight: itemHeight, vertical: vertical, onItemClick: onItemClick, ...itemProps }, i));
                        }) }), arrow && size > 1 && (jsxs(Fragment, { children: [(loop || state.current !== 0) && (jsx("a", { className: 'i-swiper-arrow i-swiper-prev', onClick: swipePrev, children: prev })), (loop || state.current < size - display) && (jsx("a", { className: 'i-swiper-arrow i-swiper-next', onClick: swipeNext, children: next }))] }))] }), indicator && (jsx("div", { className: classNames("i-swiper-indicators", {
                    "i-swiper-indicators-fixed": fixedIndicator,
                }), children: indicatorsLoop.map((_, i) => {
                    return (jsx("a", { className: classNames("i-swiper-indicator", {
                            "i-indicator-active": i ===
                                Math[loop ? "floor" : "ceil"](((state.current + size) % size) /
                                    scroll),
                        }), onClick: () => swipeTo(i * scroll), children: renderIndicator?.(i) }, i));
                }) }))] }));
});
Swiper.Item = Item$1;

const Item = (props) => {
    return jsx(Fragment, {});
};

const Tabs = ((props) => {
    const { ref, active, tabs: items, type = "default", prepend, append, children, className, vertical, toggable, navsJustify = "start", bar = true, hideMore, barClass, renderMore = () => (jsx(Button, { flat: true, square: true, size: "small", children: jsx(Icon, { icon: jsx(MoreHorizRound, {}) }) })), onTabChange, ...rest } = props;
    const navRefs = useRef([]);
    const barRef = useRef(null);
    const navsRef = useRef(null);
    const contentsRef = useRef(new Map());
    const [activeKey, setActiveKey] = useState(active);
    const [prevActiveKey, setPrevActiveKey] = useState(undefined);
    const [barStyle, setBarStyle] = useState({});
    const [cachedTabs, setCachedTabs] = useState([]);
    const [overflow, setOverflow] = useState(false);
    const [tabs, setTabs] = useState([]);
    const { observe, unobserve } = useIntersectionObserver();
    const size = useSize(navsRef);
    const tabsRef = useRef(tabs);
    tabsRef.current = tabs;
    const activeKeyRef = useRef(activeKey);
    activeKeyRef.current = activeKey;
    const prevActiveKeyRef = useRef(prevActiveKey);
    prevActiveKeyRef.current = prevActiveKey;
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
    useEffect(() => {
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
    useEffect(() => {
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
    useEffect(() => {
        if (active === undefined || activeKey === active)
            return;
        open(active);
    }, [active]);
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
    }, [vertical]);
    useImperativeHandle(ref, () => ({
        open,
        close,
        add,
        navs: navsRef,
    }));
    const moreTabs = !hideMore && overflow
        ? tabs.filter((tab) => tab.intersecting === false)
        : [];
    return (jsxs("div", { className: classNames("i-tabs", { flex: vertical, [`i-tabs-${type}`]: type !== "default" }, className), ...rest, children: [jsxs("div", { className: classNames("i-tab-navs-container", {
                    "i-tab-navs-vertical": vertical,
                }), children: [prepend, jsxs("div", { ref: navsRef, className: classNames("i-tab-navs", `justify-${navsJustify}`), role: "tablist", "aria-orientation": vertical ? "vertical" : "horizontal", children: [tabs.map((tab, i) => {
                                const { title, key = `${i}`, closable } = tab;
                                const isActive = activeKey === key;
                                return (jsxs("a", { ref: (ref) => (navRefs.current[i] = ref), className: classNames("i-tab-nav", {
                                        "i-tab-active": isActive,
                                    }), role: "tab", tabIndex: isActive ? 0 : -1, "aria-selected": isActive, onClick: () => open(key), onKeyDown: (e) => handleKeyAction(e, () => open(key)), children: [title, closable && (jsx(Helpericon, { as: "i", active: true, className: "i-tab-nav-close", role: "button", tabIndex: 0, "aria-label": "\u5173\u95ED\u6807\u7B7E\u9875", onClick: (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                close(key);
                                            }, onKeyDown: (e) => handleKeyAction(e, () => close(key)) }))] }, key));
                            }), bar && (jsx("span", { ref: barRef, className: classNames("i-tab-navs-bar", barClass), style: barStyle }))] }), !hideMore && overflow && moreTabs.length > 0 && (jsx(Popup, { arrow: false, position: vertical ? "right" : "bottom", align: "end", touchable: true, hideDelay: 500, content: jsx("div", { className: "i-tabs-morelist pd-4", children: moreTabs.map((tab, i) => {
                                const { key = `${i}`, title } = tab;
                                const isActive = activeKey === key;
                                return (jsx("a", { className: classNames("i-tab-nav", {
                                        "i-tab-active": isActive,
                                    }), role: "button", tabIndex: 0, onClick: () => handleMoreTabClick(key), onKeyDown: (e) => handleKeyAction(e, () => handleMoreTabClick(key)), children: title }, key));
                            }) }), children: renderMore(moreTabs) })), append] }), jsx("div", { className: "i-tab-contents", children: tabs.map((tab, i) => {
                    const key = tab.key ?? `${i}`;
                    const content = contentsRef.current.get(key);
                    const isActive = activeKey === key;
                    const show = isActive ||
                        (key !== undefined && cachedTabs.includes(key));
                    return (show && (jsx("div", { className: classNames("i-tab-content", {
                            "i-tab-active": isActive,
                        }), role: "tabpanel", "aria-hidden": !isActive, children: content }, key)));
                }) })] }));
});
Tabs.Item = Item;

function TreeList(props) {
    const { data = [], depth = 0, round, style, className, parent, nodeProps, ...restProps } = props;
    const contents = data.map((item, i) => {
        const { type } = item;
        const title = item[nodeProps.title];
        const itemKey = item[nodeProps.key] ||
            (parent?.key !== undefined ? `${parent.key}-${i}` : `${i}`);
        item.key = itemKey;
        item.parent = parent;
        if (type === "title") {
            return (jsx("div", { className: 'i-tree-group-title', children: title }, i));
        }
        if (type && type !== "item") {
            return (jsx("div", { className: `i-tree-type-${type}`, children: title }, i));
        }
        return (jsx(TreeItem, { index: i, item: item, depth: depth, nodeProps: nodeProps, ...restProps }, itemKey));
    });
    if (depth > 0)
        return jsx(Fragment, { children: contents });
    return (jsx("div", { className: classNames("i-tree", className, {
            "i-tree-round": round,
        }), style: style, children: contents }));
}
const Header = (props) => {
    const { as: Tag = "a", href, selected, children, ...restProps } = props;
    const className = classNames("i-tree-item-header", {
        "i-tree-item-selected": selected,
    });
    if (typeof Tag === "string") {
        return (jsx(Tag, { href: href, className: className, ...restProps, children: children }));
    }
    return (jsx(Tag, { to: href || "", className: className, ...restProps, children: children }));
};
const TreeItem = (props) => {
    const { item, depth = 0, index, selected, checked = [], partofs = {}, checkable, nodeProps, renderExtra, onItemClick, onItemSelect, onItemCheck, ...restProps } = props;
    const { as, key = "", href, icon, title, expanded, disabled } = item;
    const children = item[nodeProps.children];
    const [expand, setExpand] = useState(expanded);
    const handleExpand = (e, fromToggle) => {
        if (fromToggle) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (disabled || !children?.length)
            return;
        setExpand((v) => !v);
    };
    const handleItemClick = (e) => {
        if (disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        handleExpand(e);
        onItemClick?.(item, e);
        onItemSelect?.(key, item);
    };
    const handleItemCheck = (checked) => onItemCheck?.(item, checked, []);
    const itemChecked = checked.includes(key);
    return (jsxs("div", { className: classNames("i-tree-item", {
            "i-tree-expand": expand,
        }), children: [jsxs(Header, { as: as, href: href, style: { paddingLeft: `${depth * 1.5 + 0.5}em` }, selected: selected === key, onClick: handleItemClick, children: [checkable && (jsx(Checkbox.Item, { value: itemChecked, partof: !itemChecked && partofs[key], className: 'i-tree-checkbox', onChange: handleItemCheck, onClick: (e) => e.stopPropagation() })), icon && jsx("span", { className: 'i-tree-item-icon', children: icon }), jsx("span", { className: 'i-tree-item-title', children: title }), renderExtra?.(item), children && (jsx(Icon, { icon: jsx(KeyboardArrowDownRound, {}), className: 'i-tree-toggle', onClick: (e) => handleExpand(e, true) }))] }), children?.length && (jsx("div", { className: 'i-tree-item-content', children: jsx(TreeList, { data: children, depth: depth + 1, selected: selected, checkable: checkable, parent: item, partofs: partofs, checked: checked, nodeProps: nodeProps, renderExtra: renderExtra, onItemClick: onItemClick, onItemSelect: onItemSelect, onItemCheck: onItemCheck, ...restProps }) }))] }));
};

const defaultNodeProps = {
    key: "key",
    title: "title",
    children: "children",
};
const Tree = (props) => {
    const { data = [], ref, selected, checked = [], disabledRelated, nodeProps, onItemSelect, onItemCheck, ...restProps } = props;
    const [selectedKey, setSelectedKey] = useState(selected);
    const [checkedKeys, setCheckedKeys] = useState(checked);
    const [partofs, setPartofs] = useState({});
    const nodeMapsRef = useRef(new Map());
    const oNodeProps = Object.assign({}, defaultNodeProps, nodeProps);
    const isChecked = (key) => checkedKeys.includes(key || "");
    const checkItem = (item, checked, direction) => {
        const { key = "", parent, children } = item;
        const shouldChanged = { [key]: checked };
        const partofs = { [key]: false };
        if (disabledRelated)
            return [shouldChanged];
        if (checked) {
            if (parent && direction !== "leaf") {
                const hasUnchecked = parent.children?.some((o) => o.key !== key && !isChecked(o.key));
                const [changes, parts] = checkItem(parent, true, "root");
                if (!hasUnchecked) {
                    Object.assign(shouldChanged, changes);
                }
                Object.assign(partofs, hasUnchecked ? parts : {}, {
                    [parent.key]: true,
                });
            }
            if (children?.length && direction !== "root") {
                children.map((o) => {
                    if (isChecked(o.key))
                        return;
                    const [changes] = checkItem(o, true, "leaf");
                    Object.assign(shouldChanged, changes);
                    partofs[o.key] = false;
                });
            }
            return [shouldChanged, partofs];
        }
        if (parent && direction !== "leaf") {
            const [changes, parts] = checkItem(parent, false, "root");
            Object.assign(shouldChanged, changes);
            const hasChecked = parent.children?.some((o) => isChecked(o.key) && o.key !== key);
            Object.assign(partofs, hasChecked ? {} : parts, {
                [parent.key]: hasChecked,
                [key]: false,
            });
        }
        if (children?.length && direction !== "root") {
            children.map((o) => {
                const [changes] = checkItem(o, false, "leaf");
                if (!isChecked(o.key))
                    return;
                Object.assign(shouldChanged, changes);
                partofs[o.key] = false;
            });
        }
        return [shouldChanged, partofs];
    };
    const handleCheck = (item, checked) => {
        const [shouldChanged, partofs] = checkItem(item, checked);
        const changedKeys = Object.keys(shouldChanged);
        const nextChecked = checked
            ? Array.from(new Set([...checkedKeys, ...changedKeys]))
            : checkedKeys.filter((k) => !changedKeys.includes(k));
        setCheckedKeys(nextChecked);
        setPartofs((p) => ({ ...p, ...partofs }));
        onItemCheck?.(item, checked, nextChecked);
    };
    const handleSelect = (key, item) => {
        if (!props.selectable)
            return;
        setSelectedKey(key);
        onItemSelect?.(key, item);
    };
    useEffect(() => {
        if (selected === undefined)
            return;
        setSelectedKey(selected);
    }, [selected]);
    useEffect(() => {
        nodeMapsRef.current.clear();
        const { key, children } = oNodeProps;
        const recursive = (nodes) => {
            nodes.map((o) => {
                nodeMapsRef.current.set(o[key], o);
                o[children]?.length > 0 && recursive(o[children]);
            });
        };
        recursive(data);
    }, [data]);
    useImperativeHandle(ref, () => {
        return {
            getChecked: () => {
                const items = [];
                checkedKeys.map((k) => {
                    const item = nodeMapsRef.current.get(k);
                    items.push(item);
                });
                return [checkedKeys, items];
            },
            getSelected: () => {
                const item = nodeMapsRef.current.get(selectedKey);
                return [selectedKey, item];
            },
            getPartofs: () => {
                const items = [];
                const keys = Object.keys(partofs).filter((k) => {
                    const indeterminate = partofs[k];
                    if (indeterminate) {
                        const item = nodeMapsRef.current.get(k);
                        items.push(item);
                    }
                    return indeterminate;
                });
                return [keys, items];
            },
        };
    });
    return (jsx(TreeList, { data: data, selected: selectedKey, checked: checkedKeys, partofs: partofs, nodeProps: oNodeProps, onItemCheck: handleCheck, onItemSelect: handleSelect, ...restProps }));
};

const ListContainer = (props) => {
    const { sortable, onSortEnd, itemProps, ...restProps } = props;
    const customProps = {
        className: "i-upload-list",
        onClick: (e) => {
            e.stopPropagation();
            e.preventDefault();
        },
    };
    if (!sortable) {
        return jsx("div", { ...customProps, ...restProps });
    }
    return (jsx(SortableContainer, { draggedItemClassName: 'i-upload-item-dragged', onSortEnd: onSortEnd, ...customProps, ...restProps }));
};
const FileListItem = (props) => {
    const { ref, mode, index, file, renderItem, onRemove, onPreview } = props;
    if (!file)
        return "";
    const { id, name, size, url, src } = file;
    const type = getFileType(name, file.type);
    if (renderItem) {
        return renderItem(file, index);
    }
    const CloseBtn = (jsx(Helpericon, { active: true, className: 'i-upload-delete', onClick: (e) => {
            e.stopPropagation();
            e.preventDefault();
            onRemove(index);
        } }));
    switch (mode) {
        case "card":
            let node = jsx(Fragment, {});
            switch (type) {
                case TFileType.IMAGE:
                    node = (jsx(MemoImage, { lazyload: true, src: url || src, fit: 'cover', onMouseDown: (e) => e.preventDefault() }));
                    break;
                case TFileType.VIDEO:
                    node = jsx("video", { src: url || src, preload: 'none' });
                    break;
                default:
                    node = (jsxs(Fragment, { children: [jsx(Icon, { icon: jsx(ListAltRound, {}) }), jsx("span", { className: 'i-upload-file-name', children: title(name) })] }));
                    break;
            }
            return (jsxs("div", { ref: ref, title: name, className: 'i-upload-item-card', onClick: () => onPreview?.(index), children: [node, CloseBtn] }));
        default:
            return (jsxs("div", { ref: ref, className: 'i-upload-item', onClick: () => onPreview?.(index), children: [jsx("span", { children: name }), jsx("i", { className: 'i-upload-size', children: formatBytes(size ?? 0) }), CloseBtn] }, id));
    }
};

const Upload = (props) => {
    const { ref, label, labelInline, value, files = [], initialFiles, placeholder, status = "normal", message, className, style, children, defaultButtonProps, mode = "default", cardSize = "4em", disabled, sortable, limit = props.multiple ? Infinity : 1, multiple, renderItem, shouldUpload = () => true, uploader, onChange, onFilesChange, onUpload, ...restProps } = props;
    const [fileList, setFileListState] = useState(files);
    const [uploadMessage, setUploadMessage] = useState(message);
    const inputRef = useRef(null);
    const preview = usePreview();
    const defBtnProps = Object.assign({
        children: (jsxs(Fragment, { children: [jsx(Icon, { icon: jsx(DriveFolderUploadOutlined, {}) }), " \u4E0A\u4F20"] })),
    }, defaultButtonProps);
    const trigger = useMemo(() => {
        if (children)
            return children;
        switch (mode) {
            case "card":
                return (jsx(Button, { className: 'i-upload-card-btn color-5', square: true, flat: true, outline: true, disabled: disabled, children: jsx(Icon, { icon: jsx(PlusSharp, {}) }) }));
            default:
                return (jsx(Button, { ...defBtnProps, className: classNames("i-upload-btn", defBtnProps.className), disabled: disabled }));
        }
    }, [mode, children]);
    const handleChange = (e) => {
        const files = Array.from(e.target.files || []);
        const before = fileList;
        const changed = [];
        files.map((f) => {
            const { id, name, size, type } = f;
            const same = before.find((pf) => {
                const { name: n, size: s, type: t } = pf;
                return n === name && s === size && t === type;
            });
            const src = URL.createObjectURL(f);
            Object.assign(f, {
                id: id ?? uid(7),
                src: src ?? f.name,
                url: src ?? f.name,
            });
            !same && changed.push(f);
        });
        const after = [...before, ...changed];
        const last = after.at(-1);
        const nextFiles = multiple ? after.slice(0, limit) : last ? [last] : [];
        setFileListState(nextFiles);
        setUploadMessage(message);
        onFilesChange?.(nextFiles, changed, e);
        onChange?.(nextFiles, e);
        handleUpload(changed);
        inputRef.current && (inputRef.current.value = "");
    };
    const handleRemove = (i) => {
        const [...files] = fileList;
        const changed = files.splice(i, 1);
        URL.revokeObjectURL(changed[0]?.src || "");
        setFileListState(files);
        onFilesChange?.(files, changed);
        onChange?.(files);
        inputRef.current && (inputRef.current.value = "");
    };
    const handleUpload = async (files) => {
        if (!uploader)
            return;
        const shouldUploadFiles = files.filter(shouldUpload);
        const result = Promise.all(shouldUploadFiles.map(uploader));
        return onUpload?.(result);
    };
    const handlePreview = (i) => {
        preview({ items: fileList, initial: i });
    };
    const setFileList = (files) => {
        if (!files)
            return;
        setFileListState(files.map((f) => {
            const file = f;
            return { ...file, id: file.id ?? uid(7) };
        }));
    };
    const handleSortEnd = (before, after) => {
        const [...files] = fileList;
        const nextFiles = arrayMove(files, before, after);
        setFileListState(nextFiles);
        onChange?.(nextFiles);
    };
    useEffect(() => {
        setUploadMessage(message);
    }, [status, message]);
    useEffect(() => {
        setFileListState(value?.filter?.((file) => !!file.id) ?? []);
    }, [value]);
    useEffect(() => {
        setFileList(initialFiles);
    }, []);
    useImperativeHandle(ref, () => ({
        getFileList: () => fileList,
        setFileList,
    }), [fileList]);
    return (jsx(InputContainer, { as: 'div', label: label, labelInline: labelInline, className: classNames("i-input-label-file", className), style: style, children: jsxs("div", { className: classNames("i-upload-inner", {
                [`i-upload-${mode}`]: mode !== "default",
            }), style: { ["--upload-card-size"]: cardSize }, children: [jsx(ListContainer, { sortable: sortable, onSortEnd: handleSortEnd, children: fileList.map((file, i) => {
                        const node = (jsx(FileListItem, { index: i, file: file, mode: mode, renderItem: renderItem, onRemove: handleRemove, onPreview: handlePreview }, i));
                        if (!sortable)
                            return node;
                        return jsx(SortableItem, { children: node }, i);
                    }) }), uploadMessage && (jsx("span", { className: 'i-upload-message', children: uploadMessage })), fileList.length < limit && (jsxs("label", { children: [jsx("input", { ...restProps, disabled: disabled, ref: inputRef, type: 'file', className: 'i-input-file-hidden', multiple: multiple, onChange: handleChange }), trigger] }))] }) }));
};

const stores = new Map();
function readTheme(key, defaultValue) {
    if (typeof window === "undefined")
        return defaultValue;
    const raw = window.localStorage.getItem(key);
    if (raw === null)
        return defaultValue;
    try {
        return JSON.parse(raw);
    }
    catch {
        return raw;
    }
}
function writeTheme(key, value) {
    if (typeof window === "undefined")
        return;
    if (value === undefined) {
        window.localStorage.removeItem(key);
    }
    else {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
}
function applyThemeToDocument(theme) {
    if (typeof document === "undefined")
        return;
    if (!theme)
        return;
    const cls = document.documentElement.classList;
    const prev = Array.from(cls).find((n) => n.startsWith("theme-"));
    if (prev) {
        if (prev !== theme)
            cls.replace(prev, theme);
    }
    else {
        cls.add(theme);
    }
}
function ensureStore(key, defaultValue) {
    const existed = stores.get(key);
    if (existed) {
        return existed;
    }
    const theme = readTheme(key, defaultValue);
    const store = {
        key,
        defaultValue,
        theme,
        listeners: new Set(),
        storageSubscribers: 0,
    };
    stores.set(key, store);
    applyThemeToDocument(theme);
    return store;
}
function notify(store) {
    for (const listener of store.listeners) {
        listener(store.theme);
    }
}
function setStoreTheme(store, value) {
    const prev = store.theme;
    const next = typeof value === "function"
        ? value(prev)
        : value;
    const resolved = next ?? store.defaultValue;
    if (resolved === store.theme)
        return;
    store.theme = resolved;
    writeTheme(store.key, next);
    applyThemeToDocument(resolved);
    notify(store);
}
function ensureStorageListener(store) {
    if (typeof window === "undefined")
        return;
    if (store.storageListener)
        return;
    store.storageListener = (e) => {
        if (e.key !== store.key)
            return;
        if (e.newValue === null) {
            store.theme = store.defaultValue;
            applyThemeToDocument(store.theme);
            notify(store);
            return;
        }
        try {
            store.theme = JSON.parse(e.newValue);
        }
        catch {
            store.theme = e.newValue;
        }
        applyThemeToDocument(store.theme);
        notify(store);
    };
    window.addEventListener("storage", store.storageListener);
}
function cleanupStorageListener(store) {
    if (typeof window === "undefined")
        return;
    if (store.storageSubscribers > 0)
        return;
    if (!store.storageListener)
        return;
    window.removeEventListener("storage", store.storageListener);
    store.storageListener = undefined;
}
const useTheme = (props) => {
    const { key = "ioca-react-theme", defaultValue = "theme-auto", listenStorageChange, } = props ?? {};
    if (typeof window === "undefined") {
        return {
            theme: defaultValue,
            setTheme: () => { },
        };
    }
    const store = useMemo(() => ensureStore(key, defaultValue), [key]);
    const [theme, setThemeState] = useState(() => store.theme);
    useEffect(() => {
        store.defaultValue = defaultValue;
        applyThemeToDocument(store.theme);
    }, [store, defaultValue]);
    useEffect(() => {
        store.listeners.add(setThemeState);
        setThemeState(store.theme);
        if (listenStorageChange) {
            store.storageSubscribers += 1;
            ensureStorageListener(store);
        }
        return () => {
            store.listeners.delete(setThemeState);
            if (listenStorageChange) {
                store.storageSubscribers = Math.max(0, store.storageSubscribers - 1);
                cleanupStorageListener(store);
            }
        };
    }, [store, listenStorageChange]);
    const setTheme = (value) => {
        setStoreTheme(store, value);
    };
    return {
        theme,
        setTheme,
    };
};

export { Affix, Badge, Button, Card, Checkbox, Collapse, ColorPicker, Datagrid, Datepicker as DatePicker, Description, Drawer, Dropdown, Editor, Flex, Form, Icon, MemoImage as Image, Input, List$1 as List, Loading, message as Message, Modal, Pagination, Popconfirm, Popup, Progress, Radio, Resizable, River, Select, Step, Swiper, Tabs, Tag, Text, TimePicker, Tree, Upload, Video, usePreview, useTheme };
