import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useState, useRef, useEffect, useImperativeHandle } from 'react';
import InputContainer from './container.js';

const Textarea = (props) => {
    const { ref, label, name, value = "", labelInline, className, status = "normal", message, tip, autoSize, border, width, style, onChange, onEnter, ...restProps } = props;
    const [textareaValue, setTextareaValue] = useState(value);
    const refTextarea = useRef(null);
    const handleChange = (e) => {
        const v = e.target.value;
        setTextareaValue(v);
        const ta = refTextarea.current;
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
    useEffect(() => {
        setTextareaValue(value);
    }, [value]);
    useImperativeHandle(ref, () => {
        return {
            input: refTextarea.current,
        };
    });
    const inputProps = {
        ref: refTextarea,
        name,
        value: textareaValue,
        className: "i-input i-textarea",
        onChange: handleChange,
        onKeyDown: handleKeydown,
        ...restProps,
    };
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, children: jsx("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
            }), children: jsx("textarea", { ...inputProps }) }) }));
};

export { Textarea as default };
//# sourceMappingURL=textarea.js.map
