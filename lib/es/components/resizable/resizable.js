import { jsxs, jsx } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useRef } from 'react';
import { useMouseUp, useMouseMove } from '../../js/hooks.js';

const Resizable = (props) => {
    const { other, children, vertical, height, size = "auto", minSize = 0, maxSize = "100%", style, line, className, asPercent, onResize, onResizeComplete, } = props;
    const state = useReactive({
        size,
        resizing: false,
        start: 0,
        total: 0,
    });
    const ref = useRef(null);
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
    useMouseUp(handleMouseUp);
    useMouseMove(handleMouseMove);
    return (jsxs("div", { ref: ref, className: classNames("i-resizable", className, {
            [`i-resizable-vertical`]: vertical,
        }), style: { ...style, height }, children: [jsx("div", { className: 'i-resizable-a', style: {
                    [vertical ? "height" : "width"]: state.size,
                    [vertical ? "minHeight" : "minWidth"]: minSize,
                    [vertical ? "maxHeight" : "maxWidth"]: maxSize,
                }, children: other }), jsx("div", { className: classNames("i-resizable-line", {
                    [`i-resizable-resizing`]: state.resizing,
                }), onMouseDown: handleMouseDown, onTouchStart: handleMouseDown, onContextMenu: (e) => e.preventDefault(), children: jsx("div", { className: 'i-resizable-line-node', children: line }) }), jsx("div", { className: 'i-resizable-b', children: children })] }));
};

export { Resizable as default };
//# sourceMappingURL=resizable.js.map
