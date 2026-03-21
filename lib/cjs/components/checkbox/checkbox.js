'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var utils = require('../../js/utils.js');
var item = require('./item.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function Checkbox(props) {
    const { label, name, options = [], value = "", type = "default", optionInline = true, labelInline, disabled, status = "normal", message, required, className, renderItem, onChange, ...restProps } = props;
    const [selectedValues, setSelectedValues] = react.useState(value);
    const formattedOptions = react.useMemo(() => utils.formatOption(options), [options]);
    const handleChange = (checked, opt, e) => {
        const group = [...selectedValues];
        const i = group.findIndex((item) => item === opt.value);
        if (checked && i < 0) {
            group.push(opt.value);
        }
        else if (!checked && i > -1) {
            group.splice(i, 1);
        }
        setSelectedValues(group);
        onChange?.(group, opt, e);
    };
    react.useEffect(() => {
        setSelectedValues(value);
    }, [value]);
    return (jsxRuntime.jsxs("div", { className: classNames__default("i-checkbox i-input-label", {
            [`i-checkbox-${status}`]: status !== "normal",
            "i-input-inline": labelInline,
        }, className), ...restProps, children: [label && (jsxRuntime.jsxs("span", { className: 'i-input-label-text', children: [required && jsxRuntime.jsx("span", { className: 'error', children: "*" }), label, message && jsxRuntime.jsx("p", { className: 'i-checkbox-message', children: message })] })), jsxRuntime.jsx("div", { className: classNames__default("i-checkbox-options", {
                    "i-options-block": !optionInline,
                    "i-checkbox-options-button": type === "button",
                }), children: formattedOptions.map((option) => {
                    return (jsxRuntime.jsx(item.default, { name: name, value: selectedValues.includes(option.value), optionValue: option.value, type: type, disabled: disabled || option.disabled, onChange: (checked, e) => handleChange(checked, option, e), children: renderItem ?? option.label }, option.value));
                }) })] }));
}
Checkbox.Item = item.default;

exports.default = Checkbox;
//# sourceMappingURL=checkbox.js.map
