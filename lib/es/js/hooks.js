import { useEffect } from 'react';

const MouseMoveEvents = new Set();
const MouseUpEvents = new Set();
const KeydownEvents = new Set();
let initialized = false;
const initEvents = () => {
    if (!document || initialized)
        return;
    initialized = true;
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
};
function initEventsOnce() {
    useEffect(initEvents, []);
}
function useMouseMove(listener, options) {
    initEventsOnce();
    useEffect(() => {
        MouseMoveEvents.add(listener);
        return () => {
            MouseMoveEvents.delete(listener);
        };
    }, []);
}
function useMouseUp(listener, options) {
    initEventsOnce();
    useEffect(() => {
        MouseUpEvents.add(listener);
        return () => {
            MouseUpEvents.delete(listener);
        };
    }, []);
}
function useKeydown(listener, options) {
    initEventsOnce();
    useEffect(() => {
        if (options?.disabled)
            return;
        KeydownEvents.add(listener);
        return () => {
            KeydownEvents.delete(listener);
        };
    }, []);
}
const defaultObserver = {
    observe: undefined,
    unobserve: undefined,
    disconnect: undefined,
};
function useIntersectionObserver(configs) {
    if (typeof window === "undefined") {
        return {
            ...defaultObserver,
        };
    }
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
    if (typeof window === "undefined") {
        return {
            ...defaultObserver,
        };
    }
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

export { useIntersectionObserver, useKeydown, useMouseMove, useMouseUp, useResizeObserver };
//# sourceMappingURL=hooks.js.map
