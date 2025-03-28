import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { HideImageTwotone } from '@ricons/material';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../../js/hooks.js';
import usePreview from '../../js/usePreview/index.js';
import Icon from '../icon/icon.js';
import Loading from '../loading/loading.js';
import List from './list.js';

const Image = (props) => {
    const { src, round, size, initSize, lazyload, fallback = (jsx(Icon, { icon: jsx(HideImageTwotone, {}), size: '2em', className: 'color-5' })), fit, style, className, cover, coverClass, usePreview: previewable, onLoad, onError, onClick, ...restProps } = props;
    const state = useReactive({
        status: "loading",
    });
    const ref = useRef(null);
    const wh = fit ? "100%" : undefined;
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
        preview({
            items: [
                {
                    src,
                    type: "IMAGE",
                },
            ],
        });
    };
    useEffect(() => {
        if (!src)
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
    restProps[lazyload ? "data-src" : "src"] = src;
    const iSize = state.status === "loading" ? initSize : undefined;
    return (jsx("div", { style: {
            width: size ?? iSize,
            height: size ?? iSize,
            ...style,
        }, className: classNames("i-image", className, {
            rounded: round,
            [`i-image-${state.status}`]: state.status,
        }), children: state.status === "error" ? (fallback) : (jsxs(Fragment, { children: [src && (jsx("img", { ref: ref, style: { objectFit: fit, width: wh, height: wh }, ...restProps, onLoad: handleLoad, onError: handleError, onClick: handleClick })), src && state.status === "loading" && jsx(Loading, { absolute: true }), cover && (jsx("div", { className: classNames("i-image-cover", coverClass), onClick: handleClick, children: cover }))] })) }));
};
Image.List = List;

export { Image as default };
//# sourceMappingURL=image.js.map
