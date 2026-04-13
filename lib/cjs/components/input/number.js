'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var react = require('react');
var utils = require('../../js/utils.js');
var helpericon = require('../utils/helpericon/helpericon.js');
var container = require('./container.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Number = (props) => {
    const { ref, label, name, value = "", labelInline, step = 1, min = -Infinity, max = Infinity, thousand, precision, type, className, width, status = "normal", append, border, underline, prepend, disabled, message, tip, hideControl, showMax, style, onChange, onEnter, onInput, onBlur, ...restProps } = props;
    const [inputValue, setInputValue] = react.useState(value === undefined || value === null ? "" : String(value));
    const formatOut = (num) => {
        const v = utils.clamp(num, min, max);
        if (precision !== undefined)
            return utils.formatNumber(v, { precision, thousand });
        const s = String(v);
        if (!thousand)
            return s;
        const negative = s.startsWith("-");
        const body = negative ? s.slice(1) : s;
        const [integer, decimal] = body.split(".");
        const withThousand = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
        return decimal
            ? `${negative ? "-" : ""}${withThousand}.${decimal}`
            : `${negative ? "-" : ""}${withThousand}`;
    };
    const sanitizeNumberInput = (raw) => {
        const hasMinus = raw.startsWith("-");
        let v = raw.replace(/[^\d.]/g, "");
        if (hasMinus)
            v = `-${v}`;
        const parts = v.split(".");
        if (parts.length > 1) {
            v = `${parts.shift()}.${parts.join("")}`;
        }
        return v;
    };
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
        const v = sanitizeNumberInput(formatInputValue(value));
        const isIntermediate = v === "" || v === "-" || v === "." || v === "-." || v.endsWith(".");
        setInputValue(v);
        if (isIntermediate)
            return;
        const num = parseFloat(v);
        if (globalThis.Number.isNaN(num))
            return;
        onChange?.(utils.clamp(num, min, max), e);
        if (precision !== undefined)
            setInputValue(formatOut(num));
    };
    const handleOperate = (param) => {
        const value = parseFloat(formatInputValue(inputValue)) || 0; // 确保值为数字，默认值为 0
        const result = value + param;
        setInputValue(formatOut(result));
        onChange?.(utils.clamp(result, min, max));
    };
    const handleMax = () => {
        setInputValue(formatOut(max));
        onChange?.(utils.clamp(max, min, max));
    };
    const handleBlur = (e) => {
        onBlur?.(e);
        const v = sanitizeNumberInput(formatInputValue(inputValue));
        if (!v || v === "-" || v === "." || v === "-.") {
            setInputValue("");
            return;
        }
        const num = parseFloat(v);
        if (globalThis.Number.isNaN(num))
            return;
        const numValue = utils.clamp(num, min, max);
        setInputValue(formatOut(numValue));
        onChange?.(numValue, e);
    };
    react.useEffect(() => {
        setInputValue(value === undefined || value === null ? "" : String(value));
    }, [value]);
    const inputProps = {
        ref,
        name,
        disabled,
        value: inputValue,
        className: "i-input i-input-number",
        onChange: handleChange,
        onKeyDown: (e) => {
            e.code === "Enter" && onEnter?.(e);
        },
        onInput,
        onBlur: handleBlur,
        ...restProps,
    };
    return (jsxRuntime.jsx(container.default, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, children: jsxRuntime.jsxs("div", { className: classNames__default("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
                "i-input-underline": underline,
            }), children: [prepend && jsxRuntime.jsx("div", { className: 'i-input-prepend', children: prepend }), !hideControl && !disabled && (jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.MinusRound, {}), onClick: () => handleOperate(-step) })), jsxRuntime.jsx("input", { ...inputProps }), !hideControl && !disabled && (jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.PlusRound, {}), onClick: () => handleOperate(step) })), showMax && max && !disabled && (jsxRuntime.jsx(helpericon.default, { active: true, icon: jsxRuntime.jsx(material.KeyboardDoubleArrowUpRound, {}), onClick: handleMax })), append && jsxRuntime.jsx("div", { className: 'i-input-append', children: append })] }) }));
};

exports.default = Number;
//# sourceMappingURL=number.js.map
