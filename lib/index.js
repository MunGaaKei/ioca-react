import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import classNames from 'classnames';
import { debounce, uid, throttle, pick, title } from 'radash';
import { useMemo, Children, cloneElement, useEffect, createElement, isValidElement, useState, useRef, Fragment as Fragment$1, useTransition, useLayoutEffect, useImperativeHandle, createContext, useContext } from 'react';
import { SkipPreviousRound, CloseRound, MinusRound, PlusRound, InboxTwotone, FormatBoldRound, FormatItalicRound, FormatUnderlinedRound, StrikethroughSRound, RedoRound, UndoRound, ClearAllRound, PauseRound, PlayArrowRound, StopRound, VolumeOffRound, VolumeDownRound, FullscreenExitRound, FullscreenRound, FeedOutlined, AspectRatioRound, OpenInNewRound, FileDownloadOutlined, RotateRightRound, RotateLeftRound, KeyboardArrowLeftRound, KeyboardArrowRightRound, HideImageTwotone, SyncAltRound, VisibilityRound, VisibilityOffRound, MoreHorizRound, SearchRound, CheckRound, UnfoldMoreRound, CalendarMonthTwotone, AccessTimeRound, InfoOutlined, KeyboardArrowDownRound, ListAltRound, DriveFolderUploadOutlined, PlusSharp } from '@ricons/material';
import { useReactive, useCreation, useSize } from 'ahooks';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import xss, { escapeAttrValue } from 'xss';
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

