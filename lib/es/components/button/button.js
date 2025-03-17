import { jsx, Fragment } from 'react/jsx-runtime';
import classNames from 'classnames';
import { createElement, useEffect } from 'react';
import useRipple from '../../js/useRipple/index.js';
import Loading from '../loading/loading.js';

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

export { Button as default };
//# sourceMappingURL=button.js.map
