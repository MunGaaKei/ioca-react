'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ahooks = require('ahooks');
var classNames = require('classnames');
var react = require('react');
var hooks = require('../../js/hooks.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Resizable = (props) => {
    const { other, children, vertical, height, size = "auto", minSize = 0, maxSize = "100%", style, line, className, asPercent, onResize, onResizeComplete, } = props;
    const state = ahooks.useReactive({
        size,
        resizing: false,
        start: 0,
        total: 0,
    });
    const ref = react.useRef(null);
    const handleMouseDown = () => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect)
            return;
        state.resizing = true;
        if (vertical) {
            state.total = rect.height;
            state.start = rect.top;
            return;
        }
        state.total = rect.width;
        state.start = rect.left;
    };
    const handleMouseMove = (e) => {
        if (!state.resizing)
            return;
        e.preventDefault();
        if (e.touches) {
            e = e.touches[0];
        }
        const d = e[vertical ? "pageY" : "pageX"];
        const offset = d - state.start;
        state.size = asPercent ? `${(offset / state.total) * 100}%` : offset;
        onResize?.(state.size);
    };
    const handleMouseUp = () => {
        if (!state.resizing)
            return;
        state.resizing = false;
        onResizeComplete?.(state.size);
    };
    hooks.useMouseUp(handleMouseUp);
    hooks.useMouseMove(handleMouseMove);
    return (jsxRuntime.jsxs("div", { ref: ref, className: classNames__default("i-resizable", className, {
            [`i-resizable-vertical`]: vertical,
        }), style: { ...style, height }, children: [jsxRuntime.jsx("div", { className: 'i-resizable-a', style: {
                    [vertical ? "height" : "width"]: state.size,
                    [vertical ? "minHeight" : "minWidth"]: minSize,
                    [vertical ? "maxHeight" : "maxWidth"]: maxSize,
                }, children: other }), jsxRuntime.jsx("div", { className: classNames__default("i-resizable-line", {
                    [`i-resizable-resizing`]: state.resizing,
                }), onMouseDown: handleMouseDown, onTouchStart: handleMouseDown, onContextMenu: (e) => e.preventDefault(), children: jsxRuntime.jsx("div", { className: 'i-resizable-line-node', children: line }) }), jsxRuntime.jsx("div", { className: 'i-resizable-b', children: children })] }));
};

exports.default = Resizable;
//# sourceMappingURL=resizable.js.map
