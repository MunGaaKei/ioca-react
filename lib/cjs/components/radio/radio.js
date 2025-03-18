'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ahooks = require('ahooks');
var classNames = require('classnames');
var react = require('react');
var utils = require('../../js/utils.js');
var item = require('./item.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function Radio(props) {
    const { label, name, options, value, type = "default", status = "normal", message, optionInline = true, labelInline, disabled, required, className, renderItem, onChange, } = props;
    const state = ahooks.useReactive({
        value,
    });
    const formattedOptions = react.useMemo(() => utils.formatOption(options), [options]);
    const handleChange = (value, e) => {
        state.value = value;
        onChange?.(value, e);
    };
    react.useEffect(() => {
        state.value = value;
    }, [value]);
    return (jsxRuntime.jsxs("div", { className: classNames__default("i-radio i-input-label", {
            [`i-radio-${status}`]: status !== "normal",
            "i-input-inline": labelInline,
        }, className), children: [label && (jsxRuntime.jsxs("span", { className: 'i-input-label-text', children: [required && jsxRuntime.jsx("span", { className: 'error', children: "*" }), label, message && jsxRuntime.jsx("p", { className: 'i-radio-message', children: message })] })), jsxRuntime.jsx("div", { className: classNames__default("i-radio-options", {
                    "i-options-block": !optionInline,
                    "i-radio-options-button": type === "button",
                }), children: formattedOptions.map((option) => {
                    const checked = state.value === option.value;
                    return (jsxRuntime.jsx(item.default, { name: name, value: option.value, checked: checked, type: type, disabled: disabled || option.disabled, onChange: handleChange, children: renderItem ?? option.label }, option.value));
                }) })] }));
}
Radio.Item = item.default;

exports.default = Radio;
//# sourceMappingURL=radio.js.map
