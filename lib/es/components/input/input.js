import { jsx, jsxs } from 'react/jsx-runtime';
import { VisibilityRound, VisibilityOffRound } from '@ricons/material';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useMemo, useEffect } from 'react';
import Helpericon from '../utils/helpericon/helpericon.js';
import InputContainer from './container.js';
import Number from './number.js';
import Range from './range.js';
import Textarea from './textarea.js';

const Input = ((props) => {
    const { ref, type = "text", label, name, value = "", prepend, append, labelInline, className, status = "normal", message, tip, clear, width, hideVisible, border, underline, required, maxLength, onChange, onEnter, style, ...restProps } = props;
    const state = useReactive({
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
    const HelperIcon = useMemo(() => {
        if (type === "password") {
            return state.visible ? jsx(VisibilityRound, {}) : jsx(VisibilityOffRound, {});
        }
        return undefined;
    }, [state.visible]);
    useEffect(() => {
        state.value = value;
    }, [value]);
    const inputProps = {
        ref,
        type: state.type,
        name,
        value: state.value,
        maxLength,
        className: classNames("i-input", `i-input-${type}`),
        onChange: handleChange,
        onKeyDown: handleKeydown,
        ...restProps,
    };
    const clearable = clear && state.value;
    const showHelper = type === "password" && !!state.value;
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, required: required, children: jsxs("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
                "i-input-underline": underline,
            }), children: [prepend && jsx("div", { className: 'i-input-prepend', children: prepend }), jsx("input", { ...inputProps }), maxLength && state.value?.length > 0 && (jsxs("span", { className: 'color-8 pr-4 font-sm', children: [state.value.length, " / ", maxLength] })), jsx(Helpericon, { active: !!clearable || showHelper, icon: HelperIcon, onClick: handleHelperClick }), append && jsx("div", { className: 'i-input-append', children: append })] }) }));
});
Input.Textarea = Textarea;
Input.Number = Number;
Input.Range = Range;

export { Input as default };
//# sourceMappingURL=input.js.map
