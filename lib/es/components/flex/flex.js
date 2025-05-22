import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useMemo } from 'react';

const Flex = (props) => {
    const { as: Component = "div", align, justify, direction, wrap, gap, columns, className, style, ...restProps } = props;
    const gridColumns = useMemo(() => {
        if (!columns)
            return;
        if (typeof columns === "number")
            return `repeat(${columns}, 1fr)`;
        return columns;
    }, [columns]);
    return (jsx(Component, { ...restProps, style: {
            alignItems: align,
            justifyContent: justify,
            gap,
            flexDirection: direction,
            flexWrap: wrap === true ? "wrap" : wrap,
            gridTemplateColumns: gridColumns,
            ...style,
        }, className: classNames(className, {
            [columns ? "grid" : "flex"]: true,
        }) }));
};

export { Flex as default };
//# sourceMappingURL=flex.js.map
