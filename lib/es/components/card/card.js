import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

const Card = (props) => {
    const { hideShadow, border, className, children, header, footer, ...restProps } = props;
    return (jsxs("div", { className: classNames("i-card", className, {
            shadow: !hideShadow,
            "i-card-bordered": border,
        }), ...restProps, children: [header && jsx("div", { className: 'i-card-header', children: header }), children && jsx("div", { className: 'i-card-content', children: children }), footer && jsx("div", { className: 'i-card-footer', children: footer })] }));
};

export { Card as default };
//# sourceMappingURL=card.js.map
