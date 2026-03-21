'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var react = require('react');
var helpericon = require('../utils/helpericon/helpericon.js');
var container = require('./container.js');
var number = require('./number.js');
var range = require('./range.js');
var textarea = require('./textarea.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Input = ((props) => {
    const { ref, type = "text", label, name, value = "", prepend, append, labelInline, className, status = "normal", message, tip, clear, width, hideVisible, border, underline, required, maxLength, onChange, onEnter, onClear, style, ...restProps } = props;
    const [inputValue, setInputValue] = react.useState(value);
    const [inputType, setInputType] = react.useState(type);
    const [visible, setVisible] = react.useState(false);
    const handleChange = (e) => {
        const v = e.target.value;
        setInputValue(v);
        onChange?.(v, e);
    };
    const handleKeydown = (e) => {
        e.code === "Enter" && onEnter?.(e);
    };
    const handleHelperClick = () => {
        if (type === "password" && !hideVisible) {
            setVisible((v) => {
                const next = !v;
                setInputType(next ? "text" : "password");
                return next;
            });
            return;
        }
        const v = "";
        setInputValue(v);
        onChange?.(v);
        onClear?.();
    };
    const HelperIcon = react.useMemo(() => {
        if (type === "password") {
            return visible ? jsxRuntime.jsx(material.VisibilityRound, {}) : jsxRuntime.jsx(material.VisibilityOffRound, {});
        }
        return undefined;
    }, [type, visible]);
    react.useEffect(() => {
        setInputValue(value);
    }, [value]);
    const inputProps = {
        ref,
        type: inputType,
        name,
        value: inputValue,
        maxLength,
        className: classNames__default("i-input", `i-input-${type}`),
        onChange: handleChange,
        onKeyDown: handleKeydown,
        ...restProps,
    };
    react.useEffect(() => {
        setInputType(type);
        setVisible(false);
    }, [type]);
    const clearable = clear && inputValue;
    const showHelper = type === "password" && !!inputValue;
    return (jsxRuntime.jsx(container.default, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, required: required, children: jsxRuntime.jsxs("div", { className: classNames__default("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
                "i-input-underline": underline,
            }), children: [prepend && jsxRuntime.jsx("div", { className: 'i-input-prepend', children: prepend }), jsxRuntime.jsx("input", { ...inputProps }), maxLength && inputValue?.length > 0 && (jsxRuntime.jsxs("span", { className: 'color-8 pr-4 font-sm', children: [inputValue.length, " / ", maxLength] })), jsxRuntime.jsx(helpericon.default, { active: !!clearable || showHelper, icon: HelperIcon, onClick: handleHelperClick }), append && jsxRuntime.jsx("div", { className: 'i-input-append', children: append })] }) }));
});
Input.Textarea = textarea.default;
Input.Number = number.default;
Input.Range = range.default;

exports.default = Input;
//# sourceMappingURL=input.js.map
