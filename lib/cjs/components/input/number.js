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
    const { ref, label, name, value = "", labelInline, step = 1, min = -Infinity, max = Infinity, thousand, precision, type, className, width, status = "normal", append, border, prepend, disabled, message, tip, hideControl, showMax, style, onChange, onEnter, onInput, onBlur, ...restProps } = props;
    const state = ahooks.useReactive({
        value,
    });
    const getRangeNumber = (v) => utils.clamp(v, min, max);
    const getFormatNumber = (v) => utils.formatNumber(v, { precision, thousand });
    const formatInputValue = (v) => {
        if (!v)
            return "";
        if (typeof v === "number")
            return v.toString();
        if (!thousand)
            return v;
        return v.split(thousand).join("");
    };
    const handleChange = (e) => {
        const { value } = e.target;
        const v = formatInputValue(value.replace(/[^\d\.-]/g, "")); // 保留负号和小数点
        const numValue = utils.clamp(+v, min, max); // 确保值在范围内
        state.value = getFormatNumber(numValue); // 修复 thousand 格式化
        onChange?.(numValue, e);
    };
    const handleOperate = (param) => {
        const value = parseFloat(formatInputValue(state.value)) || 0; // 确保值为数字，默认值为 0
        const result = getRangeNumber(value + param);
        state.value = getFormatNumber(result);
        onChange?.(result);
    };
    const handleMax = () => {
        const result = getRangeNumber(max);
        state.value = getFormatNumber(result);
        onChange?.(result);
    };
    react.useEffect(() => {
        state.value = value;
    }, [value]);
    const inputProps = {
        ref,
        name,
        disabled,
        value: state.value,
        className: "i-input i-input-number",
        onChange: handleChange,
        ...restProps,
    };
    return (jsxRuntime.jsx(container.default, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, children: jsxRuntime.jsxs("div", { className: classNames__default("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
            }), children: [prepend && jsxRuntime.jsx("div", { className: 'i-input-prepend', children: prepend }), !hideControl && !disabled && (jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.MinusRound, {}), onClick: () => handleOperate(-step) })), jsxRuntime.jsx("input", { ...inputProps }), !hideControl && !disabled && (jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.PlusRound, {}), onClick: () => handleOperate(step) })), showMax && max && !disabled && (jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.KeyboardDoubleArrowUpRound, {}), onClick: handleMax })), append && jsxRuntime.jsx("div", { className: 'i-input-append', children: append })] }) }));
};

exports.default = Number;
//# sourceMappingURL=number.js.map
