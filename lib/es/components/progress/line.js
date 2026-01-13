import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

const Line = (props) => {
    const { ref, value, lineWidth, vertical, barClass, dragging, renderCursor, onMouseDown, onTouchStart, } = props;
    return (jsx("div", { ref: ref, className: classNames("i-progress", {
            "i-progress-vertical": vertical,
        }), style: { [vertical ? "width" : "height"]: lineWidth }, onMouseDown: onMouseDown, onTouchStart: onTouchStart, children: jsx("div", { className: classNames("i-progress-bar", barClass, {
                "no-transition": dragging,
            }), style: { [vertical ? "height" : "width"]: `${value}%` }, children: renderCursor && (jsx("a", { className: 'i-progress-cursor', children: renderCursor(value ?? 0) })) }) }));
};

export { Line as default };
//# sourceMappingURL=line.js.map