const defaultOk$1 = {
    children: "确定",
    className: "bg-error",
};
const defaultCancel$1 = {
    children: "取消",
    secondary: true,
};
function Confirm(props) {
    const { ref, size, okButtonProps, cancelButtonProps, onOk, onCancel, onClick, ...restProps } = props;
    const state = useReactive({
        active: false,
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
    const state = useReactive({
        active,
        done: true,
    });
    const toggle = async () => {
        const hasAfter = !!after;
        const nextActive = !state.active;
        const canToggle = toggable ? await toggable() : true;
        if (!canToggle)
            return;
        Object.assign(state, {
            active: nextActive,
            done: !hasAfter,
        });
        onToggle?.(nextActive);
        if (!hasAfter)
            return;
        setTimeout(() => {
            state.done = true;
        }, 16);
    };
    const handleClick = (e) => {
        onClick?.(e);
        !disabled && toggle();
    };
    useEffect(() => {
        Object.assign(state, {
            active,
            done: true,
        });
    }, [active]);
    return (jsx(Button, { ref: ref, className: classNames(className, { [activeClass || ""]: state.active }, "i-btn-toggle"), ...restProps, onClick: handleClick, children: jsx("div", { className: classNames("i-btn-toggle-content", {
                "i-btn-toggle-active": state.done,
            }), children: state.active ? after ?? children : children }) }));
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
    const { zero = true, units = ["", ":", ":"] } = options;
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
    const state = useReactive({
        value,
        status,
        message,
    });
    const isChildrenFn = typeof children === "function";
    const handleChange = (e) => {
        const checked = e.target.checked;
        Object.assign(state, {
            value: checked,
            status,
            message,
        });
        onChange?.(checked, e);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    return (jsxs("label", { className: classNames("i-checkbox-item", {
            [`i-checkbox-${state.status}`]: state.status !== "normal",
            disabled,
        }, className), ...restProps, children: [jsx("input", { type: 'checkbox', name: name, className: classNames("i-checkbox-input", {
                    [`i-checkbox-${type}`]: !partof,
                    "i-checkbox-partof": partof,
                }), checked: state.value, disabled: disabled, onChange: handleChange }), isChildrenFn ? (children(state.value, optionValue)) : (jsx("span", { className: 'i-checkbox-text', children: children || label })), state.message && (jsxs("span", { className: 'i-checkbox-message', children: ["*", state.message] }))] }));
}

function Checkbox(props) {
    const { label, name, options = [], value = "", type = "default", optionInline = true, labelInline, disabled, status = "normal", message, required, className, renderItem, onChange, ...restProps } = props;
    const state = useReactive({
        value,
    });
    const formattedOptions = useMemo(() => formatOption(options), [options]);
    const handleChange = (checked, opt, e) => {
        const group = [...state.value];
        const i = group.findIndex((item) => item === opt.value);
        if (checked && i < 0) {
            group.push(opt.value);
        }
        else if (!checked && i > -1) {
            group.splice(i, 1);
        }
        state.value = group;
        onChange?.(group, opt, e);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    return (jsxs("div", { className: classNames("i-checkbox i-input-label", {
            [`i-checkbox-${status}`]: status !== "normal",
            "i-input-inline": labelInline,
        }, className), ...restProps, children: [label && (jsxs("span", { className: 'i-input-label-text', children: [required && jsx("span", { className: 'error', children: "*" }), label, message && jsx("p", { className: 'i-checkbox-message', children: message })] })), jsx("div", { className: classNames("i-checkbox-options", {
                    "i-options-block": !optionInline,
                    "i-checkbox-options-button": type === "button",
                }), children: formattedOptions.map((option) => {
                    return (jsx(CheckboxItem, { name: name, value: state.value.includes(option.value), optionValue: option.value, type: type, disabled: disabled || option.disabled, onChange: (checked, e) => handleChange(checked, option, e), children: renderItem ?? option.label }, option.value));
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
    const state = useReactive({
        active,
    });
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
            state.active = state.active === key ? undefined : key;
            onCollapse?.(key, state.active !== undefined);
            return;
        }
        if (!Array.isArray(state.active))
            state.active = [];
        const i = state.active.findIndex((k) => k === key);
        if (i > -1) {
            state.active.splice(i, 1);
        }
        else {
            key !== undefined && state.active.push(key);
        }
        onCollapse?.(key, i < 0);
    };
    return (jsx("div", { className: classNames("i-collapse", {
            "i-collapse-bordered": border,
        }, className), ...restProps, children: collapses.map((item) => {
            const { key, title, content, disabled, className, ...restProps } = item;
            const isActive = multiple
                ? (state.active || []).includes(key)
                : state.active === key;
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
    const style = getCellStyle({ justify, fixed, col, row, rowSpan });
    return (jsx("div", { className: classNames("i-datagrid-cell", {
            [`i-datagrid-cell-fixed-${fixed}`]: fixed,
        }), "data-col": id, style: style, onClick: (e) => onCellClick?.(data, column, row, col, e), onDoubleClick: (e) => onCellDoubleClick?.(data, column, row, col, e), children: render?.(data[id], data, col) ?? (jsx("div", { className: classNames("i-datagrid-cell-content", {
                "i-datagrid-cell-content-ellipsis": cellEllipsis,
            }), children: data[id] })) }));
}

const MouseMoveEvents = new Set();
const MouseUpEvents = new Set();
const KeydownEvents = new Set();
let initialized = false;
const initEvents = () => {
    if (!document || initialized)
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
const defaultObserver = {
    observe: undefined,
    unobserve: undefined,
    disconnect: undefined,
};
function useIntersectionObserver(configs) {
    if (typeof window === "undefined") {
        return {
            ...defaultObserver,
        };
    }
    const WM = new WeakMap();
    const IO = new IntersectionObserver((entries) => {
        entries.map((entry) => {
            const callback = WM.get(entry.target);
            callback?.(entry.target, entry.isIntersecting);
        });
    }, configs);
    function observe(target, callback) {
        if (WM.get(target))
            return;
        WM.set(target, callback);
        target && IO.observe(target);
    }
    function unobserve(target) {
        target && IO.unobserve(target);
        WM.delete(target);
    }
    function disconnect() {
        IO.disconnect();
    }
    return {
        observe,
        unobserve,
        disconnect,
    };
}
function useResizeObserver() {
    if (typeof window === "undefined") {
        return {
            ...defaultObserver,
        };
    }
    const WM = new WeakMap();
    const IO = new ResizeObserver((entries) => {
        entries.map((entry) => {
            const callback = WM.get(entry.target);
            callback?.(entry.target);
        });
    });
    function observe(target, callback) {
        if (WM.get(target))
            return;
        target && IO.observe(target);
        WM.set(target, callback);
    }
    function unobserve(target) {
        target && IO.unobserve(target);
        WM.delete(target);
    }
    function disconnect() {
        IO.disconnect();
    }
    return {
        observe,
        unobserve,
        disconnect,
    };
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
    const { data = [], columns = [], border, striped, header = true, resizable, cellPadding = ".5em", cellEllipsis, empty = jsx(Empty, {}), loading, height = "unset", style, className, renderLoading = () => jsx(Loading, { size: '1.5em', className: 'color-3' }), onCellClick, onRowClick, onHeaderClick, onSort, onScroll, onResize, } = props;
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
                }), onWheel: onScroll, children: [header && (jsx(Header$1, { columns: columns, resizable: resizable, sortType: state.sortType, sortBy: state.sortBy, cellEllipsis: cellEllipsis, onWidthChange: handleWidthChange, onHeaderClick: handleHeaderClick })), rows.map((row, i) => (jsx(Row, { row: i + (header ? 1 : 0), data: row, cellEllipsis: cellEllipsis, columns: columns, onCellClick: onCellClick, onRowClick: onRowClick }, i))), rows.length < 1 && empty] }), loading && renderLoading()] }));
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

const Content$2 = (props) => {
    const { ref, getContainer = (trigger) => {
        if (typeof document === "undefined")
            return null;
        return trigger?.offsetParent ?? document.body;
    }, trigger, arrow, arrowProps = {}, className, children, ...restProps } = props;
    const arrowCSS = useMemo(() => {
        let { left, top, pos } = arrowProps;
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
    return createPortal(content, getContainer(trigger));
};

function Popup(props) {
    const { visible = false, content, trigger = "hover", gap = 12, offset = 8, fixed, position = "top", showDelay = 16, hideDelay = 12, touchable, arrow = true, align, fitSize, watchResize, clickOutside = true, disabled, referToWindow, style, className, getContainer, children, onVisibleChange, } = props;
    const triggerRef = useRef(null);
    const contentRef = useRef(null);
    const timerRef = useRef(null);
    const statusRef = useRef("");
    const state = useReactive({
        show: false,
        style: { position: fixed ? "fixed" : "absolute" },
        arrowProps: {},
    });
    useMouseUp((e) => {
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
                const [left, top, { arrowX, arrowY, arrowPos }] = getPosition(triggerRef.current, contentRef.current, {
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
    const eventMaps = useCreation(() => ({
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
                    const [left, top] = getPointPosition(e, contentRef.current);
                    state.style = {
                        ...state.style,
                        left,
                        top,
                    };
                    return;
                }
                state.show = true;
                timerRef.current = setTimeout(() => {
                    const [left, top] = getPointPosition(e, contentRef.current);
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
    const computePosition = () => {
        if (!state.show)
            return;
        const [left, top, { arrowX, arrowY, arrowPos }] = getPosition(triggerRef.current, contentRef.current, {
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
    const { observe, unobserve, disconnect } = useResizeObserver();
    useEffect(() => {
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
    useLayoutEffect(() => {
        if (!fitSize || !state.show)
            return;
        const vertical = ["top", "bottom"].includes(position);
        const size = triggerRef.current?.[vertical ? "offsetWidth" : "offsetHeight"];
        state.style = { ...state.style, [vertical ? "width" : "height"]: size };
    }, [state.show, fitSize]);
    useLayoutEffect(() => {
        handleToggle(visible);
    }, [visible]);
    return (jsxs(Fragment, { children: [Children.map(children, (child) => {
                if (!isValidElement(child))
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
                return cloneElement(child, {
                    ref: triggerRef,
                    className,
                    ...restProps,
                    ...eventMaps[trigger],
                });
            }), state.show && (jsx(Content$2, { ref: contentRef, arrow: arrow && trigger !== "contextmenu", style: { ...style, ...state.style }, arrowProps: state.arrowProps, className: className, ...contentTouch, trigger: triggerRef.current, getContainer: getContainer, children: content }))] }));
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
    return (jsx(Popup, { trigger: 'click', position: 'bottom', content: jsx(List$1, { className: 'i-dropdown-content', style: { minWidth: width }, children: typeof content === "function"
                ? content(() => setActive(false))
                : content }), ...restProps, touchable: true, visible: active, onVisibleChange: setActive, children: children }));
};
Dropdown.Item = Item$3;

const exec = (a, b, c) => {
    if (typeof document === "undefined")
        return;
    return document.execCommand(a, b, c);
};
const xssOptions = {
    onIgnoreTagAttr: function (tag, name, value) {
        if (["data-", "style"].includes(name.substr(0, 5))) {
            return name + '="' + escapeAttrValue(value) + '"';
        }
    },
};
const fnMap = {
    bold: {
        icon: jsx(FormatBoldRound, {}),
        onClick: () => exec("bold"),
        tip: "粗体",
    },
    italic: {
        icon: jsx(FormatItalicRound, {}),
        onClick: () => exec("italic"),
        tip: "斜体",
    },
    underline: {
        icon: jsx(FormatUnderlinedRound, {}),
        onClick: () => exec("underline"),
        tip: "下划线",
    },
    strike: {
        icon: jsx(StrikethroughSRound, {}),
        onClick: () => exec("strikeThrough"),
        tip: "删除线",
    },
    redo: {
        icon: jsx(RedoRound, {}),
        onClick: () => exec("redo"),
        tip: "重做",
    },
    undo: {
        icon: jsx(UndoRound, {}),
        onClick: () => exec("undo"),
        tip: "撤销",
    },
    // color: {
    // 	icon: <FormatColorTextRound />,
    // 	onClick: () => exec("foreColor", false, ""),
    // },
    // backColor: {
    // 	icon: <FormatColorFillRound />,
    // 	onClick: () => exec("backColor", false, ""),
    // },
    clear: {
        icon: jsx(ClearAllRound, {}),
        onClick: () => exec("removeFormat"),
        tip: "清除格式",
    },
};
const aliasMap = {
    simple: ["undo", "redo", "bold", "italic", "underline", "strike", "clear"],
    all: Object.keys(fnMap),
};
function getControls(fns, options) {
    const { controlBtnProps } = options;
    const keys = typeof fns === "string" ? aliasMap[fns] : fns;
    return keys.map((k) => {
        if (fnMap[k]) {
            const { icon, render, tip, onClick } = fnMap[k];
            if (render) {
                return render(options);
            }
            return (jsxs(Button, { ...controlBtnProps, onClick: onClick, children: [jsx(Icon, { icon: icon }), tip && jsx("span", { className: 'i-editor-control-tip', children: tip })] }, k));
        }
        return jsx(Fragment, {}, k);
    });
}

const Editor = (props) => {
    const { ref, width, height = "10em", placeholder, autosize, border = true, richPaste, controls = "simple", className, style, onInput, onPaste, onKeyDown, ...restProps } = props;
    const editorRef = useRef(null);
    const controlBtnProps = {
        square: true,
        flat: true,
        size: "small",
    };
    const handlePaste = async (e) => {
        onPaste?.(e);
        if (richPaste)
            return;
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        exec("insertText", false, text);
    };
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        switch (e.key) {
            case "Tab":
                e.preventDefault();
                exec("insertHTML", false, "&#09;");
                break;
            case "Enter":
                e.preventDefault();
                exec("insertLineBreak");
                if (!editorRef.current)
                    return;
                editorRef.current.scrollBy({
                    top: 20,
                    left: -1e3,
                });
                if (!autosize)
                    return;
                editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
                break;
        }
    };
    useImperativeHandle(ref, () => {
        return {
            input: editorRef.current,
            setValue(html) {
                if (!editorRef.current)
                    return;
                const safeHtml = xss(html, xssOptions);
                editorRef.current.innerHTML = safeHtml;
            },
            getSafeValue() {
                const html = editorRef.current?.innerHTML ?? "";
                return xss(html, xssOptions);
            },
        };
    });
    const handleInput = (e) => {
        let html = editorRef.current?.innerHTML ?? "";
        if (["<br>", "\n"].includes(html) && editorRef.current) {
            html = "";
            editorRef.current.innerHTML = html;
        }
        onInput?.(html, e);
    };
    return (jsxs("div", { className: classNames("i-editor", className, {
            "i-editor-borderless": !border,
        }), style: {
            ...style,
            [autosize ? "minHeight" : "height"]: height,
            width,
        }, children: [controls !== "none" && (jsx("div", { className: 'i-editor-controls', children: getControls(controls, {
                    controlBtnProps,
                }) })), jsx("div", { ref: editorRef, className: 'i-editor-content', "data-placeholder": placeholder, contentEditable: true, onPaste: handlePaste, onInput: handleInput, onKeyDown: handleKeyDown, ...restProps })] }));
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
    const state = useReactive({
        value: undefined,
        status: "normal",
        message: undefined,
        update: 0,
    });
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
            const { value, status, message } = state;
            return cloneElement(node, {
                value,
                status,
                message,
                required,
                onChange: (...args) => {
                    handleChange(args[0]);
                    onChange?.(...args);
                    Object.assign(state, {
                        status: "normal",
                        message: undefined,
                    });
                },
            });
        });
    }, [children, state.update]);
    useEffect(() => {
        if (!name)
            return;
        PubSub.subscribe(`${id}:set:${name}`, (evt, v) => {
            state.value = v;
            state.update += 1;
        });
        PubSub.subscribe(`${id}:invalid:${name}`, (evt, v) => {
            Object.assign(state, v);
            state.update += 1;
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
                const { className } = componentProps;
                if (shouldRender && !shouldRender(values, form)) {
                    return jsx(Fragment$1, {}, name);
                }
                return (jsx(Field, { name: name, required: required, children: render?.(config, values) ?? (jsx(El, { label: label, required: required, ...componentProps, className: `${className} ${colspan !== 1
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
    const { form = {}, rules, initialValues, style, className, width, columns = 1, gap = "1em", labelInline, labelWidth, labelRight, children, onKeyDown, onEnter, onChange, ...restProps } = props;
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        if (e.keyCode !== 13)
            return;
        onEnter?.(e, form.data, form);
    };
    const gridColumns = useMemo(() => {
        if (!columns)
            return;
        if (typeof columns === "number")
            return `minmax(0, 1fr) `.repeat(columns);
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
        }, className), style: style, onClick: handleBackdropClick, "aria-modal": 'true', "aria-hidden": !active, children: jsxs("div", { className: classNames("i-modal", {
                bounced,
                shadow: !hideShadow,
            }), style: {
                width,
                height,
            }, onClick: (e) => {
                e.stopPropagation();
                handleClick();
                onClick?.(e);
            }, role: 'dialog', "aria-labelledby": title ? "modal-title" : undefined, ...restProps, children: [customized && children, !customized && (jsx(Content$1, { title: title, hideCloseButton: hideCloseButton, footer: footer, okButtonProps: okButtonProps, cancelButtonProps: cancelButtonProps, children: children, footerLeft: footerLeft, onOk: onOk, onClose: handleHide }))] }) }), document?.body ?? null);
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
            if (mergedProps.closable)
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
    return (jsxs(Fragment, { children: [jsx("div", { ref: box, className: classNames("i-preview-content", {
                    "no-transition": state.dragging,
                }), style: {
                    transform: `translate(${state.translate
                        .map((n) => `${n}px`)
                        .join(",")}) rotate(${state.rotate}deg) scale(${state.scale})`,
                }, onWheel: handleMouseWheel, onMouseDown: handleMouseDown, onClick: (e) => e.stopPropagation(), children: content }), jsxs("div", { className: classNames("i-preview-controls", {
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
            return (jsx(Image, { src: img.src, usePreview: false, onClick: (e) => handleClick(e, i), ...restProps }, i));
        }) }));
}

const Image = (props) => {
    const { src, thumb, round, size, height, width, ratio, initSize, lazyload, fallback = (jsx(Icon, { icon: jsx(HideImageTwotone, {}), size: '2em', className: 'color-5' })), fit, style, className, cover, coverClass, usePreview: previewable, onLoad, onError, onClick, ...restProps } = props;
    const state = useReactive({
        status: "loading",
    });
    const ref = useRef(null);
    const { observe, unobserve } = useIntersectionObserver();
    const preview = usePreview();
    const handleError = (err) => {
        onError?.(err);
        state.status = "error";
    };
    const handleLoad = (e) => {
        onLoad?.(e);
        state.status = undefined;
    };
    const handleClick = (e) => {
        e.stopPropagation();
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
    };
    useEffect(() => {
        if (!src || typeof window === "undefined")
            return;
        if (!ref.current?.complete && observe && lazyload) {
            state.status = "loading";
        }
        if (!lazyload || !ref.current || !observe)
            return;
        observe(ref.current, (tar, visible) => {
            if (!visible)
                return;
            tar.setAttribute("src", tar.dataset.src || "");
            unobserve(tar);
        });
        return () => {
            ref.current && unobserve(ref.current);
        };
    }, [src]);
    restProps[lazyload ? "data-src" : "src"] = thumb ?? src;
    const iSize = state.status === "loading" ? initSize : undefined;
    return (jsx("div", { style: {
            width: width ?? size ?? iSize,
            height: height ?? size ?? iSize,
            aspectRatio: ratio,
            ...style,
        }, className: classNames("i-image", className, {
            rounded: round,
            [`i-image-${state.status}`]: state.status,
        }), onClick: handleClick, children: state.status === "error" ? (fallback) : (jsxs(Fragment, { children: [src && (jsx("img", { ref: ref, style: { objectFit: fit }, ...restProps, onLoad: handleLoad, onError: handleError, onClick: handleClick })), src && state.status === "loading" && jsx(Loading, { absolute: true }), cover && (jsx("div", { className: classNames("i-image-cover", coverClass), onClick: handleClick, children: cover }))] })) }));
};
Image.List = List;

function InputContainer(props) {
    const { as: As = "label", label, className, labelInline, style, children, status, tip, required, } = props;
    return (jsxs(As, { className: classNames("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && (jsxs("span", { className: 'i-input-label-text', children: [required && jsx("span", { className: 'error', children: "*" }), label] })), children, tip && (jsx("span", { className: classNames("i-input-message", {
                    [`i-input-${status}`]: status !== "normal",
                }), children: tip }))] }));
}

const Number$1 = (props) => {
    const { ref, label, name, value = "", labelInline, step = 1, min = -Infinity, max = Infinity, thousand, precision, type, className, width, status = "normal", append, border, prepend, disabled, message, tip, hideControl, style, onChange, onEnter, onInput, onBlur, ...restProps } = props;
    const state = useReactive({
        value,
    });
    const getRangeNumber = (v) => clamp(v, min, max);
    const getFormatNumber = (v) => formatNumber(v, { precision, thousand });
    const formatInputValue = (v) => {
        if (!v)
            return "";
        if (typeof v === "number" || !thousand)
            return v;
        return v.replaceAll(thousand, "");
    };
    const handleChange = (e) => {
        const { value } = e.target;
        const v = formatInputValue(value.replace(/[^\d\.-]/g, ""));
        state.value = v;
        onChange?.(+v, e);
    };
    const handleOperate = (param) => {
        const value = formatInputValue(state.value) ?? 0;
        const result = getRangeNumber(+value + param);
        state.value = getFormatNumber(result);
        onChange?.(result);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    const inputProps = {
        ref,
        name,
        disabled,
        value: state.value,
        className: "i-input i-input-number",
        onChange: handleChange,
        ...restProps,
    };
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, children: jsxs("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
            }), children: [prepend && jsx("div", { className: 'i-input-prepend', children: prepend }), !hideControl && !disabled && (jsx(Helpericon, { active: true, icon: jsx(MinusRound, {}), onClick: () => handleOperate(-step) })), jsx("input", { ...inputProps }), !hideControl && !disabled && (jsx(Helpericon, { active: true, icon: jsx(PlusRound, {}), onClick: () => handleOperate(step) })), append && jsx("div", { className: 'i-input-append', children: append })] }) }));
};

const Range = (props) => {
    const { label, name, value, labelInline, min = -Infinity, max = Infinity, type, className, status = "normal", message, tip, append, prepend, step = 1, width, thousand, precision, hideControl, placeholder, border, autoSwitch, onChange, onBlur, style, ...restProps } = props;
    const state = useReactive({
        value,
    });
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
        const range = Array.isArray(state.value) ? state.value : [];
        range[i] = v;
        state.value = range;
        onChange?.(range, e);
    };
    const handleOperate = (e, param, i) => {
        e.preventDefault();
        e.stopPropagation();
        const range = Array.isArray(state.value) ? state.value : [];
        const value = formatInputValue(range[i]) ?? 0;
        const result = getRangeNumber(+value + param);
        range[i] = getFormatNumber(result);
        state.value = range;
        onChange?.(range, e);
    };
    const handleSwitch = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        const range = state.value ? state.value : [];
        [range[0], range[1]] = [range[1], range[0]];
        state.value = range;
        onChange?.(range);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    const inputProps = {
        name,
        className: "i-input i-input-number",
        ...restProps,
    };
    const handleBlur = () => {
        if (!autoSwitch)
            return;
        const range = Array.isArray(state.value) ? state.value : [];
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
            }), children: [prepend && jsx("div", { className: 'i-input-prepend', children: prepend }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(MinusRound, {}), onClick: (e) => handleOperate(e, -step, 0) })), jsx("input", { value: state.value?.[0] || "", placeholder: placeholder?.[0], ...inputProps, onBlur: handleBlur, onChange: (e) => handleChange(e, 0) }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(PlusRound, {}), onClick: (e) => handleOperate(e, step, 0) })), jsx(Helpericon, { active: true, icon: jsx(SyncAltRound, {}), style: { margin: 0 }, onClick: handleSwitch }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(MinusRound, {}), onClick: (e) => handleOperate(e, -step, 1) })), jsx("input", { value: state.value?.[1] || "", placeholder: placeholder?.[1], ...inputProps, onBlur: handleBlur, onChange: (e) => handleChange(e, 1) }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(PlusRound, {}), onClick: (e) => handleOperate(e, step, 1) })), append && jsx("div", { className: 'i-input-append', children: append })] }) }));
};

const Textarea = (props) => {
    const { ref, label, name, value = "", labelInline, className, status = "normal", message, tip, autoSize, border, width, style, onChange, onEnter, ...restProps } = props;
    const state = useReactive({
        value,
    });
    const refTextarea = useRef(null);
    const handleChange = (e) => {
        const v = e.target.value;
        state.value = v;
        const ta = refTextarea.current?.firstChild;
        if (autoSize && ta) {
            ta.style.height = `${ta.scrollHeight}px`;
        }
        onChange?.(v, e);
    };
    const handleKeydown = (e) => {
        if (e.code !== "Enter")
            return;
        e.stopPropagation();
        onEnter?.(e);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    const inputProps = {
        ref,
        name,
        value: state.value,
        className: "i-input i-textarea",
        onChange: handleChange,
        onKeyDown: handleKeydown,
        ...restProps,
    };
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, children: jsx("div", { ref: refTextarea, className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
            }), children: jsx("textarea", { ...inputProps }) }) }));
};

const Input = ((props) => {
    const { ref, type = "text", label, name, value = "", prepend, append, labelInline, className, status = "normal", message, tip, clear, width, hideVisible, border, underline, required, maxLength, onChange, onEnter, style, ...restProps } = props;
    const state = useReactive({
        value,
        type,
        visible: false,
    });
    const handleChange = (e) => {
        const v = e.target.value;
        state.value = v;
        onChange?.(v, e);
    };
    const handleKeydown = (e) => {
        e.code === "Enter" && onEnter?.(e);
    };
    const handleHelperClick = () => {
        if (type === "password" && !hideVisible) {
            Object.assign(state, {
                visible: !state.visible,
                type: !state.visible ? "text" : "password",
            });
            return;
        }
        const v = "";
        onChange?.(v);
    };
    const HelperIcon = useMemo(() => {
        if (type === "password") {
            return state.visible ? jsx(VisibilityRound, {}) : jsx(VisibilityOffRound, {});
        }
        return undefined;
    }, [state.visible]);
    useEffect(() => {
        state.value = value;
    }, [value]);
    const inputProps = {
        ref,
        type: state.type,
        name,
        value: state.value,
        maxLength,
        className: classNames("i-input", `i-input-${type}`),
        onChange: handleChange,
        onKeyDown: handleKeydown,
        ...restProps,
    };
    const clearable = clear && state.value;
    const showHelper = type === "password" && !!state.value;
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, required: required, children: jsxs("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
                "i-input-underline": underline,
            }), children: [prepend && jsx("div", { className: 'i-input-prepend', children: prepend }), jsx("input", { ...inputProps }), maxLength && state.value?.length > 0 && (jsxs("span", { className: 'color-8 pr-4 font-sm', children: [state.value.length, " / ", maxLength] })), jsx(Helpericon, { active: !!clearable || showHelper, icon: HelperIcon, onClick: handleHelperClick }), append && jsx("div", { className: 'i-input-append', children: append })] }) }));
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
    align: "center",
    offset: "12px",
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
    const state = useReactive({
        inputValue: "",
        filterValue: "",
        value,
        loading: false,
    });
    const [active, setActive] = useState(false);
    const formattedOptions = useMemo(() => formatOption(options), [options]);
    const filterOptions = useMemo(() => {
        const { filterValue: fv } = state;
        if (!fv || !filter)
            return formattedOptions;
        const filterFn = typeof filter === "function"
            ? filter
            : (opt) => opt.value.includes(fv) || opt.label.includes(fv);
        return formattedOptions.filter(filterFn);
    }, [formattedOptions, filter, state.filterValue]);
    const changeValue = (v) => {
        state.value = v;
        onChange?.(v);
    };
    const displayLabel = useMemo(() => {
        if (multiple) {
            return "";
        }
        const option = formattedOptions.find((opt) => opt.value === state.value);
        return option ? option.label : state.value;
    }, [state.value, formattedOptions]);
    const handleSelect = (value, option) => {
        onSelect?.(value, option);
        if (multiple) {
            const values = [...state.value];
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
        state.filterValue = "";
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
        state.filterValue = v;
    });
    const handleInputChange = (e) => {
        state.filterValue = e.target.value;
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    const hasValue = multiple
        ? state.value.length > 0
        : !!state.value;
    const clearable = !hideClear && active && hasValue;
    const text = message ?? tip;
    return (jsxs("label", { className: classNames("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && jsx("span", { className: 'i-input-label-text', children: label }), jsx(Popup, { position: 'bottom', arrow: false, fitSize: true, ...popupProps, visible: active, trigger: 'none', onVisibleChange: handleVisibleChange, content: jsx(Options, { options: filterOptions, value: state.value, multiple: multiple, filter: !!filter, filterPlaceholder: filterPlaceholder, onSelect: handleSelect, onFilter: handleFilterChange }), children: jsxs("div", { className: classNames("i-input-item", {
                        [`i-input-${status}`]: status !== "normal",
                        "i-input-borderless": !border,
                        "i-input-focus": active,
                    }), onClick: () => setActive(true), children: [prepend, jsx("input", { ref: ref, type: 'hidden', value: state.value, ...restProps }), multiple ? (hasValue ? (jsx("div", { className: classNames("i-input i-select", {
                                "i-select-multiple": multiple,
                            }), children: displayValue({
                                options: formattedOptions,
                                value: state.value,
                                multiple,
                                maxDisplay,
                                onSelect: handleSelect,
                            }) })) : (jsx("input", { className: 'i-input i-select', placeholder: placeholder, readOnly: true }))) : null, !multiple && (jsx("input", { value: active ? state.filterValue : displayLabel, className: 'i-input i-select', placeholder: displayLabel || placeholder, onChange: handleInputChange, readOnly: !filter })), jsx(Helpericon, { active: !hideArrow, icon: clearable ? undefined : jsx(UnfoldMoreRound, {}), onClick: handleHelperClick }), append] }) }), text && jsx("span", { className: 'i-input-message', children: text })] }));
};

const ColorMethods = {
    HEX: "toHexString",
    RGB: "toRgbString",
    HSB: "toHsbString",
};
function Footer(props) {
    const { value, type, onTypeChange, onChange, onOk } = props;
    const state = useReactive({
        value,
        type,
    });
    const handleChange = (v) => {
        state.value = v;
        onChange(v);
    };
    const handleTypeChange = (t) => {
        state.type = t;
        onTypeChange(t);
    };
    useEffect(() => {
        state.value = value;
        state.type = type;
    }, [value, type]);
    return (jsxs("div", { className: 'i-colorpicker-footer', children: [jsx(Select, { readOnly: true, hideClear: true, hideArrow: true, style: { width: "5.6em" }, options: ["RGB", "HEX", "HSB"], value: state.type, onChange: handleTypeChange }), jsx(Input, { placeholder: 'color', value: state.value, onChange: handleChange }), jsx(Button, { square: true, onClick: onOk, children: jsx(Icon, { icon: jsx(CheckRound, {}) }) })] }));
}

const Handle = (props) => {
    const { ref, color, handle, placeholder, className, ...restProps } = props;
    return (jsxs("div", { ref: ref, className: classNames("i-colorpicker-handle", className), ...restProps, children: [handle !== "text" && (jsx("i", { className: 'i-colorpicker-square', style: { background: color } })), handle !== "square" && (jsx("span", { className: 'i-colorpicker-text', style: { color }, children: color ?? placeholder }))] }));
};

function ColorPicker(props) {
    const { value, type = "HEX", disabledAlpha, children, usePanel, handle = "both", placeholder = "Colors", popupProps, onChange, } = props;
    const state = useReactive({
        type,
        value,
        syncValue: value,
        visible: popupProps?.visible,
    });
    const handleChange = (target) => {
        state.syncValue = target;
    };
    const handleComplete = (target) => {
        const method = ColorMethods[state.type];
        if (target.a !== 1) {
            target.a = parseFloat(target.a.toFixed(3));
        }
        state.value = target[method]?.();
    };
    const handleVisibleChange = (v) => {
        state.visible = v;
        popupProps?.onVisibleChange?.(v);
    };
    const handleTypeChange = (t) => {
        const method = ColorMethods[t];
        state.type = t;
        state.value = state.syncValue[method]?.();
    };
    const handleValueChange = (v) => {
        state.value = v;
        state.syncValue = v;
    };
    const handleOk = () => {
        onChange?.(state.value);
        state.visible = false;
    };
    useEffect(() => {
        state.syncValue = value;
        state.value = value;
    }, [value]);
    if (usePanel) {
        return jsx(ColorsPanel, { ...props });
    }
    return (jsx(Popup, { trigger: 'click', touchable: true, position: 'bottom', ...popupProps, visible: state.visible, content: jsx(ColorsPanel, { value: state.syncValue, disabledAlpha: disabledAlpha, panelRender: (panel) => {
                return (jsxs(Fragment, { children: [panel, jsx(Footer, { value: state.value, type: state.type, onTypeChange: handleTypeChange, onChange: handleValueChange, onOk: handleOk })] }));
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
    const state = useReactive({
        today: value,
        month: value || dayjs(),
        selectedYear: dayjs(),
        years: [],
        selectable: false,
    });
    const $years = useRef(null);
    const handleOperateMonth = (next) => {
        state.month = state.month[next ? "add" : "subtract"](1, "month");
    };
    const handleChangeDate = (date) => {
        if (date.isSame(state.today, "day"))
            return;
        if (!date.isSame(state.month, "month")) {
            state.month = date;
        }
        state.today = date;
        onDateClick?.(date);
    };
    const handleChangeMonth = (month) => {
        state.month = state.month
            .year(state.selectedYear.year())
            .month(month - 1);
        state.selectable = false;
    };
    const getMoreYears = throttle({ interval: 100 }, (e) => {
        const isUp = e.deltaY < 0;
        state.years = state.years.map((y) => (y += isUp ? -1 : 1));
    });
    useEffect(() => {
        if (!state.selectable)
            return;
        state.selectedYear = state.month;
        const y = state.selectedYear.year();
        const years = Array.from({ length: 7 }).map((_, i) => y - 3 + i);
        state.years = [...years];
    }, [state.selectable]);
    useEffect(() => {
        state.today = value;
        state.month = value || dayjs();
    }, [value]);
    return (jsxs("div", { className: 'i-datepicker', children: [jsxs("div", { className: 'i-datepicker-units', children: [jsx(YearMonth, { value: state.month, unitYear: unitYear, unitMonth: unitMonth, renderMonth: renderMonth, renderYear: renderYear, onClick: () => (state.selectable = true) }), jsx("a", { className: 'ml-auto i-datepicker-action', "data-ripple": true, onClick: () => handleOperateMonth(false), children: jsx(Icon, { icon: jsx(KeyboardArrowLeftRound, {}) }) }), jsx("a", { className: 'i-datepicker-action', "data-ripple": true, onClick: () => handleOperateMonth(true), children: jsx(Icon, { icon: jsx(KeyboardArrowRightRound, {}) }) })] }), jsxs("div", { className: classNames("i-datepicker-ym", {
                    "i-datepicker-active": state.selectable,
                }), children: [jsx(Helpericon, { active: true, className: 'i-datepicker-close', onClick: (e) => {
                            e.stopPropagation();
                            state.selectable = false;
                        } }), jsx("div", { ref: $years, className: 'i-datepicker-years', onWheel: getMoreYears, children: state.years.map((y) => (jsx("a", { className: classNames("i-datepicker-year", {
                                "i-datepicker-active": y === state.selectedYear.year(),
                            }), onClick: () => (state.selectedYear =
                                state.selectedYear.year(y)), children: renderYear(y) }, y))) }), jsx("div", { className: 'i-datepicker-months', children: MONTHS.map((m) => {
                            return (jsx("a", { className: classNames("i-datepicker-month", {
                                    "i-datepicker-active": m === state.month.month() + 1,
                                }), onClick: () => handleChangeMonth(m), children: renderMonth(m) }, m));
                        }) })] }), jsx(Dates, { value: state.today, month: state.month, disabledDate: disabledDate, onDateClick: handleChangeDate, renderDate: renderDate })] }));
};

dayjs.extend(customParseFormat);
const FORMATTYPES = ["YYYY-MM-DD", "YYYY-M-D", "YYYY/MM/DD", "YYYY/M/D"];
const FORMAT$1 = "YYYY-MM-DD";
const Datepicker = (props) => {
    const { name, value, weeks, format = FORMAT$1, placeholder = props.format ?? FORMAT$1, className, renderDate, renderMonth, renderYear, popupProps, disabledDate, onDateClick, onChange, onBlur, ...restProps } = props;
    const state = useReactive({
        value,
    });
    const [active, setActive] = useState(false);
    const dayJsValue = useMemo(() => {
        if (!state.value)
            return null;
        const date = dayjs(state.value, format, true);
        if (date.isValid())
            return date;
        return null;
    }, [state.value]);
    const handleDateClick = (date) => {
        handleChange(date.format(format));
    };
    const handleChange = (v) => {
        state.value = v;
        onChange?.(v);
    };
    const handleSetDate = () => {
        if (!state.value)
            return;
        const date = dayjs(state.value, FORMATTYPES, true);
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
        state.value = value;
    }, [value]);
    return (jsx(Popup, { visible: active, trigger: 'click', position: 'bottom', arrow: false, align: 'start', onVisibleChange: handleVisibleChange, watchResize: true, content: jsx(Panel$1, { value: dayJsValue, weeks: weeks, renderDate: renderDate, renderMonth: renderMonth, renderYear: renderYear, disabledDate: disabledDate, onDateClick: handleDateClick }), ...popupProps, children: jsx(Input, { value: state.value, append: jsx(Icon, { icon: jsx(CalendarMonthTwotone, {}), className: 'i-datepicker-icon', size: '1em' }), placeholder: placeholder, onChange: handleChange, onBlur: handleBlur, onEnter: handleSetDate, className: classNames("i-datepicker-label", className), ...restProps }) }));
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
    const state = useReactive({
        period: undefined,
        hour: undefined,
        minute: undefined,
        second: undefined,
    });
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
    const updateValue = () => {
        const reg = /(hh|h){1}|(mm|m){1}|(ss|s){1}/gi;
        let result = format.replace(reg, (pattern) => {
            const p = pattern.toLowerCase();
            const u = UnitMaps[p];
            const n = state[u] ?? 0;
            return p.length > 1 && n < 10 ? `0${n ?? 0}` : n ?? 0;
        });
        if (periods && hours.length > 0) {
            result = `${state.period ?? periods[0]} ${result}`;
        }
        onChange(result);
    };
    const handleSetTime = (v, unit) => {
        state[unit] = v;
        updateValue();
    };
    useEffect(() => {
        let time = value ?? "";
        if (periods && hours.length > 0 && value) {
            const [p, t] = value.split(" ");
            time = t ?? "";
            state.period = periods.includes(p) ? p : undefined;
        }
        const nums = time.match(/\d+/g) ?? [];
        if (!nums.length) {
            onFallback("");
            return;
        }
        let i = 0;
        const r = format.replace(/(hh|h)+|(mm|m)+|(ss|s)+/gi, (p) => {
            const n = nums[i++] ?? 0;
            let o = p;
            if (UnitMaps[p] === "hour") {
                o = Math.min(periods ? 11 : 23, n);
            }
            o = Math.min(59, n);
            state[UnitMaps[p]] = o;
            return p.length > 1 && o < 10 ? `0${o}` : o;
        });
        onFallback(r);
    }, [value]);
    return (jsxs("div", { className: 'i-timepicker', children: [hours.length > 0 && (jsxs(Fragment, { children: [periods && (jsx("div", { className: 'i-timepicker-list', children: jsx(Items, { items: periods, active: state.period, onClick: (p) => handleSetTime(p, "period") }) })), jsx("div", { className: 'i-timepicker-list', children: jsx(Items, { items: hours, active: state.hour, unit: 'hour', renderItem: renderItem, onClick: (h) => handleSetTime(h, "hour") }) })] })), minutes.length > 0 && (jsx("div", { className: 'i-timepicker-list', children: jsx(Items, { items: minutes, active: state.minute, unit: 'minute', renderItem: renderItem, onClick: (m) => handleSetTime(m, "minute") }) })), seconds.length > 0 && (jsx("div", { className: 'i-timepicker-list', children: jsx(Items, { items: seconds, active: state.second, unit: 'second', renderItem: renderItem, onClick: (s) => handleSetTime(s, "second") }) }))] }));
}

const FORMAT = "hh:mm:ss";
function TimePicker(props) {
    const { name, value, format = FORMAT, periods, placeholder = props.format ?? FORMAT, className, renderItem, onChange, onBlur, popupProps, ...restProps } = props;
    const state = useReactive({
        value,
        safeValue: undefined,
    });
    const [active, setActive] = useState(false);
    const handleChange = (v) => {
        state.value = v;
    };
    const handleFallback = (v) => {
        state.safeValue = v;
    };
    const handleValidTime = () => {
        if (!state.value)
            return;
        state.value = state.safeValue;
        handleChange(state.safeValue);
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
        state.value = value;
    }, [value]);
    return (jsx(Popup, { visible: active, trigger: 'click', position: 'bottom', arrow: false, align: 'start', watchResize: true, ...popupProps, onVisibleChange: handleVisibleChange, content: jsx(Panel, { value: state.value, format: format, periods: periods, renderItem: renderItem, onChange: handleChange, onFallback: handleFallback }), children: jsx(Input, { value: state.value, placeholder: placeholder, append: jsx(Icon, { icon: jsx(AccessTimeRound, {}), className: 'i-timepicker-icon', size: '1em' }), onChange: handleChange, onBlur: handleBlur, className: classNames("i-timepicker-label", className), ...restProps }) }));
}

const defaultOk = {
    children: "确定",
};
const defaultCancel = {
    children: "取消",
    secondary: true,
};
const Popconfirm = (props) => {
    const { trigger = "click", visible, icon = jsx(Icon, { icon: jsx(InfoOutlined, {}), className: 'error', size: '1.2em' }), content, okButtonProps, cancelButtonProps, children, align = "end", position = "top", offset = 12, extra, onOk, onClose, ...restProps } = props;
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
        onOk?.()
            ?.then(() => {
            state.visible = false;
        })
            .finally(() => {
            state.loading = false;
        });
    };
    const handleCancel = async (e) => {
        cancel.onClick?.(e);
        await onClose?.();
        state.visible = false;
    };
    const popconfirmContent = (jsxs("div", { className: 'i-popconfirm', children: [jsxs(Flex, { gap: '.5em', children: [icon, jsx("div", { className: 'i-popconfirm-content', children: content })] }), jsxs(Flex, { gap: 12, justify: 'flex-end', className: 'i-popconfirm-footer', children: [cancelButtonProps !== null && (jsx(Button, { ...cancel, onClick: handleCancel })), extra, okButtonProps !== null && (jsx(Button, { loading: state.loading, ...ok, onClick: handleOk }))] })] }));
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
    const state = useReactive({
        value,
    });
    const formattedOptions = useMemo(() => formatOption(options), [options]);
    const handleChange = (value, e) => {
        state.value = value;
        onChange?.(value, e);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    return (jsxs("div", { className: classNames("i-radio i-input-label", {
            [`i-radio-${status}`]: status !== "normal",
            "i-input-inline": labelInline,
        }, className), children: [label && (jsxs("span", { className: 'i-input-label-text', children: [required && jsx("span", { className: 'error', children: "*" }), label, message && jsx("p", { className: 'i-radio-message', children: message })] })), jsx("div", { className: classNames("i-radio-options", {
                    "i-options-block": !optionInline,
                    "i-radio-options-button": type === "button",
                }), children: formattedOptions.map((option) => {
                    const checked = state.value === option.value;
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
    const { ref, active, tabs: items, type = "default", prepend, append, children, className, vertical, toggable, navsJustify = "start", bar = true, hideMore, barClass, renderMore = () => (jsx(Button, { flat: true, square: true, size: 'small', children: jsx(Icon, { icon: jsx(MoreHorizRound, {}) }) })), onTabChange, ...rest } = props;
    const navRefs = useRef([]);
    const barRef = useRef(null);
    const navsRef = useRef(null);
    const state = useReactive({
        active,
        prevActive: undefined,
        barStyle: {},
        cachedTabs: [],
        overflow: false,
        more: [],
        tabs: [],
    });
    const { observe, unobserve } = useIntersectionObserver();
    const size = useSize(navsRef);
    useEffect(() => {
        if (!items) {
            if (!children) {
                state.tabs = [];
                return;
            }
            state.tabs = Children.map(children, (node, i) => {
                const { key, props: nodeProps } = node;
                const { title, children, content, keepDOM } = nodeProps;
                const cloned = children
                    ? typeof children === "string"
                        ? children
                        : pick(children, ["props", "type", "$$typeof", "ref"])
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
            open(state.tabs[i].key ?? `${i}`);
            return;
        }
        const l = state.tabs.length;
        const tkey = tab.key ?? `${l}`;
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
    useEffect(() => {
        if (!size || hideMore || !observe)
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
    useEffect(() => {
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
    useEffect(() => {
        if (active === undefined || state.active === active)
            return;
        open(active);
    }, [active]);
    useEffect(() => {
        if (hideMore || !unobserve)
            return;
        return () => {
            navRefs.current?.map(unobserve);
        };
    }, [state.tabs.length]);
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
                }), children: [prepend, jsxs("div", { ref: navsRef, className: classNames("i-tab-navs", `justify-${navsJustify}`), children: [state.tabs.map((tab, i) => {
                                const { title, key = `${i}`, closable } = tab;
                                return (jsxs("a", { ref: (ref) => (navRefs.current[i] = ref), className: classNames("i-tab-nav", {
                                        "i-tab-active": state.active === key,
                                    }), onClick: () => open(key), children: [title, closable && (jsx(Helpericon, { as: 'i', active: true, className: 'i-tab-nav-close', onClick: (e) => {
                                                e.stopPropagation();
                                                close(key);
                                            } }))] }, key));
                            }), bar && (jsx("span", { ref: barRef, className: classNames("i-tab-navs-bar", barClass), style: state.barStyle }))] }), !hideMore && state.overflow && state.more.length > 0 && (jsx(Popup, { arrow: false, position: vertical ? "right" : "bottom", align: 'end', touchable: true, hideDelay: 500, content: jsx("div", { className: 'i-tabs-morelist pd-4', children: state.more.map((tab, i) => {
                                const { key = `${i}`, title } = tab;
                                const isActive = state.active === key;
                                return (jsx("a", { className: classNames("i-tab-nav", {
                                        "i-tab-active": isActive,
                                    }), onClick: () => open(key), children: title }, key));
                            }) }), children: renderMore(state.more) })), append] }), jsx("div", { className: 'i-tab-contents', children: state.tabs.map((tab, i) => {
                    const { key = `${i}`, content } = tab;
                    const isActive = state.active === key;
                    const show = isActive ||
                        (key !== undefined && state.cachedTabs.includes(key));
                    return (show && (jsx("div", { className: classNames("i-tab-content", {
                            "i-tab-active": isActive,
                        }), children: content }, key)));
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
    const state = useReactive({
        selected,
        checked,
        partofs: {},
        nodeMaps: new Map(),
    });
    const oNodeProps = Object.assign({}, defaultNodeProps, nodeProps);
    const isChecked = (key) => state.checked.includes(key || "");
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
        state.checked = checked
            ? Array.from(new Set([...state.checked, ...changedKeys]))
            : state.checked.filter((k) => !changedKeys.includes(k));
        Object.assign(state.partofs, partofs);
        onItemCheck?.(item, checked, state.checked);
    };
    const handleSelect = (key, item) => {
        if (!props.selectable)
            return;
        state.selected = key;
        onItemSelect?.(key, item);
    };
    useEffect(() => {
        if (selected === undefined)
            return;
        state.selected = selected;
    }, [selected]);
    useEffect(() => {
        state.nodeMaps.clear();
        const { key, children } = oNodeProps;
        const recursive = (nodes) => {
            nodes.map((o) => {
                state.nodeMaps.set(o[key], o);
                o[children]?.length > 0 && recursive(o[children]);
            });
        };
        recursive(data);
    }, [data]);
    useImperativeHandle(ref, () => {
        return {
            getChecked: () => {
                const items = [];
                state.checked.map((k) => {
                    const item = state.nodeMaps.get(k);
                    items.push(item);
                });
                return [state.checked, items];
            },
            getSelected: () => {
                const item = state.nodeMaps.get(state.selected);
                return [state.selected, item];
            },
            getPartofs: () => {
                const items = [];
                const keys = Object.keys(state.partofs).filter((k) => {
                    const indeterminate = state.partofs[k];
                    if (indeterminate) {
                        const item = state.nodeMaps.get(k);
                        items.push(item);
                    }
                    return indeterminate;
                });
                return [keys, items];
            },
        };
    });
    return (jsx(TreeList, { data: data, selected: state.selected, checked: state.checked, partofs: state.partofs, nodeProps: oNodeProps, onItemCheck: handleCheck, onItemSelect: handleSelect, ...restProps }));
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
                    node = (jsx(Image, { lazyload: true, src: url || src, fit: 'cover', onMouseDown: (e) => e.preventDefault() }));
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
    const state = useReactive({
        files,
        value,
        status,
        message,
    });
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
        const { files: before } = state;
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
        Object.assign(state, {
            files: multiple ? after.slice(0, limit) : [after.at(-1)],
            status,
            message,
        });
        onFilesChange?.(state.files, changed, e);
        onChange?.(state.files, e);
        handleUpload(changed);
        inputRef.current && (inputRef.current.value = "");
    };
    const handleRemove = (i) => {
        const [...files] = state.files;
        const changed = files.splice(i, 1);
        URL.revokeObjectURL(changed[0]?.src || "");
        state.files = files;
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
        preview({ items: state.files, initial: i });
    };
    const setFileList = (files) => {
        if (!files)
            return;
        state.files = files.map((f) => {
            return { ...f, id: f.id ?? uid(7) };
        });
    };
    const handleSortEnd = (before, after) => {
        const [...files] = state.files;
        state.files = arrayMove(files, before, after);
        onChange?.(state.files);
    };
    useEffect(() => {
        Object.assign(state, {
            status,
            message,
        });
    }, [status, message]);
    useEffect(() => {
        state.files = value?.filter?.((file) => !!file.id) ?? [];
    }, [value]);
    useEffect(() => {
        setFileList(initialFiles);
    }, []);
    useImperativeHandle(ref, () => ({
        getFileList: () => state.files,
        setFileList,
    }), []);
    return (jsx(InputContainer, { as: 'div', label: label, labelInline: labelInline, className: classNames("i-input-label-file", className), style: style, children: jsxs("div", { className: classNames("i-upload-inner", {
                [`i-upload-${mode}`]: mode !== "default",
            }), style: { ["--upload-card-size"]: cardSize }, children: [jsx(ListContainer, { sortable: sortable, onSortEnd: handleSortEnd, children: state.files.map((file, i) => {
                        const node = (jsx(FileListItem, { index: i, file: file, mode: mode, renderItem: renderItem, onRemove: handleRemove, onPreview: handlePreview }, i));
                        if (!sortable)
                            return node;
                        return jsx(SortableItem, { children: node }, i);
                    }) }), state.message && (jsx("span", { className: 'i-upload-message', children: state.message })), state.files.length < limit && (jsxs("label", { children: [jsx("input", { ...restProps, disabled: disabled, ref: inputRef, type: 'file', className: 'i-input-file-hidden', multiple: multiple, onChange: handleChange }), trigger] }))] }) }));
};

export { Affix, Badge, Button, Card, Checkbox, Collapse, ColorPicker, Datagrid, Datepicker as DatePicker, Description, Drawer, Dropdown, Editor, Flex, Form, Icon, Image, Input, List$1 as List, Loading, message as Message, Modal, Pagination, Popconfirm, Popup, Progress, Radio, Resizable, River, Select, Step, Swiper, Tabs, Tag, Text, TimePicker, Tree, Upload, Video, usePreview };
