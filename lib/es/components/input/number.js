import { jsx, jsxs } from 'react/jsx-runtime';
import { MinusRound, PlusRound, KeyboardDoubleArrowUpRound } from '@ricons/material';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useEffect } from 'react';
import { formatNumber, clamp } from '../../js/utils.js';
import Helpericon from '../utils/helpericon/helpericon.js';
import InputContainer from './container.js';

const Number = (props) => {
    const { ref, label, name, value = "", labelInline, step = 1, min = -Infinity, max = Infinity, thousand, precision, type, className, width, status = "normal", append, border, prepend, disabled, message, tip, hideControl, showMax, style, onChange, onEnter, onInput, onBlur, ...restProps } = props;
    const state = useReactive({
        value,
    });
    const getRangeNumber = (v) => clamp(v, min, max);
    const getFormatNumber = (v) => formatNumber(v, { precision, thousand });
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
        const numValue = clamp(+v, min, max); // 确保值在范围内
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
    useEffect(() => {
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
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, children: jsxs("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
            }), children: [prepend && jsx("div", { className: 'i-input-prepend', children: prepend }), !hideControl && !disabled && (jsx(Helpericon, { active: true, icon: jsx(MinusRound, {}), onClick: () => handleOperate(-step) })), jsx("input", { ...inputProps }), !hideControl && !disabled && (jsx(Helpericon, { active: true, icon: jsx(PlusRound, {}), onClick: () => handleOperate(step) })), showMax && max && !disabled && (jsx(Helpericon, { active: true, icon: jsx(KeyboardDoubleArrowUpRound, {}), onClick: handleMax })), append && jsx("div", { className: 'i-input-append', children: append })] }) }));
};

export { Number as default };
//# sourceMappingURL=number.js.map
