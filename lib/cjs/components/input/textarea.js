'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ahooks = require('ahooks');
var classNames = require('classnames');
var react = require('react');
var container = require('./container.js');

const Textarea = (props) => {
    const { ref, label, name, value = props.initValue, initValue, labelInline, className, status = "normal", message, tip, autoSize, border, style, onChange, onEnter, ...restProps } = props;
    const state = ahooks.useReactive({
        value,
    });
    const refTextarea = react.useRef(null);
    const handleChange = (e) => {
        const v = e.target.value;
        state.value = v;
        const ta = refTextarea.current?.firstChild;
        if (autoSize && ta) {
            ta.style.height = `${ta.scrollHeight}px`;
        }
        onChange?.(v, e);
    };
    const handleKeydown = (e) => {
        if (e.code !== "Enter")
            return;
        e.stopPropagation();
        onEnter?.(e);
    };
    react.useEffect(() => {
        state.value = value;
    }, [value]);
    const inputProps = {
        ref,
        name,
        value: state.value,
        className: "i-input i-textarea",
        onChange: handleChange,
        onKeyDown: handleKeydown,
        ...restProps,
    };
    return (jsxRuntime.jsx(container.default, { label: label, labelInline: labelInline, className: className, style: style, tip: message ?? tip, status: status, children: jsxRuntime.jsx("div", { ref: refTextarea, className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
            }), children: jsxRuntime.jsx("textarea", { ...inputProps }) }) }));
};

exports.default = Textarea;
//# sourceMappingURL=textarea.js.map
