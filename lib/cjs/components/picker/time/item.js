'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

function Items(props) {
    const { items = [], active, renderItem, unit, onClick } = props;
    return items.map((n) => {
        const isActive = n === active;
        return (jsxRuntime.jsx("a", { className: classNames("i-timepicker-item", {
                "i-timepicker-item-active": isActive,
            }), onClick: () => onClick(n), children: renderItem?.(n, isActive, unit) ?? (n < 10 ? `0${n}` : n) }, n));
    });
}

exports.default = Items;
//# sourceMappingURL=item.js.map
