'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');

function Item(props) {
    const { index = 0, itemIndex = 0, active, type, transition, gap = 0, itemHeight, vertical, style, className, children, onItemClick, } = props;
    const selfStyle = react.useMemo(() => {
        if (type === "normal") {
            return {
                [vertical ? "paddingBlock" : "paddingInline"]: gap / 2,
                height: itemHeight,
            };
        }
        return {
            transform: `translate(-${index * 100}%, 0)`,
            transition,
        };
    }, [index, gap, itemHeight, vertical, type]);
    return (jsxRuntime.jsx("div", { style: { ...style, ...selfStyle }, className: classNames("i-swiper-item", className, {
            "i-swiper-active": active,
        }), "data-index": itemIndex, onClick: (e) => onItemClick?.(itemIndex, e), children: children }));
}

exports.default = Item;
//# sourceMappingURL=item.js.map
