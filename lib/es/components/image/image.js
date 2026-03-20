import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useRef, useEffect } from 'react';
import { useReactive, useIntersectionObserver } from '../../js/hooks.js';
import usePreview from '../../js/usePreview/index.js';
import Loading from '../loading/loading.js';
import List from './list.js';

const Image = (props) => {
    const { src, thumb, round, size, height, width, ratio, initSize, lazyload, fallback, fit, style, className, cover, coverClass, usePreview: previewable, onLoad, onError, onClick, ...restProps } = props;
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
        const img = ref.current;
        const hasSrcAttr = img?.getAttribute("src");
        const canSyncStatus = Boolean(img && (!lazyload || hasSrcAttr));
        if (canSyncStatus && img?.complete) {
            state.status = img.naturalWidth > 0 ? undefined : "error";
        }
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
        }), onClick: handleClick, children: state.status === "error" ? ((fallback ?? null)) : (jsxs(Fragment, { children: [src && (jsx("img", { ref: ref, style: { objectFit: fit }, ...restProps, onLoad: handleLoad, onError: handleError })), src && state.status === "loading" && jsx(Loading, { absolute: true }), cover && (jsx("div", { className: classNames("i-image-cover", coverClass), children: cover }))] })) }));
};
Image.List = List;

export { Image as default };
//# sourceMappingURL=image.js.map
