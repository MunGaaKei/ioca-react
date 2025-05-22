import { jsx, jsxs } from 'react/jsx-runtime';
import classNames from 'classnames';
import { Fragment } from 'react';

const Description = (props) => {
    const { data, colon, columns = 1, gap = ".5em", align, labelWidth, labelAlign, vertical, equally, style, className, } = props;
    return (jsx("div", { className: classNames("i-description", className), style: {
            ["--description-label-width"]: labelWidth,
            gridTemplateColumns: `repeat(${columns}, ${equally ? "1fr" : "auto"})`,
            gap,
            textAlign: align,
            ...style,
        }, children: data.map((item, i) => {
            const { label, value, style, hidden, rowSpan = 1, colSpan = 1, } = item;
            if (hidden)
                return jsx(Fragment, {}, i);
            return (jsxs("div", { className: classNames("i-description-item", {
                    "i-description-item-vertical": vertical,
                }), style: {
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                    ...style,
                }, children: [label && (jsxs("div", { className: 'i-description-label', style: { textAlign: labelAlign }, children: [label, colon] })), jsx("div", { className: 'i-description-value', children: value })] }, i));
        }) }));
};

export { Description as default };
//# sourceMappingURL=description.js.map
