'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ahooks = require('ahooks');
var classNames = require('classnames');
var react = require('react');

function CheckboxItem(props) {
    const { type = "default", label, name, value = false, className, status = "normal", message, disabled, partof, optionValue, children, onChange, ...restProps } = props;
    const state = ahooks.useReactive({
        value,
        status,
        message,
    });
    const isChildrenFn = typeof children === "function";
    const handleChange = (e) => {
        const checked = e.target.checked;
        Object.assign(state, {
            value: checked,
            status,
            message,
        });
        onChange?.(checked, e);
    };
    react.useEffect(() => {
        state.value = value;
    }, [value]);
    return (jsxRuntime.jsxs("label", { className: classNames("i-checkbox-item", {
            [`i-checkbox-${state.status}`]: state.status !== "normal",
            disabled,
        }, className), ...restProps, children: [jsxRuntime.jsx("input", { type: 'checkbox', name: name, className: classNames("i-checkbox-input", {
                    [`i-checkbox-${type}`]: !partof,
                    "i-checkbox-partof": partof,
                }), checked: state.value, disabled: disabled, onChange: handleChange }), isChildrenFn ? (children(state.value, optionValue)) : (jsxRuntime.jsx("span", { className: 'i-checkbox-text', children: children || label })), state.message && (jsxRuntime.jsxs("span", { className: 'i-checkbox-message', children: ["*", state.message] }))] }));
}

exports.default = CheckboxItem;
//# sourceMappingURL=item.js.map
