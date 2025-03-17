'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');

const Description = (props) => {
    const { data, colon, columns = 1, gap = ".5em", align, labelWidth, labelAlign, vertical, equally, style, className, } = props;
    return (jsxRuntime.jsx("div", { className: classNames("i-description", className), style: {
            ["--description-label-width"]: labelWidth,
            gridTemplateColumns: `repeat(${columns}, ${equally ? "1fr" : "auto"})`,
            gap,
            textAlign: align,
            ...style,
        }, children: data.map((item, i) => {
            const { label, value, style, hidden, rowSpan = 1, colSpan = 1, } = item;
            if (hidden)
                return jsxRuntime.jsx(react.Fragment, {}, i);
            return (jsxRuntime.jsxs("div", { className: classNames("i-description-item", {
                    "i-description-item-vertical": vertical,
                }), style: {
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                    ...style,
                }, children: [label && (jsxRuntime.jsxs("div", { className: 'i-description-label', style: { textAlign: labelAlign }, children: [label, colon] })), jsxRuntime.jsx("div", { className: 'i-description-value', children: value })] }, i));
        }) }));
};

exports.default = Description;
//# sourceMappingURL=description.js.map
