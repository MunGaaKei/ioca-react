'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var text = require('../text/text.js');

function Circle(props) {
    const { value, circleSize = 40, lineWidth = 8 } = props;
    return (jsxRuntime.jsxs("div", { className: 'i-progress-circle', children: [jsxRuntime.jsxs("svg", { width: circleSize, height: circleSize, children: [jsxRuntime.jsx("circle", { cx: circleSize / 2, cy: circleSize / 2, r: circleSize / 2 - lineWidth / 2, fill: 'none', stroke: 'var(--background-opacity-2)', strokeWidth: lineWidth }), jsxRuntime.jsx("circle", { cx: circleSize / 2, cy: circleSize / 2, r: circleSize / 2 - lineWidth / 2, fill: 'none', stroke: 'var(--color-main)', strokeWidth: lineWidth, strokeDasharray: 100, pathLength: 100, className: 'i-progress-circle-path', strokeLinecap: 'round', style: {
                            strokeDashoffset: `calc(100 - ${value})`,
                        } })] }), jsxRuntime.jsxs("span", { className: 'i-progress-circle-value', children: [jsxRuntime.jsx("span", { children: value }), jsxRuntime.jsx(text.default, { size: '.81em', className: 'color-7', children: "%" })] })] }));
}

exports.default = Circle;
//# sourceMappingURL=circle.js.map
