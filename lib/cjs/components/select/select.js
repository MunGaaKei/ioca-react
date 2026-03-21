'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var radash = require('radash');
var react = require('react');
var utils = require('../../js/utils.js');
var popup = require('../popup/popup.js');
var helpericon = require('../utils/helpericon/helpericon.js');
var options = require('./options.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Select = (props) => {
    const { ref, type = "text", name, label, value = "", placeholder, options: options$1 = [], multiple, prepend, append, labelInline, style, className, message, status = "normal", hideClear, hideArrow, maxDisplay, border, filter, tip, filterPlaceholder = "...", popupProps, onSelect, onChange, ...restProps } = props;
    const [filterValue, setFilterValue] = react.useState("");
    const [selectedValue, setSelectedValue] = react.useState(value);
    const [active, setActive] = react.useState(false);
    const formattedOptions = react.useMemo(() => utils.formatOption(options$1), [options$1]);
    const filterOptions = react.useMemo(() => {
        const fv = filterValue;
        if (!fv || !filter)
            return formattedOptions;
        const filterFn = typeof filter === "function"
            ? filter
            : (opt) => opt.value.includes(fv) || opt.label.includes(fv);
        return formattedOptions.filter(filterFn);
    }, [formattedOptions, filter, filterValue]);
    const changeValue = (v) => {
        setSelectedValue(v);
        onChange?.(v);
    };
    const displayLabel = react.useMemo(() => {
        if (multiple) {
            return "";
        }
        const option = formattedOptions.find((opt) => opt.value === selectedValue);
        return option ? option.label : selectedValue;
    }, [selectedValue, formattedOptions]);
    const handleSelect = (value, option) => {
        onSelect?.(value, option);
        if (multiple) {
            const values = [...selectedValue];
            const i = values.findIndex((v) => v === value);
            i > -1 ? values.splice(i, 1) : values.push(value);
            changeValue(values);
            return;
        }
        setActive(false);
        changeValue(value);
    };
    const handleVisibleChange = (visible) => {
        setActive(visible);
        if (!filter)
            return;
        setFilterValue("");
    };
    const handleHelperClick = (e) => {
        e.stopPropagation();
        setActive(true);
        if (!active)
            return;
        changeValue(multiple ? [] : "");
    };
    const handleFilterChange = radash.debounce({ delay: 400 }, (e) => {
        const v = e.target.value;
        setFilterValue(v);
    });
    const handleInputChange = (e) => {
        setFilterValue(e.target.value);
    };
    react.useEffect(() => {
        setSelectedValue(value);
    }, [value]);
    const hasValue = multiple
        ? selectedValue.length > 0
        : !!selectedValue;
    const clearable = !hideClear && active && hasValue;
    const text = message ?? tip;
    return (jsxRuntime.jsxs("label", { className: classNames__default("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && jsxRuntime.jsx("span", { className: 'i-input-label-text', children: label }), jsxRuntime.jsx(popup.default, { position: 'bottom', arrow: false, fitSize: true, offset: 0, ...popupProps, visible: active, trigger: 'none', onVisibleChange: handleVisibleChange, content: jsxRuntime.jsx(options.Options, { options: filterOptions, value: selectedValue, multiple: multiple, filter: !!filter, filterPlaceholder: filterPlaceholder, onSelect: handleSelect, onFilter: handleFilterChange }), children: jsxRuntime.jsxs("div", { className: classNames__default("i-input-item", {
                        [`i-input-${status}`]: status !== "normal",
                        "i-input-borderless": !border,
                        "i-input-focus": active,
                    }), onClick: () => setActive(true), children: [prepend, jsxRuntime.jsx("input", { ref: ref, type: 'hidden', value: selectedValue, ...restProps }), multiple ? (hasValue ? (jsxRuntime.jsx("div", { className: classNames__default("i-input i-select", {
                                "i-select-multiple": multiple,
                            }), children: options.displayValue({
                                options: formattedOptions,
                                value: selectedValue,
                                multiple,
                                maxDisplay,
                                onSelect: handleSelect,
                            }) })) : (jsxRuntime.jsx("input", { className: 'i-input i-select', placeholder: placeholder, readOnly: true }))) : null, !multiple && (jsxRuntime.jsx("input", { value: active ? filterValue : displayLabel, className: 'i-input i-select', placeholder: displayLabel || placeholder, onChange: handleInputChange, readOnly: !filter })), jsxRuntime.jsx(helpericon.default, { active: !hideArrow, icon: clearable ? undefined : jsxRuntime.jsx(material.UnfoldMoreRound, {}), onClick: handleHelperClick }), append] }) }), text && jsxRuntime.jsx("span", { className: 'i-input-message', children: text })] }));
};

exports.default = Select;
//# sourceMappingURL=select.js.map
