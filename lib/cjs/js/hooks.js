'use strict';

var react = require('react');

const MouseMoveEvents = new Set();
const MouseUpEvents = new Set();
const KeydownEvents = new Set();
const touchable = "ontouchend" in document;
const EVENTS = {
    MOVE: touchable ? "touchmove" : "mousemove",
    UP: touchable ? "touchend" : "mouseup",
    KEYDOWN: "keydown",
};
document.addEventListener(EVENTS.MOVE, (e) => {
    for (const listener of MouseMoveEvents.values()) {
        listener(e);
    }
}, { passive: false });
document.addEventListener(EVENTS.UP, (e) => {
    for (const listener of MouseUpEvents.values()) {
        listener(e);
    }
});
document.addEventListener(EVENTS.KEYDOWN, (e) => {
    for (const listener of KeydownEvents.values()) {
        listener(e);
    }
});
function useMouseMove(listener, options) {
    react.useEffect(() => {
        MouseMoveEvents.add(listener);
        return () => {
            MouseMoveEvents.delete(listener);
        };
    }, [listener]);
}
function useMouseUp(listener, options) {
    react.useEffect(() => {
        MouseUpEvents.add(listener);
        return () => {
            MouseUpEvents.delete(listener);
        };
    }, [listener]);
}
function useKeydown(listener, options) {
    react.useEffect(() => {
        if (options?.disabled)
            return;
        KeydownEvents.add(listener);
        return () => {
            KeydownEvents.delete(listener);
        };
    }, [listener]);
}
function useIntersectionObserver(configs) {
    const WM = new WeakMap();
    const IO = new IntersectionObserver((entries) => {
        entries.map((entry) => {
            const callback = WM.get(entry.target);
            callback?.(entry.target, entry.isIntersecting);
        });
    }, configs);
    function observe(target, callback) {
        if (WM.get(target))
            return;
        WM.set(target, callback);
        target && IO.observe(target);
    }
    function unobserve(target) {
        target && IO.unobserve(target);
        WM.delete(target);
    }
    function disconnect() {
        IO.disconnect();
    }
    return {
        observe,
        unobserve,
        disconnect,
    };
}
function useResizeObserver() {
    const WM = new WeakMap();
    const IO = new ResizeObserver((entries) => {
        entries.map((entry) => {
            const callback = WM.get(entry.target);
            callback?.(entry.target);
        });
    });
    function observe(target, callback) {
        if (WM.get(target))
            return;
        target && IO.observe(target);
        WM.set(target, callback);
    }
    function unobserve(target) {
        target && IO.unobserve(target);
        WM.delete(target);
    }
    function disconnect() {
        IO.disconnect();
    }
    return {
        observe,
        unobserve,
        disconnect,
    };
}

exports.useIntersectionObserver = useIntersectionObserver;
exports.useKeydown = useKeydown;
exports.useMouseMove = useMouseMove;
exports.useMouseUp = useMouseUp;
exports.useResizeObserver = useResizeObserver;
//# sourceMappingURL=hooks.js.map
