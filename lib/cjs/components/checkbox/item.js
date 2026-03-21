'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function CheckboxItem(props) {
    const { type = "default", label, name, value = false, className, status = "normal", message, disabled, partof, optionValue, children, onChange, ...restProps } = props;
    const [checked, setChecked] = react.useState(value);
    const [itemStatus, setItemStatus] = react.useState(status);
    const [itemMessage, setItemMessage] = react.useState(message);
    const isChildrenFn = typeof children === "function";
    const handleChange = (e) => {
        const next = e.target.checked;
        setChecked(next);
        setItemStatus(status);
        setItemMessage(message);
        onChange?.(next, e);
    };
    react.useEffect(() => {
        setChecked(value);
    }, [value]);
    react.useEffect(() => {
        setItemStatus(status);
        setItemMessage(message);
    }, [status, message]);
    return (jsxRuntime.jsxs("label", { className: classNames__default("i-checkbox-item", {
            [`i-checkbox-${itemStatus}`]: itemStatus !== "normal",
            disabled,
        }, className), ...restProps, children: [jsxRuntime.jsx("input", { type: 'checkbox', name: name, className: classNames__default("i-checkbox-input", {
                    [`i-checkbox-${type}`]: !partof,
                    "i-checkbox-partof": partof,
                }), checked: checked, disabled: disabled, onChange: handleChange }), isChildrenFn ? (children(checked, optionValue)) : (jsxRuntime.jsx("span", { className: 'i-checkbox-text', children: children || label })), itemMessage && (jsxRuntime.jsxs("span", { className: 'i-checkbox-message', children: ["*", itemMessage] }))] }));
}

exports.default = CheckboxItem;
//# sourceMappingURL=item.js.map
