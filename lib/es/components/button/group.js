import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useMemo, Children, cloneElement } from 'react';
import Button from './button.js';

function Group(props) {
    const { children, vertical, buttonProps, className, style } = props;
    const nodes = useMemo(() => {
        return Children.map(children, (node) => {
            const { type } = node;
            if (type === Button) {
                return cloneElement(node, Object.assign({}, node.props, buttonProps));
            }
            return node;
        });
    }, [children]);
    return (jsx("div", { className: classNames(className, vertical ? "i-btn-group-vertical" : "i-btn-group-horizonal"), style: style, children: nodes }));
}

export { Group as default };
//# sourceMappingURL=group.js.map
