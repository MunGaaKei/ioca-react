import { jsxs, jsx } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useRef, useEffect } from 'react';
import { useMouseMove, useMouseUp } from '../../js/hooks.js';
import Circle from './circle.js';
import Line from './line.js';

const Progress = (props) => {
    const { value = 0, lineWidth = 8, circleSize = 40, precision = 0, style, draggable = true, type = "line", barClass, vertical, label, labelInline, className, renderCursor, onChange, onDraggingChange, } = props;
    const ref = useRef(null);
    const state = useReactive({
        value,
        dragging: false,
        size: 0,
        start: 0,
    });
    const pageXY = vertical ? "pageY" : "pageX";
    const rectTL = vertical ? "top" : "left";
    const rectWH = vertical ? "height" : "width";
    const getFixedValue = () => {
        let value = +state.value.toFixed(precision);
        value = Math.min(100, value);
        value = Math.max(0, value);
        return value;
    };
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
        onChange?.(getFixedValue());
        state.dragging = false;
        onDraggingChange?.(false);
    };
    useMouseMove(handleMouseMove);
    useMouseUp(handleMouseUp);
    useEffect(() => {
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
    return (jsxs("div", { className: classNames("i-input-label", className, {
            "i-input-inline": labelInline,
        }), style: style, children: [label && jsx("span", { className: 'i-input-label-text', children: label }), type === "line" && (jsx(Line, { ref: ref, vertical: vertical, lineWidth: lineWidth, barClass: barClass, dragging: state.dragging, value: state.value, renderCursor: renderCursor, onMouseDown: handleMouseDown, onTouchStart: handleMouseDown })), type === "circle" && (jsx(Circle, { value: state.value, circleSize: circleSize, lineWidth: lineWidth }))] }));
};

export { Progress as default };
//# sourceMappingURL=progress.js.map
