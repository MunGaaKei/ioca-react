'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('../../js/hooks.js');

const Resize = react.memo(function Resize(props) {
    const { index, onWidthChange } = props;
    const state = hooks.useReactive({
        resizing: false,
        x: 0,
        width: 0,
    });
    const rafId = react.useRef(null);
    const nextWidth = react.useRef(null);
    react.useEffect(() => {
        return () => {
            if (rafId.current != null)
                cancelAnimationFrame(rafId.current);
        };
    }, []);
    const flush = react.useCallback(() => {
        rafId.current = null;
        if (nextWidth.current == null)
            return;
        onWidthChange(index, nextWidth.current, "preview");
    }, [index, onWidthChange]);
    const schedule = react.useCallback((w) => {
        nextWidth.current = w;
        if (rafId.current != null)
            return;
        rafId.current = requestAnimationFrame(flush);
    }, [flush]);
    const handleMouseDown = (e) => {
        const tar = e.target;
        const width = tar.offsetParent.offsetWidth;
        Object.assign(state, {
            x: e.pageX,
            resizing: true,
            width,
        });
    };
    const handleMouseMove = react.useCallback((e) => {
        if (!state.resizing)
            return;
        e.preventDefault();
        const after = state.width + e.pageX - state.x;
        if (after <= 24)
            return;
        schedule(after);
    }, [index, schedule, state]);
    const handleMouseUp = react.useCallback(() => {
        if (!state.resizing)
            return;
        state.resizing = false;
        const w = nextWidth.current;
        if (rafId.current != null)
            cancelAnimationFrame(rafId.current);
        rafId.current = null;
        if (w != null)
            onWidthChange(index, w, "commit");
        nextWidth.current = null;
    }, [index, onWidthChange, state]);
    hooks.useMouseMove(handleMouseMove);
    hooks.useMouseUp(handleMouseUp);
    return (jsxRuntime.jsx("i", { className: 'i-datagrid-resizor', onMouseDown: handleMouseDown, onClick: (e) => e.stopPropagation() }));
});

exports.default = Resize;
//# sourceMappingURL=resize.js.map
