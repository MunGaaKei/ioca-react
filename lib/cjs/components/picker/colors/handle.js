'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

const Handle = (props) => {
    const { ref, color, handle, placeholder, className, ...restProps } = props;
    return (jsxRuntime.jsxs("div", { ref: ref, className: classNames("i-colorpicker-handle", className), ...restProps, children: [handle !== "text" && (jsxRuntime.jsx("i", { className: 'i-colorpicker-square', style: { background: color } })), handle !== "square" && (jsxRuntime.jsx("span", { className: 'i-colorpicker-text', style: { color }, children: color ?? placeholder }))] }));
};

exports.default = Handle;
//# sourceMappingURL=handle.js.map
