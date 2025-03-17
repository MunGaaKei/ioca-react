import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

function RadioItem(props) {
    const { type = "default", name, value, checked, disabled, children, onChange, } = props;
    const isChildrenFn = typeof children === "function";
    const handleChange = (e) => {
        onChange?.(value, e);
    };
    return (jsxs("label", { className: classNames("i-radio-item", {
            disabled,
            "i-radio-item-custom": isChildrenFn,
        }), children: [jsx("input", { type: 'radio', name: name, checked: checked, className: classNames("i-radio-input", `i-radio-${type}`), disabled: disabled, hidden: isChildrenFn, onChange: handleChange }), isChildrenFn ? (children(!!checked, value)) : (jsx("span", { className: 'i-radio-text', children: children }))] }));
}

export { RadioItem as default };
//# sourceMappingURL=item.js.map
