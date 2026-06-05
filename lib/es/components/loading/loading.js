import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

const Loading = (props) => {
    const { icon, text, size, absolute, style, className, ...restProps } = props;
    const iconSize = size != null
        ? { fontSize: typeof size === "number" ? `${size}px` : size }
        : undefined;
    return (jsxs("div", { className: classNames("i-loading-container", {
            absolute,
        }, className), style: {
            ...style,
            inset: absolute ? 0 : "unset",
        }, ...restProps, children: [icon ?? jsx("span", { className: "i-loading-icon", style: iconSize }), text] }));
};

export { Loading as default };
