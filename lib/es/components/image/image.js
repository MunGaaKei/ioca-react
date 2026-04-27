import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import classNames from 'classnames';
import { memo, useRef, useCallback, useEffect, useMemo } from 'react';
import { useReactive, useIntersectionObserver } from '../../js/hooks.js';
import usePreview from '../../js/usePreview/index.js';
import Loading from '../loading/loading.js';
import List from './list.js';

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

export { MemoImage as default };
//# sourceMappingURL=image.js.map
