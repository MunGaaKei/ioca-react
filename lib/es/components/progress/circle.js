import { jsxs, jsx } from 'react/jsx-runtime';
import Text from '../text/text.js';

function Circle(props) {
    const { value, circleSize = 40, lineWidth = 8 } = props;
    return (jsxs("div", { className: 'i-progress-circle', children: [jsxs("svg", { width: circleSize, height: circleSize, children: [jsx("circle", { cx: circleSize / 2, cy: circleSize / 2, r: circleSize / 2 - lineWidth / 2, fill: 'none', stroke: 'var(--background-opacity-2)', strokeWidth: lineWidth }), jsx("circle", { cx: circleSize / 2, cy: circleSize / 2, r: circleSize / 2 - lineWidth / 2, fill: 'none', stroke: 'var(--color-main)', strokeWidth: lineWidth, strokeDasharray: 100, pathLength: 100, className: 'i-progress-circle-path', strokeLinecap: 'round', style: {
                            strokeDashoffset: `calc(100 - ${value})`,
                        } })] }), jsxs("span", { className: 'i-progress-circle-value', children: [jsx("span", { children: value }), jsx(Text, { size: '.81em', className: 'color-7', children: "%" })] })] }));
}

export { Circle as default };
//# sourceMappingURL=circle.js.map
