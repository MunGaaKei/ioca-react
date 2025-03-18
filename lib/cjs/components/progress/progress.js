'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ahooks = require('ahooks');
var classNames = require('classnames');
var react = require('react');
var hooks = require('../../js/hooks.js');
var circle = require('./circle.js');
var line = require('./line.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Progress = (props) => {
    const { value = 0, lineWidth = 8, circleSize = 40, precision = 0, style, draggable = true, type = "line", barClass, vertical, label, labelInline, className, renderCursor, onChange, onDraggingChange, } = props;
    const ref = react.useRef(null);
    const state = ahooks.useReactive({
        value,
        dragging: false,
        size: 0,
        start: 0,
    });
    const pageXY = vertical ? "pageY" : "pageX";
    const rectTL = vertical ? "top" : "left";
    const rectWH = vertical ? "height" : "width";
    const toFixedValue = react.useMemo(() => {
        let value = +state.value.toFixed(precision);
        value = Math.min(100, value);
        value = Math.max(0, value);
        return value;
    }, [state.value, precision]);
    const handleMouseDown = (e) => {
        if (!ref.current || !draggable)
            return;
        if (e.touches) {
            e = e.touches[0];
        }
        const rect = ref.current.getBoundingClientRect();
        const value = ((e[pageXY] - rect[rectTL]) * 100) / rect[rectWH];
        Object.assign(state, {
            value: vertical ? 100 - value : value,
            size: rect[rectWH],
            start: rect[rectTL],
            dragging: true,
        });
        onDraggingChange?.(true);
    };
    const handleMouseMove = (e) => {
        if (!state.dragging || !draggable)
            return;
        e.preventDefault();
        if (e.touches) {
            e = e.touches[0];
        }
        const { start, size } = state;
        const offset = e[pageXY] - start;
        if (offset < 0 || offset > size)
            return;
        const value = ((e[pageXY] - start) * 100) / size;
        state.value = vertical ? 100 - value : value;
    };
    const handleMouseUp = () => {
        if (!state.dragging || !draggable)
            return;
        onChange?.(toFixedValue);
        state.dragging = false;
        onDraggingChange?.(false);
    };
    hooks.useMouseMove(handleMouseMove);
    hooks.useMouseUp(handleMouseUp);
    react.useEffect(() => {
        if (value > 100) {
            state.value = 100;
            return;
        }
        if (value < 0) {
            state.value = 0;
            return;
        }
        state.value = value;
    }, [value]);
    return (jsxRuntime.jsxs("div", { className: classNames__default("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && jsxRuntime.jsx("span", { className: 'i-input-label-text', children: label }), type === "line" && (jsxRuntime.jsx(line.default, { ref: ref, vertical: vertical, lineWidth: lineWidth, barClass: barClass, dragging: state.dragging, value: state.value, renderCursor: renderCursor, onMouseDown: handleMouseDown, onTouchStart: handleMouseDown })), type === "circle" && (jsxRuntime.jsx(circle.default, { value: state.value, circleSize: circleSize, lineWidth: lineWidth }))] }));
};

exports.default = Progress;
//# sourceMappingURL=progress.js.map
