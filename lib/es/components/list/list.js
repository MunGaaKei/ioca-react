import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { forwardRef, Children, cloneElement } from 'react';
import Item from './item.js';

const List = forwardRef((props, ref) => {
    const { label, type, border, padding, className, style, children, ...restProps } = props;
    return (jsx("ul", { ref: ref, className: classNames("i-list", className, {
            "i-list-option-type": type === "option",
        }), style: {
            ...(padding !== undefined
                ? { "--option-gap": typeof padding === "number" ? `${padding}px` : padding }
                : undefined),
            ...style,
        }, ...restProps, children: Children.map(children, (node, i) => {
            const renderLabel = typeof label === "function" ? label(i) : label;
            const { type: elementType, props: nodeProps } = node;
            if (elementType === Item) {
                return cloneElement(node, {
                    label: renderLabel,
                    ...nodeProps,
                    type: props.type,
                    border,
                });
            }
            return node;
        }) }));
});
List.Item = Item;

export { List as default };
