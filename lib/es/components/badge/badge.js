import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

const Badge = (props) => {
    const { content, contentClass, dot, dotSize, round, disabled, style, className, children, } = props;
    return (jsxs("div", { style: style, className: classNames("i-badge", { rounded: round }, className), children: [children, jsx("div", { className: classNames("i-badge-content", contentClass, {
                    "i-badge-dot": dot,
                    "i-badge-hidden": disabled,
                }), style: { fontSize: dotSize }, children: content })] }));
};

export { Badge as default };
//# sourceMappingURL=badge.js.map
