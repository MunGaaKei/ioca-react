'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

const stores = new Map();
function readTheme(key, defaultValue) {
    if (typeof window === "undefined")
        return defaultValue;
    const raw = window.localStorage.getItem(key);
    if (raw === null)
        return defaultValue;
    try {
        return JSON.parse(raw);
    }
    catch {
        return raw;
    }
}
function writeTheme(key, value) {
    if (typeof window === "undefined")
        return;
    if (value === undefined) {
        window.localStorage.removeItem(key);
    }
    else {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
}
function applyThemeToDocument(theme) {
    if (typeof document === "undefined")
        return;
    if (!theme)
        return;
    const cls = document.documentElement.classList;
    const prev = Array.from(cls).find((n) => n.startsWith("theme-"));
    if (prev) {
        if (prev !== theme)
            cls.replace(prev, theme);
    }
    else {
        cls.add(theme);
    }
}
function ensureStore(key, defaultValue) {
    const existed = stores.get(key);
    if (existed) {
        return existed;
    }
    const theme = readTheme(key, defaultValue);
    const store = {
        key,
        defaultValue,
        theme,
        listeners: new Set(),
        storageSubscribers: 0,
    };
    stores.set(key, store);
    applyThemeToDocument(theme);
    return store;
}
function notify(store) {
    for (const listener of store.listeners) {
        listener(store.theme);
    }
}
function setStoreTheme(store, value) {
    const prev = store.theme;
    const next = typeof value === "function"
        ? value(prev)
        : value;
    const resolved = next ?? store.defaultValue;
    if (resolved === store.theme)
        return;
    store.theme = resolved;
    writeTheme(store.key, next);
    applyThemeToDocument(resolved);
    notify(store);
}
function ensureStorageListener(store) {
    if (typeof window === "undefined")
        return;
    if (store.storageListener)
        return;
    store.storageListener = (e) => {
        if (e.key !== store.key)
            return;
        if (e.newValue === null) {
            store.theme = store.defaultValue;
            applyThemeToDocument(store.theme);
            notify(store);
            return;
        }
        try {
            store.theme = JSON.parse(e.newValue);
        }
        catch {
            store.theme = e.newValue;
        }
        applyThemeToDocument(store.theme);
        notify(store);
    };
    window.addEventListener("storage", store.storageListener);
}
function cleanupStorageListener(store) {
    if (typeof window === "undefined")
        return;
    if (store.storageSubscribers > 0)
        return;
    if (!store.storageListener)
        return;
    window.removeEventListener("storage", store.storageListener);
    store.storageListener = undefined;
}
const useTheme = (props) => {
    const { key = "ioca-react-theme", defaultValue = "theme-auto", listenStorageChange, } = props ?? {};
    if (typeof window === "undefined") {
        return {
            theme: defaultValue,
            setTheme: () => { },
        };
    }
    const store = react.useMemo(() => ensureStore(key, defaultValue), [key]);
    const [theme, setThemeState] = react.useState(() => store.theme);
    react.useEffect(() => {
        store.defaultValue = defaultValue;
        applyThemeToDocument(store.theme);
    }, [store, defaultValue]);
    react.useEffect(() => {
        store.listeners.add(setThemeState);
        setThemeState(store.theme);
        if (listenStorageChange) {
            store.storageSubscribers += 1;
            ensureStorageListener(store);
        }
        return () => {
            store.listeners.delete(setThemeState);
            if (listenStorageChange) {
                store.storageSubscribers = Math.max(0, store.storageSubscribers - 1);
                cleanupStorageListener(store);
            }
        };
    }, [store, listenStorageChange]);
    const setTheme = (value) => {
        setStoreTheme(store, value);
    };
    return {
        theme,
        setTheme,
    };
};

exports.default = useTheme;
//# sourceMappingURL=index.js.map
