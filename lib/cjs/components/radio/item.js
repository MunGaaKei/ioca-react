'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

function RadioItem(props) {
    const { type = "default", name, value, checked, disabled, children, onChange, } = props;
    const isChildrenFn = typeof children === "function";
    const handleChange = (e) => {
        onChange?.(value, e);
    };
    return (jsxRuntime.jsxs("label", { className: classNames__default.default("i-radio-item", {
            disabled,
            "i-radio-item-custom": isChildrenFn,
        }), children: [jsxRuntime.jsx("input", { type: 'radio', name: name, checked: checked, className: classNames__default.default("i-radio-input", `i-radio-${type}`), disabled: disabled, hidden: isChildrenFn, onChange: handleChange }), isChildrenFn ? (children(!!checked, value)) : (jsxRuntime.jsx("span", { className: 'i-radio-text', children: children }))] }));
}

exports.default = RadioItem;
//# sourceMappingURL=item.js.map
