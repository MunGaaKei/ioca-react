'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Arrow = (props) => (jsxRuntime.jsx("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', ...props, children: jsxRuntime.jsx("g", { fill: 'none', children: jsxRuntime.jsx("path", { d: 'M9 17.898c0 1.074 1.265 1.648 2.073.941l6.31-5.522a1.75 1.75 0 0 0 0-2.634l-6.31-5.522C10.265 4.454 9 5.028 9 6.102v11.796z', fill: 'currentColor' }) }) }));
function Sorter(props) {
    const { type } = props;
    return (jsxRuntime.jsxs("a", { className: classNames__default("i-datagrid-sorter", {
            [`i-datagrid-sorter-${type}`]: type,
        }), children: [jsxRuntime.jsx(Arrow, { className: 'i-datagrid-sorter-caret' }), jsxRuntime.jsx(Arrow, { className: 'i-datagrid-sorter-caret' })] }));
}

exports.default = Sorter;
//# sourceMappingURL=sorter.js.map
