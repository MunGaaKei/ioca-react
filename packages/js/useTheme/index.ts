import { useEffect, useMemo, useState } from "react";
import { ITheme } from "./type";

type TThemeListener = (theme: string) => void;

type TSetTheme = (
	value: string | undefined | ((prev: string) => string | undefined),
) => void;

type TThemeStore = {
	key: string;
	defaultValue: string;
	theme: string;
	listeners: Set<TThemeListener>;
	storageSubscribers: number;
	storageListener?: (e: StorageEvent) => void;
};

const stores = new Map<string, TThemeStore>();

function readTheme(key: string, defaultValue: string): string {
	if (typeof window === "undefined") return defaultValue;

	const raw = window.localStorage.getItem(key);
	if (raw === null) return defaultValue;

	try {
		return JSON.parse(raw) as string;
	} catch {
		return raw;
	}
}

function writeTheme(key: string, value: string | undefined) {
	if (typeof window === "undefined") return;

	if (value === undefined) {
		window.localStorage.removeItem(key);
	} else {
		window.localStorage.setItem(key, JSON.stringify(value));
	}
}

function applyThemeToDocument(theme: string) {
	if (typeof document === "undefined") return;
	if (!theme) return;

	const cls = document.documentElement.classList;
	const prev = Array.from(cls).find((n) => n.startsWith("theme-"));

	if (prev) {
		if (prev !== theme) cls.replace(prev, theme);
	} else {
		cls.add(theme);
	}
}

function ensureStore(key: string, defaultValue: string): TThemeStore {
	const existed = stores.get(key);
	if (existed) {
		return existed;
	}

	const theme = readTheme(key, defaultValue);
	const store: TThemeStore = {
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

function notify(store: TThemeStore) {
	for (const listener of store.listeners) {
		listener(store.theme);
	}
}

function setStoreTheme(store: TThemeStore, value: Parameters<TSetTheme>[0]) {
	const prev = store.theme;
	const next =
		typeof value === "function"
			? (value as (prev: string) => string | undefined)(prev)
			: value;
	const resolved = next ?? store.defaultValue;

	if (resolved === store.theme) return;

	store.theme = resolved;
	writeTheme(store.key, next);
	applyThemeToDocument(resolved);
	notify(store);
}

function ensureStorageListener(store: TThemeStore) {
	if (typeof window === "undefined") return;
	if (store.storageListener) return;

	store.storageListener = (e: StorageEvent) => {
		if (e.key !== store.key) return;

		if (e.newValue === null) {
			store.theme = store.defaultValue;
			applyThemeToDocument(store.theme);
			notify(store);
			return;
		}

		try {
			store.theme = JSON.parse(e.newValue) as string;
		} catch {
			store.theme = e.newValue;
		}

		applyThemeToDocument(store.theme);
		notify(store);
	};

	window.addEventListener("storage", store.storageListener);
}

function cleanupStorageListener(store: TThemeStore) {
	if (typeof window === "undefined") return;
	if (store.storageSubscribers > 0) return;
	if (!store.storageListener) return;

	window.removeEventListener("storage", store.storageListener);
	store.storageListener = undefined;
}

const useTheme = (props?: ITheme) => {
	const {
		key = "ioca-react-theme",
		defaultValue = "theme-auto",
		listenStorageChange,
	} = props ?? {};

	if (typeof window === "undefined") {
		return {
			theme: defaultValue,
			setTheme: () => {},
		};
	}

	const store = useMemo(() => ensureStore(key, defaultValue), [key]);
	const [theme, setThemeState] = useState<string>(() => store.theme);

	useEffect(() => {
		store.defaultValue = defaultValue;
		applyThemeToDocument(store.theme);
	}, [store, defaultValue]);

	useEffect(() => {
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

	const setTheme: TSetTheme = (value) => {
		setStoreTheme(store, value);
	};

	return {
		theme,
		setTheme,
	};
};

export default useTheme;
