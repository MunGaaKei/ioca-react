'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var container = require('./container.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Textarea = (props) => {
    const { ref, label, name, value = "", labelInline, className, status = "normal", message, tip, autoSize, border, width, style, resize, onChange, onEnter, ...restProps } = props;
    const [textareaValue, setTextareaValue] = react.useState(value);
    const refTextarea = react.useRef(null);
    const syncTextareaHeight = () => {
        const ta = refTextarea.current;
        if (!autoSize || !ta)
            return;
        ta.style.height = "auto";
        ta.style.height = `${ta.scrollHeight}px`;
    };
    const handleChange = (e) => {
        const v = e.target.value;
        setTextareaValue(v);
        onChange?.(v, e);
    };
    const handleKeydown = (e) => {
        if (e.code !== "Enter")
            return;
        e.stopPropagation();
        onEnter?.(e);
    };
    react.useEffect(() => {
        setTextareaValue(value);
    }, [value]);
    react.useEffect(() => {
        syncTextareaHeight();
    }, [autoSize, textareaValue]);
    react.useImperativeHandle(ref, () => {
        return {
            input: refTextarea.current,
        };
    });
    const inputProps = {
        ref: refTextarea,
        name,
        value: textareaValue,
        className: "i-input i-textarea",
        style: resize === false ? { resize: "none" } : undefined,
        onChange: handleChange,
        onKeyDown: handleKeydown,
        ...restProps,
    };
    return (jsxRuntime.jsx(container.default, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, children: jsxRuntime.jsx("div", { className: classNames__default("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
            }), children: jsxRuntime.jsx("textarea", { ...inputProps }) }) }));
};

exports.default = Textarea;
//# sourceMappingURL=textarea.js.map
