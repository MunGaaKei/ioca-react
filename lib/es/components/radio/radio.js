import { jsxs, jsx } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useMemo, useEffect } from 'react';
import { formatOption } from '../../js/utils.js';
import RadioItem from './item.js';

function Radio(props) {
    const { label, name, options, value, type = "default", status = "normal", message, optionInline = true, labelInline, disabled, required, className, renderItem, onChange, } = props;
    const state = useReactive({
        value,
    });
    const formattedOptions = useMemo(() => formatOption(options), [options]);
    const handleChange = (value, e) => {
        state.value = value;
        onChange?.(value, e);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    return (jsxs("div", { className: classNames("i-radio i-input-label", {
            [`i-radio-${status}`]: status !== "normal",
            "i-input-inline": labelInline,
        }, className), children: [label && (jsxs("span", { className: 'i-input-label-text', children: [required && jsx("span", { className: 'error', children: "*" }), label, message && jsx("p", { className: 'i-radio-message', children: message })] })), jsx("div", { className: classNames("i-radio-options", {
                    "i-options-block": !optionInline,
                    "i-radio-options-button": type === "button",
                }), children: formattedOptions.map((option) => {
                    const checked = state.value === option.value;
                    return (jsx(RadioItem, { name: name, value: option.value, checked: checked, type: type, disabled: disabled || option.disabled, onChange: handleChange, children: renderItem ?? option.label }, option.value));
                }) })] }));
}
Radio.Item = RadioItem;

export { Radio as default };
//# sourceMappingURL=radio.js.map
