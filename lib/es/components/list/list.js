import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { Children, cloneElement } from 'react';
import Item from './item.js';

const List = (props) => {
    const { label, type, border, className, children, ...restProps } = props;
    return (jsx("ul", { className: classNames("i-list", className), ...restProps, children: Children.map(children, (node, i) => {
            const renderLabel = typeof label === "function" ? label(i) : label;
            const { type, props: nodeProps } = node;
            if (type === Item) {
                return cloneElement(node, {
                    label: renderLabel,
                    ...nodeProps,
                    type: props.type,
                    border,
                });
            }
            return node;
        }) }));
};
List.Item = Item;

export { List as default };
//# sourceMappingURL=list.js.map
