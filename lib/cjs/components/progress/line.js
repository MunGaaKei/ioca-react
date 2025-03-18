'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Line = (props) => {
    const { ref, value, lineWidth, vertical, barClass, dragging, renderCursor, onMouseDown, onTouchStart, } = props;
    return (jsxRuntime.jsx("div", { ref: ref, className: classNames__default("i-progress", {
            "i-progress-vertical": vertical,
        }), style: { [vertical ? "width" : "height"]: lineWidth }, onMouseDown: onMouseDown, onTouchStart: onTouchStart, children: jsxRuntime.jsx("div", { className: classNames__default("i-progress-bar", barClass, {
                "no-transition": dragging,
            }), style: { [vertical ? "height" : "width"]: `${value}%` }, children: renderCursor && (jsxRuntime.jsx("a", { className: 'i-progress-cursor', children: renderCursor(value ?? 0) })) }) }));
};

exports.default = Line;
//# sourceMappingURL=line.js.map
