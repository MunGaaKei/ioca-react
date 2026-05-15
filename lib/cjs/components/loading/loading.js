'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Loading = (props) => {
    const { icon, text, size, absolute, style, className, ...restProps } = props;
    const iconSize = size != null
        ? { fontSize: typeof size === "number" ? `${size}px` : size }
        : undefined;
    return (jsxRuntime.jsxs("div", { className: classNames__default("i-loading-container", {
            absolute,
        }, className), style: {
            ...style,
            inset: absolute ? 0 : "unset",
        }, ...restProps, children: [icon ?? jsxRuntime.jsx("span", { className: "i-loading-icon", style: iconSize }), text] }));
};

exports.default = Loading;
//# sourceMappingURL=loading.js.map
