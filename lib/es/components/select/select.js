import { jsxs, jsx } from 'react/jsx-runtime';
import { UnfoldMoreRound } from '@ricons/material';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { debounce } from 'radash';
import { useState, useMemo, useEffect } from 'react';
import { formatOption } from '../../js/utils.js';
import Popup from '../popup/popup.js';
import Helpericon from '../utils/helpericon/helpericon.js';
import { Options, displayValue } from './options.js';

const Select = (props) => {
    const { ref, type = "text", name, label, value = "", placeholder, options = [], multiple, prepend, append, labelInline, style, className, message, status = "normal", hideClear, hideArrow, maxDisplay, border, filter, tip, filterPlaceholder = "...", popupProps, onSelect, onChange, ...restProps } = props;
    const state = useReactive({
        inputValue: "",
        filterValue: "",
        value,
        loading: false,
    });
    const [active, setActive] = useState(false);
    const formattedOptions = useMemo(() => formatOption(options), [options]);
    const filterOptions = useMemo(() => {
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
    const handleFilterChange = debounce({ delay: 400 }, (e) => {
        const v = e.target.value;
        state.filterValue = v;
    });
    const handleInputChange = (e) => {
        state.filterValue = e.target.value;
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    const hasValue = multiple
        ? state.value.length > 0
        : !!state.value;
    const clearable = !hideClear && active && hasValue;
    const text = message ?? tip;
    return (jsxs("label", { className: classNames("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && jsx("span", { className: 'i-input-label-text', children: label }), jsx(Popup, { position: 'bottom', arrow: false, fitSize: true, ...popupProps, visible: active, trigger: 'none', onVisibleChange: handleVisibleChange, content: jsx(Options, { options: filterOptions, value: state.value, multiple: multiple, filter: !!filter, filterPlaceholder: filterPlaceholder, onSelect: handleSelect, onFilter: handleFilterChange }), children: jsxs("div", { className: classNames("i-input-item", {
                        [`i-input-${status}`]: status !== "normal",
                        "i-input-borderless": !border,
                        "i-input-focus": active,
                    }), onClick: () => setActive(true), children: [prepend, jsx("input", { ref: ref, type: 'hidden', value: state.value, ...restProps }), multiple ? (hasValue ? (jsx("div", { className: classNames("i-input i-select", {
                                "i-select-multiple": multiple,
                            }), children: displayValue({
                                options: formattedOptions,
                                value: state.value,
                                multiple,
                                maxDisplay,
                                onSelect: handleSelect,
                            }) })) : (jsx("input", { className: 'i-input i-select', placeholder: placeholder, readOnly: true }))) : null, !multiple && (jsx("input", { value: active ? state.filterValue : state.value, className: 'i-input i-select', placeholder: state.value || placeholder, onChange: handleInputChange, readOnly: !filter })), jsx(Helpericon, { active: !hideArrow, icon: clearable ? undefined : jsx(UnfoldMoreRound, {}), onClick: handleHelperClick }), append] }) }), text && jsx("span", { className: 'i-input-message', children: text })] }));
};

export { Select as default };
//# sourceMappingURL=select.js.map
