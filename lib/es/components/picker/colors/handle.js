import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

const Handle = (props) => {
    const { ref, color, handle, placeholder, className, ...restProps } = props;
    return (jsxs("div", { ref: ref, className: classNames("i-colorpicker-handle", className), ...restProps, children: [handle !== "text" && (jsx("i", { className: 'i-colorpicker-square', style: { background: color } })), handle !== "square" && (jsx("span", { className: 'i-colorpicker-text', style: { color }, children: color ?? placeholder }))] }));
};

export { Handle as default };
//# sourceMappingURL=handle.js.map
