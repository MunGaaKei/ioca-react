'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

const Line = (props) => {
    const { ref, value, lineWidth, vertical, barClass, dragging, renderCursor, onMouseDown, onTouchStart, } = props;
    return (jsxRuntime.jsx("div", { ref: ref, className: classNames("i-progress", {
            "i-progress-vertical": vertical,
        }), style: { [vertical ? "width" : "height"]: lineWidth }, onMouseDown: onMouseDown, onTouchStart: onTouchStart, children: jsxRuntime.jsx("div", { className: classNames("i-progress-bar", barClass, {
                "no-transition": dragging,
            }), style: { [vertical ? "height" : "width"]: `${value}%` }, children: renderCursor && (jsxRuntime.jsx("a", { className: 'i-progress-cursor', children: renderCursor(value ?? 0) })) }) }));
};

exports.default = Line;
//# sourceMappingURL=line.js.map
