'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

const Item = (props) => {
    const { ref, active, type, align, disabled, label, style, className, children, ...restProps } = props;
    return (jsxRuntime.jsxs("li", { ref: ref, className: classNames("i-list-item", className, {
            "i-list-item-active": active,
            "i-list-option": type === "option",
            disabled,
        }), style: { alignItems: align, ...style }, ...restProps, children: [label !== undefined && (jsxRuntime.jsx("span", { className: 'i-list-item-label', children: label })), children] }));
};

exports.default = Item;
//# sourceMappingURL=item.js.map
