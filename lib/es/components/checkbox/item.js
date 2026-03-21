import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useState, useEffect } from 'react';

function CheckboxItem(props) {
    const { type = "default", label, name, value = false, className, status = "normal", message, disabled, partof, optionValue, children, onChange, ...restProps } = props;
    const [checked, setChecked] = useState(value);
    const [itemStatus, setItemStatus] = useState(status);
    const [itemMessage, setItemMessage] = useState(message);
    const isChildrenFn = typeof children === "function";
    const handleChange = (e) => {
        const next = e.target.checked;
        setChecked(next);
        setItemStatus(status);
        setItemMessage(message);
        onChange?.(next, e);
    };
    useEffect(() => {
        setChecked(value);
    }, [value]);
    useEffect(() => {
        setItemStatus(status);
        setItemMessage(message);
    }, [status, message]);
    return (jsxs("label", { className: classNames("i-checkbox-item", {
            [`i-checkbox-${itemStatus}`]: itemStatus !== "normal",
            disabled,
        }, className), ...restProps, children: [jsx("input", { type: 'checkbox', name: name, className: classNames("i-checkbox-input", {
                    [`i-checkbox-${type}`]: !partof,
                    "i-checkbox-partof": partof,
                }), checked: checked, disabled: disabled, onChange: handleChange }), isChildrenFn ? (children(checked, optionValue)) : (jsx("span", { className: 'i-checkbox-text', children: children || label })), itemMessage && (jsxs("span", { className: 'i-checkbox-message', children: ["*", itemMessage] }))] }));
}

export { CheckboxItem as default };
//# sourceMappingURL=item.js.map
