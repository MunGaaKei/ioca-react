'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var hooks = require('../../js/hooks.js');
var index = require('../../js/usePreview/index.js');
var loading = require('../loading/loading.js');
var list = require('./list.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const STATUS_LOADING = "loading";
const STATUS_ERROR = "error";
const Image = (props) => {
    const { src, thumb, round, size, height, width, ratio, initSize, lazyload, fallback, fit, style, className, cover, coverClass, usePreview: previewable, onLoad, onError, onClick, ...restProps } = props;
    const state = hooks.useReactive({
        status: STATUS_LOADING,
    });
    const ref = react.useRef(null);
    const { observe, unobserve } = hooks.useIntersectionObserver();
    const preview = index.default();
    const setStatus = react.useCallback((status) => {
        if (state.status === status)
            return;
        state.status = status;
    }, [state]);
    const handleError = react.useCallback((err) => {
        onError?.(err);
        setStatus(STATUS_ERROR);
    }, [onError, setStatus]);
    const handleLoad = react.useCallback((e) => {
        onLoad?.(e);
        setStatus(undefined);
    }, [onLoad, setStatus]);
    const handleClick = react.useCallback((e) => {
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
    react.useEffect(() => {
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
    const wrapperStyle = react.useMemo(() => ({
        width: width ?? size ?? iSize,
        height: height ?? size ?? iSize,
        aspectRatio: ratio,
        ...style,
    }), [height, iSize, ratio, size, style, width]);
    const wrapperClassName = react.useMemo(() => classNames__default("i-image", className, {
        rounded: round,
        [`i-image-${imageStatus}`]: imageStatus,
    }), [className, imageStatus, round]);
    const imageStyle = react.useMemo(() => ({ objectFit: fit }), [fit]);
    const imageSrcProps = lazyload
        ? { "data-src": thumb ?? src }
        : { src: thumb ?? src };
    return (jsxRuntime.jsx("div", { style: wrapperStyle, className: wrapperClassName, onClick: handleClick, children: imageStatus === STATUS_ERROR ? ((fallback ?? null)) : (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [src && (jsxRuntime.jsx("img", { ref: ref, style: imageStyle, ...imageSrcProps, ...restProps, onLoad: handleLoad, onError: handleError })), src && imageStatus === STATUS_LOADING && (jsxRuntime.jsx(loading.default, { absolute: true })), cover && (jsxRuntime.jsx("div", { className: classNames__default("i-image-cover", coverClass), children: cover }))] })) }));
};
const MemoImage = react.memo(Image);
MemoImage.List = list.default;

exports.default = MemoImage;
//# sourceMappingURL=image.js.map
