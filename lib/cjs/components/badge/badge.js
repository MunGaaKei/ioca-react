'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

const Badge = (props) => {
    const { content, contentClass, dot, dotSize, round, disabled, style, className, children, } = props;
    return (jsxRuntime.jsxs("div", { style: style, className: classNames("i-badge", { rounded: round }, className), children: [children, jsxRuntime.jsx("div", { className: classNames("i-badge-content", contentClass, {
                    "i-badge-dot": dot,
                    "i-badge-hidden": disabled,
                }), style: { fontSize: dotSize }, children: content })] }));
};

exports.default = Badge;
//# sourceMappingURL=badge.js.map
