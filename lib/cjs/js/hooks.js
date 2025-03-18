'use strict';

var react = require('react');

const isBrowser = typeof window !== "undefined";
let MouseMoveEvents;
let MouseUpEvents;
let KeydownEvents;
let touchable;
let EVENTS;
if (isBrowser) {
    MouseMoveEvents = new Set();
    MouseUpEvents = new Set();
    KeydownEvents = new Set();
    touchable = "ontouchend" in document;
    EVENTS = {
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
}
function useMouseMove(listener, options) {
    react.useEffect(() => {
        if (!isBrowser || options?.disabled)
            return;
        MouseMoveEvents.add(listener);
        return () => {
            MouseMoveEvents.delete(listener);
        };
    }, [listener]);
}
function useMouseUp(listener, options) {
    react.useEffect(() => {
        if (!isBrowser || options?.disabled)
            return;
        MouseUpEvents.add(listener);
        return () => {
            MouseUpEvents.delete(listener);
        };
    }, [listener]);
}
function useKeydown(listener, options) {
    react.useEffect(() => {
        if (!isBrowser || options?.disabled)
            return;
        KeydownEvents.add(listener);
        return () => {
            KeydownEvents.delete(listener);
        };
    }, [listener]);
}
function useIntersectionObserver(configs) {
    const WM = react.useRef(new WeakMap());
    const IO = react.useRef(null);
    react.useEffect(() => {
        if (!isBrowser)
            return;
        IO.current = new IntersectionObserver((entries) => {
            entries.map((entry) => {
                const callback = WM.current.get(entry.target);
                callback?.(entry.target, entry.isIntersecting);
            });
        }, configs);
        return () => {
            IO.current?.disconnect();
        };
    }, []);
    function observe(target, callback) {
        if (!isBrowser || !IO.current || !target)
            return;
        if (WM.current.get(target))
            return;
        WM.current.set(target, callback);
        IO.current.observe(target);
    }
    function unobserve(target) {
        if (!isBrowser || !IO.current || !target)
            return;
        IO.current.unobserve(target);
        WM.current.delete(target);
    }
    function disconnect() {
        if (!isBrowser || !IO.current)
            return;
        IO.current.disconnect();
    }
    return {
        observe,
        unobserve,
        disconnect,
    };
}
function useResizeObserver() {
    const WM = react.useRef(new WeakMap());
    const IO = react.useRef(null);
    react.useEffect(() => {
        if (!isBrowser)
            return;
        IO.current = new ResizeObserver((entries) => {
            entries.map((entry) => {
                const callback = WM.current.get(entry.target);
                callback?.(entry.target);
            });
        });
        return () => {
            IO.current?.disconnect();
        };
    }, []);
    function observe(target, callback) {
        if (!isBrowser || !IO.current || !target)
            return;
        if (WM.current.get(target))
            return;
        IO.current.observe(target);
        WM.current.set(target, callback);
    }
    function unobserve(target) {
        if (!isBrowser || !IO.current || !target)
            return;
        IO.current.unobserve(target);
        WM.current.delete(target);
    }
    function disconnect() {
        if (!isBrowser || !IO.current)
            return;
        IO.current.disconnect();
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
