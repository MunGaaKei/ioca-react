'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var ahooks = require('ahooks');
var classNames = require('classnames');
var react = require('react');
var utils = require('../../js/utils.js');
var helpericon = require('../utils/helpericon/helpericon.js');
var container = require('./container.js');

const Range = (props) => {
    const { label, name, value = props.initValue ?? "", initValue, labelInline, min = -Infinity, max = Infinity, type, className, status = "normal", message, tip, append, prepend, step = 1, thousand, precision, hideControl, placeholder, border, onChange, onBlur, style, ...restProps } = props;
    const state = ahooks.useReactive({
        value,
    });
    const getRangeNumber = (v) => utils.clamp(v, min, max);
    const getFormatNumber = (v) => utils.formatNumber(v, { precision, thousand });
    const formatInputValue = (v) => {
        if (!v)
            return "";
        if (typeof v === "number" || !thousand)
            return v;
        return v.replaceAll(thousand, "");
    };
    const handleChange = (e, i) => {
        const { value } = e.target;
        const v = formatInputValue(value.replace(/[^\d\.-]/g, ""));
        const range = Array.isArray(state.value) ? state.value : [];
        range[i] = +v;
        state.value = range;
        onChange?.(range, e);
    };
    const handleOperate = (e, param, i) => {
        e.preventDefault();
        e.stopPropagation();
        const range = Array.isArray(state.value) ? state.value : [];
        const value = formatInputValue(range[i]) ?? 0;
        const result = getRangeNumber(+value + param);
        range[i] = getFormatNumber(result);
        state.value = range;
        onChange?.(range, e);
    };
    const handleSwitch = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const range = state.value ? state.value : [];
        const v = range[0];
        range[0] = range[1];
        range[1] = v;
        state.value = range;
        onChange?.(range);
    };
    react.useEffect(() => {
        state.value = value;
    }, [value]);
    const inputProps = {
        name,
        className: "i-input i-input-number",
        ...restProps,
    };
    return (jsxRuntime.jsx(container.default, { label: label, labelInline: labelInline, className: className, style: style, tip: message ?? tip, status: status, children: jsxRuntime.jsxs("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
            }), children: [prepend && jsxRuntime.jsx("div", { className: 'i-input-prepend', children: prepend }), !hideControl && (jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.MinusRound, {}), onClick: (e) => handleOperate(e, -step, 0) })), jsxRuntime.jsx("input", { value: state.value?.[0] || "", placeholder: placeholder?.[0], ...inputProps, onChange: (e) => handleChange(e, 0) }), !hideControl && (jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.PlusRound, {}), onClick: (e) => handleOperate(e, step, 0) })), jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.SyncAltRound, {}), style: { margin: 0 }, onClick: handleSwitch }), !hideControl && (jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.MinusRound, {}), onClick: (e) => handleOperate(e, -step, 1) })), jsxRuntime.jsx("input", { value: state.value?.[1] || "", placeholder: placeholder?.[1], ...inputProps, onChange: (e) => handleChange(e, 1) }), !hideControl && (jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.PlusRound, {}), onClick: (e) => handleOperate(e, step, 1) })), append && jsxRuntime.jsx("div", { className: 'i-input-append', children: append })] }) }));
};

exports.default = Range;
//# sourceMappingURL=range.js.map
