'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var ahooks = require('ahooks');
var classNames = require('classnames');
var react = require('react');
var hooks = require('../../js/hooks.js');
var index = require('../../js/usePreview/index.js');
var icon = require('../icon/icon.js');
var loading = require('../loading/loading.js');
var list = require('./list.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Image = (props) => {
    const { src, thumb, round, size, height, width, ratio, initSize, lazyload, fallback = (jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.HideImageTwotone, {}), size: '2em', className: 'color-5' })), fit, style, className, cover, coverClass, usePreview: previewable, onLoad, onError, onClick, ...restProps } = props;
    const state = ahooks.useReactive({
        status: "loading",
    });
    const ref = react.useRef(null);
    const { observe, unobserve } = hooks.useIntersectionObserver();
    const preview = index.default();
    const handleError = (err) => {
        onError?.(err);
        state.status = "error";
    };
    const handleLoad = (e) => {
        onLoad?.(e);
        state.status = undefined;
    };
    const handleClick = (e) => {
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
    react.useEffect(() => {
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
    return (jsxRuntime.jsx("div", { style: {
            width: width ?? size ?? iSize,
            height: height ?? size ?? iSize,
            aspectRatio: ratio,
            ...style,
        }, className: classNames__default("i-image", className, {
            rounded: round,
            [`i-image-${state.status}`]: state.status,
        }), onClick: handleClick, children: state.status === "error" ? (fallback) : (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [src && (jsxRuntime.jsx("img", { ref: ref, style: { objectFit: fit }, ...restProps, onLoad: handleLoad, onError: handleError })), src && state.status === "loading" && jsxRuntime.jsx(loading.default, { absolute: true }), cover && (jsxRuntime.jsx("div", { className: classNames__default("i-image-cover", coverClass), children: cover }))] })) }));
};
Image.List = list.default;

exports.default = Image;
//# sourceMappingURL=image.js.map
