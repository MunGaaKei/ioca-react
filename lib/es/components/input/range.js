import { jsx, jsxs } from 'react/jsx-runtime';
import { MinusRound, PlusRound, SyncAltRound } from '@ricons/material';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useEffect } from 'react';
import { formatNumber, clamp } from '../../js/utils.js';
import Helpericon from '../utils/helpericon/helpericon.js';
import InputContainer from './container.js';

const Range = (props) => {
    const { label, name, value, labelInline, min = -Infinity, max = Infinity, type, className, status = "normal", message, tip, append, prepend, step = 1, width, thousand, precision, hideControl, placeholder, border, autoSwitch, onChange, onBlur, style, ...restProps } = props;
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
    const handleChange = (e, i) => {
        const { value } = e.target;
        const v = formatInputValue(value.replace(/[^\d\.-]/g, ""));
        const range = Array.isArray(state.value) ? state.value : [];
        range[i] = v;
        state.value = range;
        onChange?.(range, e);
    };
    const handleOperate = (e, param, i) => {
        e.preventDefault();
        e.stopPropagation();
        const range = Array.isArray(state.value) ? state.value : [];
        const value = formatInputValue(range[i]) ?? 0;
        const result = getRangeNumber(+value + param);
        range[i] = getFormatNumber(result);
        state.value = range;
        onChange?.(range, e);
    };
    const handleSwitch = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        const range = state.value ? state.value : [];
        [range[0], range[1]] = [range[1], range[0]];
        state.value = range;
        onChange?.(range);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    const inputProps = {
        name,
        className: "i-input i-input-number",
        ...restProps,
    };
    const handleBlur = () => {
        if (!autoSwitch)
            return;
        const range = Array.isArray(state.value) ? state.value : [];
        if (range.length < 2)
            return;
        const [left, right] = range.map(Number);
        if (left > right) {
            handleSwitch();
        }
    };
    return (jsx(InputContainer, { label: label, labelInline: labelInline, className: className, style: { width, ...style }, tip: message ?? tip, status: status, children: jsxs("div", { className: classNames("i-input-item", {
                [`i-input-${status}`]: status !== "normal",
                "i-input-borderless": !border,
            }), children: [prepend && jsx("div", { className: 'i-input-prepend', children: prepend }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(MinusRound, {}), onClick: (e) => handleOperate(e, -step, 0) })), jsx("input", { value: state.value?.[0] || "", placeholder: placeholder?.[0], ...inputProps, onBlur: handleBlur, onChange: (e) => handleChange(e, 0) }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(PlusRound, {}), onClick: (e) => handleOperate(e, step, 0) })), jsx(Helpericon, { active: true, icon: jsx(SyncAltRound, {}), style: { margin: 0 }, onClick: handleSwitch }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(MinusRound, {}), onClick: (e) => handleOperate(e, -step, 1) })), jsx("input", { value: state.value?.[1] || "", placeholder: placeholder?.[1], ...inputProps, onBlur: handleBlur, onChange: (e) => handleChange(e, 1) }), !hideControl && (jsx(Helpericon, { active: true, icon: jsx(PlusRound, {}), onClick: (e) => handleOperate(e, step, 1) })), append && jsx("div", { className: 'i-input-append', children: append })] }) }));
};

export { Range as default };
//# sourceMappingURL=range.js.map
