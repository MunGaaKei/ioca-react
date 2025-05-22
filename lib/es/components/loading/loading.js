import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

const Loading = (props) => {
    const { icon, text, size, absolute, style, className, ...restProps } = props;
    return (jsxs("div", { className: classNames("i-loading-container", {
            absolute,
        }, className), style: {
            ...style,
            inset: absolute ? 0 : "unset",
        }, ...restProps, children: [icon ?? (jsx("svg", { width: '24', height: '24', stroke: '#000', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg', className: 'i-loading-icon', style: {
                    fontSize: size,
                }, children: jsx("circle", { cx: '12', cy: '12', r: '9.5', fill: 'none', strokeWidth: '3', strokeLinecap: 'round', strokeDasharray: 40, strokeDashoffset: 0 }) })), text] }));
};

export { Loading as default };
//# sourceMappingURL=loading.js.map
