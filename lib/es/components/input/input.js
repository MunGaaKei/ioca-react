import { jsx, jsxs } from 'react/jsx-runtime';
import { VisibilityRound, VisibilityOffRound } from '@ricons/material';
import classNames from 'classnames';
import { useState, useMemo, useEffect } from 'react';
import Helpericon from '../utils/helpericon/helpericon.js';
import InputContainer from './container.js';
import Number from './number.js';
import Range from './range.js';
import Textarea from './textarea.js';

const Input = ((props) => {
    const { ref, type = "text", label, name, value = "", prepend, append, labelInline, className, status = "normal", message, tip, clear, width, hideVisible, border, underline, required, maxLength, onChange, onEnter, onClear, style, ...restProps } = props;
    const [inputValue, setInputValue] = useState(value);
    const [inputType, setInputType] = useState(type);
    const [visible, setVisible] = useState(false);
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
    const HelperIcon = useMemo(() => {
        if (type === "password") {
            return visible ? jsx(VisibilityRound, {}) : jsx(VisibilityOffRound, {});
        }
        return undefined;
    }, [type, visible]);
    useEffect(() => {
        setInputValue(value);
    }, [value]);
    const inputProps = {
        ref,
        type: inputType,
        name,
        value: inputValue,
        maxLength,
        className: classNames("i-input", `i-input-${type}`),
        onChange: handleChange,
        onKeyDown: handleKeydown,
        ...restProps,
    };
    useEffect(() => {
        setInputType(type);
        setVisible(false);
    }, [type]);
    const clearable = clear && inputValue;
    const showHelper = type === "password" && !!inputValue;
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, required: required, children: jsxs("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
                "i-input-underline": underline,
            }), children: [prepend && jsx("div", { className: 'i-input-prepend', children: prepend }), jsx("input", { ...inputProps }), maxLength && inputValue?.length > 0 && (jsxs("span", { className: 'color-8 pr-4 font-sm', children: [inputValue.length, " / ", maxLength] })), jsx(Helpericon, { active: !!clearable || showHelper, icon: HelperIcon, onClick: handleHelperClick }), append && jsx("div", { className: 'i-input-append', children: append })] }) }));
});
Input.Textarea = Textarea;
Input.Number = Number;
Input.Range = Range;

export { Input as default };
//# sourceMappingURL=input.js.map
