import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

const Item = (props) => {
    const { ref, active, type, align, disabled, label, style, border, className, children, ...restProps } = props;
    return (jsxs("li", { ref: ref, className: classNames("i-list-item", className, {
            "i-list-item-active": active,
            "i-list-option": type === "option",
            "i-list-item-bordered": border,
            disabled,
        }), style: { alignItems: align, ...style }, ...restProps, children: [label !== undefined && (jsx("span", { className: 'i-list-item-label', children: label })), children] }));
};

export { Item as default };
//# sourceMappingURL=item.js.map
