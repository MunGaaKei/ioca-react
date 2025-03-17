'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

function InputContainer(props) {
    const { as: As = "label", label, className, labelInline, style, children, status, tip, required, } = props;
    return (jsxRuntime.jsxs(As, { className: classNames("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && (jsxRuntime.jsxs("span", { className: 'i-input-label-text', children: [required && jsxRuntime.jsx("span", { className: 'error', children: "*" }), label] })), children, tip && (jsxRuntime.jsx("span", { className: classNames("i-input-message", {
                    [`i-input-${status}`]: status !== "normal",
                }), children: tip }))] }));
}

exports.default = InputContainer;
//# sourceMappingURL=container.js.map
