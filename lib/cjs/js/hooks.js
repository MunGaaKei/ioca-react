'use strict';

var react = require('react');

const MouseMoveEvents = new Set();
const MouseUpEvents = new Set();
const KeydownEvents = new Set();
let initialized = false;
const initEvents = () => {
    if (typeof document === "undefined" || initialized)
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
    react.useEffect(initEvents, []);
}
function useMouseMove(listener, options) {
    initEventsOnce();
    react.useEffect(() => {
        MouseMoveEvents.add(listener);
        return () => {
            MouseMoveEvents.delete(listener);
        };
    }, []);
}
function useMouseUp(listener, options) {
    initEventsOnce();
    react.useEffect(() => {
        MouseUpEvents.add(listener);
        return () => {
            MouseUpEvents.delete(listener);
        };
    }, []);
}
function useKeydown(listener, options) {
    initEventsOnce();
    react.useEffect(() => {
        if (options?.disabled)
            return;
        KeydownEvents.add(listener);
        return () => {
            KeydownEvents.delete(listener);
        };
    }, []);
}
function useReactive(initialState) {
    const [, setFlag] = react.useState(0);
    const scheduledRef = react.useRef(false);
    const proxyCacheRef = react.useRef(new WeakMap());
    const rootRef = react.useRef(null);
    const proxyRef = react.useRef(null);
    const notify = () => {
        if (scheduledRef.current)
            return;
        scheduledRef.current = true;
        const flush = () => {
            scheduledRef.current = false;
            setFlag((n) => n + 1);
        };
        if (typeof queueMicrotask !== "undefined") {
            queueMicrotask(flush);
            return;
        }
        Promise.resolve().then(flush);
    };
    const createProxy = (target) => {
        if (!target || typeof target !== "object")
            return target;
        if (!Array.isArray(target)) {
            const proto = Object.getPrototypeOf(target);
            const isPlainObject = proto === Object.prototype || proto === null;
            if (!isPlainObject)
                return target;
        }
        const cached = proxyCacheRef.current.get(target);
        if (cached)
            return cached;
        const proxy = new Proxy(target, {
            get(t, p, r) {
                return createProxy(Reflect.get(t, p, r));
            },
            set(t, p, v, r) {
                const prev = Reflect.get(t, p, r);
                const ok = Reflect.set(t, p, v, r);
                if (prev !== v)
                    notify();
                return ok;
            },
            deleteProperty(t, p) {
                const had = Object.prototype.hasOwnProperty.call(t, p);
                const ok = Reflect.deleteProperty(t, p);
                if (had)
                    notify();
                return ok;
            },
        });
        proxyCacheRef.current.set(target, proxy);
        return proxy;
    };
    if (!proxyRef.current) {
        rootRef.current = initialState;
        proxyRef.current = createProxy(rootRef.current);
    }
    return proxyRef.current;
}
function useSize(target) {
    const [size, setSize] = react.useState();
    react.useEffect(() => {
        if (typeof window === "undefined")
            return;
        const resolveTarget = () => {
            if (!target)
                return null;
            if (typeof target === "function")
                return target();
            if (typeof target === "object" && "current" in target) {
                return target.current;
            }
            return target;
        };
        const el = resolveTarget();
        if (!el)
            return;
        const update = () => {
            const rect = el.getBoundingClientRect();
            setSize({ width: rect.width, height: rect.height });
        };
        update();
        let ro;
        if (typeof ResizeObserver !== "undefined") {
            ro = new ResizeObserver(update);
            ro.observe(el);
        }
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("resize", update);
            ro?.disconnect();
        };
    }, [target]);
    return size;
}
const defaultObserver = {
    observe: undefined,
    unobserve: undefined,
    disconnect: undefined,
};
function useIntersectionObserver(configs) {
    const wmRef = react.useRef(new WeakMap());
    const ioRef = react.useRef(undefined);
    if (typeof window !== "undefined" && !ioRef.current) {
        ioRef.current = new IntersectionObserver((entries) => {
            entries.map((entry) => {
                const callback = wmRef.current.get(entry.target);
                callback?.(entry.target, entry.isIntersecting);
            });
        }, configs);
    }
    const observe = react.useCallback((target, callback) => {
        if (!target || !ioRef.current || wmRef.current.get(target))
            return;
        wmRef.current.set(target, callback);
        ioRef.current.observe(target);
    }, []);
    const unobserve = react.useCallback((target) => {
        if (!target || !ioRef.current)
            return;
        ioRef.current.unobserve(target);
        wmRef.current.delete(target);
    }, []);
    const disconnect = react.useCallback(() => {
        ioRef.current?.disconnect();
    }, []);
    react.useEffect(() => {
        return () => {
            ioRef.current?.disconnect();
        };
    }, []);
    if (typeof window === "undefined") {
        return {
            ...defaultObserver,
        };
    }
    return {
        observe,
        unobserve,
        disconnect,
    };
}
function useResizeObserver() {
    const wmRef = react.useRef(new WeakMap());
    const ioRef = react.useRef(undefined);
    if (typeof window !== "undefined" && !ioRef.current) {
        ioRef.current = new ResizeObserver((entries) => {
            entries.map((entry) => {
                const callback = wmRef.current.get(entry.target);
                callback?.(entry.target);
            });
        });
    }
    const observe = react.useCallback((target, callback) => {
        if (!target || !ioRef.current || wmRef.current.get(target))
            return;
        ioRef.current.observe(target);
        wmRef.current.set(target, callback);
    }, []);
    const unobserve = react.useCallback((target) => {
        if (!target || !ioRef.current)
            return;
        ioRef.current.unobserve(target);
        wmRef.current.delete(target);
    }, []);
    const disconnect = react.useCallback(() => {
        ioRef.current?.disconnect();
    }, []);
    react.useEffect(() => {
        return () => {
            ioRef.current?.disconnect();
        };
    }, []);
    if (typeof window === "undefined") {
        return {
            ...defaultObserver,
        };
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
exports.useReactive = useReactive;
exports.useResizeObserver = useResizeObserver;
exports.useSize = useSize;
//# sourceMappingURL=hooks.js.map
