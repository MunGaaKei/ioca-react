'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

function InputContainer(props) {
    const { as: As = "label", label, className, labelInline, style, children, status, tip, required, } = props;
    return (jsxRuntime.jsxs(As, { className: classNames__default.default("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && (jsxRuntime.jsxs("span", { className: 'i-input-label-text', children: [required && jsxRuntime.jsx("span", { className: 'error', children: "*" }), label] })), children, tip && (jsxRuntime.jsx("span", { className: classNames__default.default("i-input-message", {
                    [`i-input-${status}`]: status !== "normal",
                }), children: tip }))] }));
}

exports.default = InputContainer;
//# sourceMappingURL=container.js.map
