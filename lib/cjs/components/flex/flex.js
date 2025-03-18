'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Flex = (props) => {
    const { as: Component = "div", align, justify, direction, wrap, gap, columns, className, style, ...restProps } = props;
    const gridColumns = react.useMemo(() => {
        if (!columns)
            return;
        if (typeof columns === "number")
            return `repeat(${columns}, 1fr)`;
        return columns;
    }, [columns]);
    return (jsxRuntime.jsx(Component, { ...restProps, style: {
            alignItems: align,
            justifyContent: justify,
            gap,
            flexDirection: direction,
            flexWrap: wrap === true ? "wrap" : wrap,
            gridTemplateColumns: gridColumns,
            ...style,
        }, className: classNames__default(className, {
            [columns ? "grid" : "flex"]: true,
        }) }));
};

exports.default = Flex;
//# sourceMappingURL=flex.js.map
