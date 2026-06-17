import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

const Divider = ({ className, children, color, width, style, ...restProps }) => {
    return (jsx("li", { role: "separator", className: classNames("i-divider", className), style: {
            ...(color !== undefined ? { "--divider-color": color } : undefined),
            ...(width !== undefined ? { "--divider-width": typeof width === "number" ? `${width}px` : width } : undefined),
            ...style,
        }, ...restProps, children: children && jsx("div", { className: "i-divider-content", children: children }) }));
};

export { Divider as default };
