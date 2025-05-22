import { jsxs, jsx } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useMemo, useEffect } from 'react';
import { formatOption } from '../../js/utils.js';
import CheckboxItem from './item.js';

function Checkbox(props) {
    const { label, name, options = [], value = "", type = "default", optionInline = true, labelInline, disabled, status = "normal", message, required, className, renderItem, onChange, ...restProps } = props;
    const state = useReactive({
        value,
    });
    const formattedOptions = useMemo(() => formatOption(options), [options]);
    const handleChange = (checked, opt, e) => {
        const group = [...state.value];
        const i = group.findIndex((item) => item === opt.value);
        if (checked && i < 0) {
            group.push(opt.value);
        }
        else if (!checked && i > -1) {
            group.splice(i, 1);
        }
        state.value = group;
        onChange?.(group, opt, e);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    return (jsxs("div", { className: classNames("i-checkbox i-input-label", {
            [`i-checkbox-${status}`]: status !== "normal",
            "i-input-inline": labelInline,
        }, className), ...restProps, children: [label && (jsxs("span", { className: 'i-input-label-text', children: [required && jsx("span", { className: 'error', children: "*" }), label, message && jsx("p", { className: 'i-checkbox-message', children: message })] })), jsx("div", { className: classNames("i-checkbox-options", {
                    "i-options-block": !optionInline,
                    "i-checkbox-options-button": type === "button",
                }), children: formattedOptions.map((option) => {
                    return (jsx(CheckboxItem, { name: name, value: state.value.includes(option.value), optionValue: option.value, type: type, disabled: disabled || option.disabled, onChange: (checked, e) => handleChange(checked, option, e), children: renderItem ?? option.label }, option.value));
                }) })] }));
}
Checkbox.Item = CheckboxItem;

export { Checkbox as default };
//# sourceMappingURL=checkbox.js.map
