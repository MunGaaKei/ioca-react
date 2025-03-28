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

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Number = (props) => {
    const { ref, label, name, value = props.initValue ?? "", initValue, labelInline, step = 1, min = -Infinity, max = Infinity, thousand, precision, type, className, width, status = "normal", append, border, prepend, message, tip, hideControl, style, onChange, onEnter, onInput, onBlur, ...restProps } = props;
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
    const handleChange = (e) => {
        const { value } = e.target;
        const v = formatInputValue(value.replace(/[^\d\.-]/g, ""));
        state.value = v;
        onChange?.(+v, e);
    };
    const handleOperate = (param) => {
        const value = formatInputValue(state.value) ?? 0;
        const result = getRangeNumber(+value + param);
        state.value = getFormatNumber(result);
        onChange?.(result);
    };
    react.useEffect(() => {
        state.value = value;
    }, [value]);
    const inputProps = {
        ref,
        name,
        value: state.value,
        className: "i-input i-input-number",
        onChange: handleChange,
        ...restProps,
    };
    return (jsxRuntime.jsx(container.default, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, children: jsxRuntime.jsxs("div", { className: classNames__default("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
            }), children: [prepend && jsxRuntime.jsx("div", { className: 'i-input-prepend', children: prepend }), !hideControl && (jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.MinusRound, {}), onClick: () => handleOperate(-step) })), jsxRuntime.jsx("input", { ...inputProps }), !hideControl && (jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.PlusRound, {}), onClick: () => handleOperate(step) })), append && jsxRuntime.jsx("div", { className: 'i-input-append', children: append })] }) }));
};

exports.default = Number;
//# sourceMappingURL=number.js.map
