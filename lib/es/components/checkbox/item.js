import { jsxs, jsx } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useEffect } from 'react';

function CheckboxItem(props) {
    const { type = "default", label, name, value = false, className, status = "normal", message, disabled, partof, optionValue, children, onChange, ...restProps } = props;
    const state = useReactive({
        value,
        status,
        message,
    });
    const isChildrenFn = typeof children === "function";
    const handleChange = (e) => {
        const checked = e.target.checked;
        Object.assign(state, {
            value: checked,
            status,
            message,
        });
        onChange?.(checked, e);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    return (jsxs("label", { className: classNames("i-checkbox-item", {
            [`i-checkbox-${state.status}`]: state.status !== "normal",
            disabled,
        }, className), ...restProps, children: [jsx("input", { type: 'checkbox', name: name, className: classNames("i-checkbox-input", {
                    [`i-checkbox-${type}`]: !partof,
                    "i-checkbox-partof": partof,
                }), checked: state.value, disabled: disabled, onChange: handleChange }), isChildrenFn ? (children(state.value, optionValue)) : (jsx("span", { className: 'i-checkbox-text', children: children || label })), state.message && (jsxs("span", { className: 'i-checkbox-message', children: ["*", state.message] }))] }));
}

export { CheckboxItem as default };
//# sourceMappingURL=item.js.map
