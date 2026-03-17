import { useState, useRef, useEffect, useMemo } from 'react';

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
function useCreation(factory, deps) {
    return useMemo(factory, deps);
}
function useReactive(initialState) {
    const [, setFlag] = useState(0);
    const scheduledRef = useRef(false);
    const proxyCacheRef = useRef(new WeakMap());
    const rootRef = useRef(null);
    const proxyRef = useRef(null);
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
function useLocalStorageState(key, options) {
    const { defaultValue, listenStorageChange } = options ?? {};
    const getDefault = () => {
        return typeof defaultValue === "function"
            ? defaultValue()
            : defaultValue;
    };
    const read = () => {
        if (typeof window === "undefined")
            return getDefault();
        const raw = window.localStorage.getItem(key);
        if (raw === null)
            return getDefault();
        try {
            return JSON.parse(raw);
        }
        catch (e) {
            return raw;
        }
    };
    const [state, setState] = useState(() => read());
    const set = (value) => {
        setState((prev) => {
            const next = typeof value === "function"
                ? value(prev)
                : value;
            if (typeof window !== "undefined") {
                if (next === undefined) {
                    window.localStorage.removeItem(key);
                }
                else {
                    window.localStorage.setItem(key, JSON.stringify(next));
                }
            }
            return next;
        });
    };
    useEffect(() => {
        if (!listenStorageChange)
            return;
        if (typeof window === "undefined")
            return;
        const onStorage = (e) => {
            if (e.key !== key)
                return;
            if (e.newValue === null) {
                setState(getDefault());
                return;
            }
            try {
                setState(JSON.parse(e.newValue));
            }
            catch (err) {
                setState(e.newValue);
            }
        };
        window.addEventListener("storage", onStorage);
        return () => {
            window.removeEventListener("storage", onStorage);
        };
    }, [key, listenStorageChange]);
    return [state, set];
}
function useSize(target) {
    const [size, setSize] = useState();
    useEffect(() => {
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

export { useCreation, useIntersectionObserver, useKeydown, useLocalStorageState, useMouseMove, useMouseUp, useReactive, useResizeObserver, useSize };
//# sourceMappingURL=hooks.js.map
