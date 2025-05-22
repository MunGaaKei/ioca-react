'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var ahooks = require('ahooks');
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
    const { ref, type = "text", label, name, value = "", prepend, append, labelInline, className, status = "normal", message, tip, clear, width, hideVisible, border, underline, required, maxLength, onChange, onEnter, style, ...restProps } = props;
    const state = ahooks.useReactive({
        value,
        type,
        visible: false,
    });
    const handleChange = (e) => {
        const v = e.target.value;
        state.value = v;
        onChange?.(v, e);
    };
    const handleKeydown = (e) => {
        e.code === "Enter" && onEnter?.(e);
    };
    const handleHelperClick = () => {
        if (type === "password" && !hideVisible) {
            Object.assign(state, {
                visible: !state.visible,
                type: !state.visible ? "text" : "password",
            });
            return;
        }
        const v = "";
        onChange?.(v);
    };
    const HelperIcon = react.useMemo(() => {
        if (type === "password") {
            return state.visible ? jsxRuntime.jsx(material.VisibilityRound, {}) : jsxRuntime.jsx(material.VisibilityOffRound, {});
        }
        return undefined;
    }, [state.visible]);
    react.useEffect(() => {
        state.value = value;
    }, [value]);
    const inputProps = {
        ref,
        type: state.type,
        name,
        value: state.value,
        maxLength,
        className: classNames__default("i-input", `i-input-${type}`),
        onChange: handleChange,
        onKeyDown: handleKeydown,
        ...restProps,
    };
    const clearable = clear && state.value;
    const showHelper = type === "password" && !!state.value;
    return (jsxRuntime.jsx(container.default, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, required: required, children: jsxRuntime.jsxs("div", { className: classNames__default("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
                "i-input-underline": underline,
            }), children: [prepend && jsxRuntime.jsx("div", { className: 'i-input-prepend', children: prepend }), jsxRuntime.jsx("input", { ...inputProps }), maxLength && state.value?.length > 0 && (jsxRuntime.jsxs("span", { className: 'color-8 pr-4 font-sm', children: [state.value.length, " / ", maxLength] })), jsxRuntime.jsx(helpericon.default, { active: !!clearable || showHelper, icon: HelperIcon, onClick: handleHelperClick }), append && jsxRuntime.jsx("div", { className: 'i-input-append', children: append })] }) }));
});
Input.Textarea = textarea.default;
Input.Number = number.default;
Input.Range = range.default;

exports.default = Input;
//# sourceMappingURL=input.js.map
