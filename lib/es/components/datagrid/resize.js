import { jsx } from 'react/jsx-runtime';
import { memo, useRef, useEffect, useCallback } from 'react';
import { useReactive, useMouseMove, useMouseUp } from '../../js/hooks.js';

const Resize = memo(function Resize(props) {
    const { index, onWidthChange } = props;
    const state = useReactive({
        resizing: false,
        x: 0,
        width: 0,
    });
    const rafId = useRef(null);
    const nextWidth = useRef(null);
    useEffect(() => {
        return () => {
            if (rafId.current != null)
                cancelAnimationFrame(rafId.current);
        };
    }, []);
    const flush = useCallback(() => {
        rafId.current = null;
        if (nextWidth.current == null)
            return;
        onWidthChange(index, nextWidth.current, "preview");
    }, [index, onWidthChange]);
    const schedule = useCallback((w) => {
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
    const handleMouseMove = useCallback((e) => {
        if (!state.resizing)
            return;
        e.preventDefault();
        const after = state.width + e.pageX - state.x;
        if (after <= 24)
            return;
        schedule(after);
    }, [index, schedule, state]);
    const handleMouseUp = useCallback(() => {
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
    useMouseMove(handleMouseMove);
    useMouseUp(handleMouseUp);
    return (jsx("i", { className: 'i-datagrid-resizor', onMouseDown: handleMouseDown, onClick: (e) => e.stopPropagation() }));
});

export { Resize as default };
