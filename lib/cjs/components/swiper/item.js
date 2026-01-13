'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

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
    return (jsxRuntime.jsx("div", { style: { ...style, ...selfStyle }, className: classNames__default("i-swiper-item", className, {
            "i-swiper-active": active,
        }), "data-index": itemIndex, onClick: (e) => onItemClick?.(itemIndex, e), children: children }));
}

exports.default = Item;
//# sourceMappingURL=item.js.map
