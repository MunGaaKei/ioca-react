'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var ahooks = require('ahooks');
var classNames = require('classnames');
var radash = require('radash');
var react = require('react');
var utils = require('../../js/utils.js');
var popup = require('../popup/popup.js');
var helpericon = require('../utils/helpericon/helpericon.js');
var options = require('./options.js');

const Select = (props) => {
    const { ref, type = "text", name, label, value = "", placeholder, options: options$1 = [], multiple, prepend, append, labelInline, style, className, message, status = "normal", hideClear, hideArrow, maxDisplay, border, filter, tip, filterPlaceholder = "...", popupProps, onSelect, onChange, ...restProps } = props;
    const state = ahooks.useReactive({
        inputValue: "",
        filterValue: "",
        value,
        loading: false,
    });
    const [active, setActive] = react.useState(false);
    const formattedOptions = react.useMemo(() => utils.formatOption(options$1), [options$1]);
    const filterOptions = react.useMemo(() => {
        const { filterValue: fv } = state;
        if (!fv || !filter)
            return formattedOptions;
        const filterFn = typeof filter === "function"
            ? filter
            : (opt) => opt.value.includes(fv) || opt.label.includes(fv);
        return formattedOptions.filter(filterFn);
    }, [formattedOptions, filter, state.filterValue]);
    const changeValue = (v) => {
        state.value = v;
        onChange?.(v);
    };
    const handleSelect = (value, option) => {
        onSelect?.(value, option);
        if (multiple) {
            const values = [...state.value];
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
        state.filterValue = "";
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
        state.filterValue = v;
    });
    const handleInputChange = (e) => {
        state.filterValue = e.target.value;
    };
    react.useEffect(() => {
        state.value = value;
    }, [value]);
    const hasValue = multiple
        ? state.value.length > 0
        : !!state.value;
    const clearable = !hideClear && active && hasValue;
    const text = message ?? tip;
    return (jsxRuntime.jsxs("label", { className: classNames("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && jsxRuntime.jsx("span", { className: 'i-input-label-text', children: label }), jsxRuntime.jsx(popup.default, { position: 'bottom', arrow: false, fitSize: true, ...popupProps, visible: active, trigger: 'none', onVisibleChange: handleVisibleChange, content: jsxRuntime.jsx(options.Options, { options: filterOptions, value: state.value, multiple: multiple, filter: !!filter, filterPlaceholder: filterPlaceholder, onSelect: handleSelect, onFilter: handleFilterChange }), children: jsxRuntime.jsxs("div", { className: classNames("i-input-item", {
                        [`i-input-${status}`]: status !== "normal",
                        "i-input-borderless": !border,
                        "i-input-focus": active,
                    }), onClick: () => setActive(true), children: [prepend, jsxRuntime.jsx("input", { ref: ref, type: 'hidden', value: state.value, ...restProps }), multiple ? (hasValue ? (jsxRuntime.jsx("div", { className: classNames("i-input i-select", {
                                "i-select-multiple": multiple,
                            }), children: options.displayValue({
                                options: formattedOptions,
                                value: state.value,
                                multiple,
                                maxDisplay,
                                onSelect: handleSelect,
                            }) })) : (jsxRuntime.jsx("input", { className: 'i-input i-select', placeholder: placeholder, readOnly: true }))) : null, !multiple && (jsxRuntime.jsx("input", { value: active ? state.filterValue : state.value, className: 'i-input i-select', placeholder: state.value || placeholder, onChange: handleInputChange, readOnly: !filter })), jsxRuntime.jsx(helpericon.default, { active: !hideArrow, icon: clearable ? undefined : jsxRuntime.jsx(material.UnfoldMoreRound, {}), onClick: handleHelperClick }), append] }) }), text && jsxRuntime.jsx("span", { className: 'i-input-message', children: text })] }));
};

exports.default = Select;
//# sourceMappingURL=select.js.map
