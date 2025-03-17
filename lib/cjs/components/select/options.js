'use strict';

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var icon = require('../icon/icon.js');
var list = require('../list/list.js');
var tag = require('../tag/tag.js');
var index = require('../utils/empty/index.js');

const Options = (props) => {
    const { value: val, options, filter, filterPlaceholder, multiple, empty = jsxRuntime.jsx(index.default, {}), onSelect, onFilter, } = props;
    return (jsxRuntime.jsxs("div", { className: classNames("i-select-options", {
            "i-select-options-multiple": multiple,
        }), children: [filter && multiple && (jsxRuntime.jsxs("div", { className: 'i-select-filter', children: [jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.SearchRound, {}), className: 'color-8 ml-8 my-auto', size: '1.2em' }), jsxRuntime.jsx("input", { type: 'text', className: 'i-input', placeholder: filterPlaceholder, onChange: onFilter })] })), options.length === 0 && empty, options.map((option, i) => {
                const { label, value, disabled } = option;
                const isActive = multiple
                    ? val?.includes(value)
                    : val === value;
                return (jsxRuntime.jsxs(list.default.Item, { active: isActive, type: 'option', onClick: () => onSelect?.(value, option), disabled: disabled, children: [multiple && (jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.CheckRound, {}), className: 'i-select-option-check', size: '1em' })), label] }, value || i));
            })] }));
};
const activeOptions = (options = [], value = [], max = 3) => {
    const total = options.flatMap((opt) => value.includes(opt.value) ? [opt] : []);
    if (max >= total.length)
        return total;
    const rest = total.length - max;
    const after = total.slice(0, max);
    after.push(rest);
    return after;
};
const displayValue = (config) => {
    const { options, value, maxDisplay, multiple, onSelect } = config;
    if (multiple) {
        return activeOptions(options, value, maxDisplay).map((opt, i) => {
            if (typeof opt === "number")
                return jsxRuntime.jsxs(tag.default, { children: ["+", opt] }, i);
            const { label, value } = opt;
            return (jsxRuntime.jsx(tag.default, { hoverShowClose: true, onClose: (e) => {
                    e?.stopPropagation();
                    onSelect?.(value, opt);
                }, children: label }, value));
        });
    }
    return options.find((opt) => opt.value === value)?.label;
};

exports.Options = Options;
exports.activeOptions = activeOptions;
exports.displayValue = displayValue;
//# sourceMappingURL=options.js.map
