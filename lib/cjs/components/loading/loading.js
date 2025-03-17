'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

const Loading = (props) => {
    const { icon, text, size, absolute, style, className, ...restProps } = props;
    return (jsxRuntime.jsxs("div", { className: classNames__default.default("i-loading-container", {
            absolute,
        }, className), style: {
            ...style,
            inset: absolute ? 0 : "unset",
        }, ...restProps, children: [icon ?? (jsxRuntime.jsx("svg", { width: '24', height: '24', stroke: '#000', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg', className: 'i-loading-icon', style: {
                    fontSize: size,
                }, children: jsxRuntime.jsx("circle", { cx: '12', cy: '12', r: '9.5', fill: 'none', strokeWidth: '3', strokeLinecap: 'round', strokeDasharray: 40, strokeDashoffset: 0 }) })), text] }));
};

exports.default = Loading;
//# sourceMappingURL=loading.js.map
