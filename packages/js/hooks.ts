import {
    DependencyList,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

type TMouseEvent = (e: MouseEvent) => void;
type TKeyboardEvent = (e: KeyboardEvent) => void;
type TEventOption = {
    disabled?: boolean;
};

const MouseMoveEvents = new Set<TMouseEvent>();
const MouseUpEvents = new Set<TMouseEvent>();
const KeydownEvents = new Set<TKeyboardEvent>();

let initialized = false;

const initEvents = () => {
    if (typeof document === "undefined" || initialized) return;
    initialized = true;

    const touchable = "ontouchend" in document;
    const EVENTS: Record<string, any> = {
        MOVE: touchable ? "touchmove" : "mousemove",
        UP: touchable ? "touchend" : "mouseup",
        KEYDOWN: "keydown",
    };

    document.addEventListener(
        EVENTS.MOVE,
        (e) => {
            for (const listener of MouseMoveEvents.values()) {
                listener(e);
            }
        },
        { passive: false },
    );

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

export function useMouseMove(listener: TMouseEvent, options?: TEventOption) {
    initEventsOnce();

    useEffect(() => {
        if (options?.disabled) return;

        MouseMoveEvents.add(listener);
        return () => {
            MouseMoveEvents.delete(listener);
        };
    }, []);
}

export function useMouseUp(listener: TMouseEvent, options?: TEventOption) {
    initEventsOnce();

    useEffect(() => {
        if (options?.disabled) return;

        MouseUpEvents.add(listener);
        return () => {
            MouseUpEvents.delete(listener);
        };
    }, []);
}

export function useKeydown(listener: TKeyboardEvent, options?: TEventOption) {
    initEventsOnce();

    useEffect(() => {
        if (options?.disabled) return;

        KeydownEvents.add(listener);
        return () => {
            KeydownEvents.delete(listener);
        };
    }, []);
}

export function useCreation<T>(factory: () => T, deps: DependencyList) {
    return useMemo(factory, deps);
}

export function useReactive<T extends object>(initialState: T): T {
    const [, setFlag] = useState(0);
    const scheduledRef = useRef(false);
    const proxyCacheRef = useRef(new WeakMap<object, any>());
    const rootRef = useRef<T | null>(null);
    const proxyRef = useRef<T | null>(null);

    const notify = () => {
        if (scheduledRef.current) return;
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

    const createProxy = (target: any): any => {
        if (!target || typeof target !== "object") return target;

        if (!Array.isArray(target)) {
            const proto = Object.getPrototypeOf(target);
            const isPlainObject = proto === Object.prototype || proto === null;
            if (!isPlainObject) return target;
        }

        const cached = proxyCacheRef.current.get(target);
        if (cached) return cached;

        const proxy = new Proxy(target, {
            get(t, p, r) {
                return createProxy(Reflect.get(t, p, r));
            },
            set(t, p, v, r) {
                const prev = Reflect.get(t, p, r);
                const ok = Reflect.set(t, p, v, r);
                if (prev !== v) notify();
                return ok;
            },
            deleteProperty(t, p) {
                const had = Object.prototype.hasOwnProperty.call(t, p);
                const ok = Reflect.deleteProperty(t, p);
                if (had) notify();
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

    return proxyRef.current as T;
}

type TSetState<T> = (
    value: T | undefined | ((prev: T | undefined) => T),
) => void;

type TLocalStorageOptions<T> = {
    defaultValue?: T | (() => T);
    listenStorageChange?: boolean;
};

export function useLocalStorageState<T>(
    key: string,
    options?: TLocalStorageOptions<T>,
): [T | undefined, TSetState<T>] {
    const { defaultValue, listenStorageChange } = options ?? {};

    const getDefault = () => {
        return typeof defaultValue === "function"
            ? (defaultValue as () => T)()
            : defaultValue;
    };

    const read = (): T | undefined => {
        if (typeof window === "undefined") return getDefault();

        const raw = window.localStorage.getItem(key);
        if (raw === null) return getDefault();

        try {
            return JSON.parse(raw) as T;
        } catch (e) {
            return raw as unknown as T;
        }
    };

    const [state, setState] = useState<T | undefined>(() => read());

    const set: TSetState<T> = (value) => {
        setState((prev) => {
            const next =
                typeof value === "function"
                    ? (value as (prev: T | undefined) => T)(prev)
                    : value;

            if (typeof window !== "undefined") {
                if (next === undefined) {
                    window.localStorage.removeItem(key);
                } else {
                    window.localStorage.setItem(key, JSON.stringify(next));
                }
            }

            return next;
        });
    };

    useEffect(() => {
        if (!listenStorageChange) return;
        if (typeof window === "undefined") return;

        const onStorage = (e: StorageEvent) => {
            if (e.key !== key) return;

            if (e.newValue === null) {
                setState(getDefault());
                return;
            }

            try {
                setState(JSON.parse(e.newValue) as T);
            } catch (err) {
                setState(e.newValue as unknown as T);
            }
        };

        window.addEventListener("storage", onStorage);
        return () => {
            window.removeEventListener("storage", onStorage);
        };
    }, [key, listenStorageChange]);

    return [state, set];
}

type TResponsiveConfig = Record<string, number>;

let responsiveConfig: TResponsiveConfig = {};

export function configResponsive(config: TResponsiveConfig) {
    responsiveConfig = config;
}

export function useResponsive() {
    const compute = () => {
        if (typeof window === "undefined") return {};
        const w = window.innerWidth;
        const result: Record<string, boolean> = {};

        for (const key in responsiveConfig) {
            result[key] = w >= responsiveConfig[key];
        }

        return result;
    };

    const [state, setState] = useState<Record<string, boolean>>(() =>
        compute(),
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        const onResize = () => {
            const next = compute();
            setState((prev) => {
                const prevKeys = Object.keys(prev);
                const nextKeys = Object.keys(next);
                if (prevKeys.length !== nextKeys.length) return next;

                for (const k of nextKeys) {
                    if (prev[k] !== next[k]) return next;
                }

                return prev;
            });
        };

        onResize();
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return state;
}

type TSize = { width: number; height: number };

export function useSize(target: any): TSize | undefined {
    const [size, setSize] = useState<TSize>();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const resolveTarget = () => {
            if (!target) return null;
            if (typeof target === "function") return target();
            if (typeof target === "object" && "current" in target) {
                return target.current;
            }
            return target;
        };

        const el = resolveTarget() as HTMLElement | null;
        if (!el) return;

        const update = () => {
            const rect = el.getBoundingClientRect();
            setSize({ width: rect.width, height: rect.height });
        };

        update();

        let ro: ResizeObserver | undefined;
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

export function useIntersectionObserver(configs?: IntersectionObserverInit) {
    const wmRef = useRef(new WeakMap());
    const ioRef = useRef<IntersectionObserver | undefined>(undefined);

    if (typeof window !== "undefined" && !ioRef.current) {
        ioRef.current = new IntersectionObserver((entries) => {
            entries.map((entry) => {
                const callback = wmRef.current.get(entry.target);
                callback?.(entry.target, entry.isIntersecting);
            });
        }, configs);
    }

    const observe = useCallback((target: HTMLElement, callback: Function) => {
        if (!target || !ioRef.current || wmRef.current.get(target)) return;
        wmRef.current.set(target, callback);
        ioRef.current.observe(target);
    }, []);

    const unobserve = useCallback((target: HTMLElement) => {
        if (!target || !ioRef.current) return;
        ioRef.current.unobserve(target);
        wmRef.current.delete(target);
    }, []);

    const disconnect = useCallback(() => {
        ioRef.current?.disconnect();
    }, []);

    useEffect(() => {
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

export function useResizeObserver() {
    const wmRef = useRef(new WeakMap());
    const ioRef = useRef<ResizeObserver | undefined>(undefined);

    if (typeof window !== "undefined" && !ioRef.current) {
        ioRef.current = new ResizeObserver((entries) => {
            entries.map((entry) => {
                const callback = wmRef.current.get(entry.target);
                callback?.(entry.target);
            });
        });
    }

    const observe = useCallback((target: HTMLElement, callback: Function) => {
        if (!target || !ioRef.current || wmRef.current.get(target)) return;
        ioRef.current.observe(target);
        wmRef.current.set(target, callback);
    }, []);

    const unobserve = useCallback((target: HTMLElement) => {
        if (!target || !ioRef.current) return;
        ioRef.current.unobserve(target);
        wmRef.current.delete(target);
    }, []);

    const disconnect = useCallback(() => {
        ioRef.current?.disconnect();
    }, []);

    useEffect(() => {
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
