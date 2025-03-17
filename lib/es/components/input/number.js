import { jsx, jsxs } from 'react/jsx-runtime';
import { MinusRound, PlusRound } from '@ricons/material';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useEffect } from 'react';
import { formatNumber, clamp } from '../../js/utils.js';
import Helpericon from '../utils/helpericon/helpericon.js';
import InputContainer from './container.js';

const Number = (props) => {
    const { ref, label, name, value = props.initValue ?? "", initValue, labelInline, step = 1, min = -Infinity, max = Infinity, thousand, precision, type, className, status = "normal", append, border, prepend, message, tip, hideControl, style, onChange, onEnter, onInput, onBlur, ...restProps } = props;
    const state = useReactive({
        value,
    });
    const getRangeNumber = (v) => clamp(v, min, max);
    const getFormatNumber = (v) => formatNumber(v, { precision, thousand });
    const formatInputValue = (v) => {
        if (!v)
            return "";
        if (typeof v === "number" || !thousand)
            return v;
        return v.replaceAll(thousand, "");
    };
    const handleChange = (e) => {
        const { value } = e.target;
        const v = formatInputValue(value.replace(/[^\d\.-]/g, ""));
        state.value = v;
        onChange?.(+v, e);
    };
    const handleOperate = (param) => {
        const value = formatInputValue(state.value) ?? 0;
        const result = getRangeNumber(+value + param);
        state.value = getFormatNumber(result);
        onChange?.(result);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    const inputProps = {
        ref,
        name,
        value: state.value,
        className: "i-input i-input-number",
        onChange: handleChange,
        ...restProps,
    };
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: style, tip: message ?? tip, status: status, children: jsxs("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
            }), children: [prepend && jsx("div", { className: 'i-input-prepend', children: prepend }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(MinusRound, {}), onClick: () => handleOperate(-step) })), jsx("input", { ...inputProps }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(PlusRound, {}), onClick: () => handleOperate(step) })), append && jsx("div", { className: 'i-input-append', children: append })] }) }));
};

export { Number as default };
//# sourceMappingURL=number.js.map
