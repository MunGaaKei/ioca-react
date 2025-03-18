import { useEffect, useRef } from "react";

type TMouseEvent = (e: MouseEvent) => void;
type TKeyboardEvent = (e: KeyboardEvent) => void;
type TEventOption = {
	disabled?: boolean;
};

const isBrowser = typeof window !== "undefined";

let ClickEvents: Set<TMouseEvent>;
let MouseMoveEvents: Set<TMouseEvent>;
let MouseUpEvents: Set<TMouseEvent>;
let KeydownEvents: Set<TKeyboardEvent>;
let touchable: boolean;
let EVENTS: any;

if (isBrowser) {
	ClickEvents = new Set<TMouseEvent>();
	MouseMoveEvents = new Set<TMouseEvent>();
	MouseUpEvents = new Set<TMouseEvent>();
	KeydownEvents = new Set<TKeyboardEvent>();
	touchable = "ontouchend" in document;
	EVENTS = {
		MOVE: touchable ? "touchmove" : "mousemove",
		UP: touchable ? "touchend" : "mouseup",
		KEYDOWN: "keydown",
	};

	document.addEventListener(
		EVENTS.MOVE,
		(e: MouseEvent) => {
			for (const listener of MouseMoveEvents.values()) {
				listener(e);
			}
		},
		{ passive: false }
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
}

export function useMouseMove(listener: TMouseEvent, options?: TEventOption) {
	useEffect(() => {
		if (!isBrowser || options?.disabled) return;

		MouseMoveEvents.add(listener);
		return () => {
			MouseMoveEvents.delete(listener);
		};
	}, [listener]);
}

export function useMouseUp(listener: TMouseEvent, options?: TEventOption) {
	useEffect(() => {
		if (!isBrowser || options?.disabled) return;

		MouseUpEvents.add(listener);
		return () => {
			MouseUpEvents.delete(listener);
		};
	}, [listener]);
}

export function useKeydown(listener: TKeyboardEvent, options?: TEventOption) {
	useEffect(() => {
		if (!isBrowser || options?.disabled) return;

		KeydownEvents.add(listener);
		return () => {
			KeydownEvents.delete(listener);
		};
	}, [listener]);
}

export function useIntersectionObserver(configs?: IntersectionObserverInit) {
	const WM = useRef(new WeakMap());
	const IO = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		if (!isBrowser) return;

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

	function observe(target: HTMLElement, callback: Function) {
		if (!isBrowser || !IO.current || !target) return;
		if (WM.current.get(target)) return;

		WM.current.set(target, callback);
		IO.current.observe(target);
	}

	function unobserve(target: HTMLElement) {
		if (!isBrowser || !IO.current || !target) return;
		IO.current.unobserve(target);
		WM.current.delete(target);
	}

	function disconnect() {
		if (!isBrowser || !IO.current) return;
		IO.current.disconnect();
	}

	return {
		observe,
		unobserve,
		disconnect,
	};
}

export function useResizeObserver() {
	const WM = useRef(new WeakMap());
	const IO = useRef<ResizeObserver | null>(null);

	useEffect(() => {
		if (!isBrowser) return;

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

	function observe(target: HTMLElement, callback: Function) {
		if (!isBrowser || !IO.current || !target) return;
		if (WM.current.get(target)) return;

		IO.current.observe(target);
		WM.current.set(target, callback);
	}

	function unobserve(target: HTMLElement) {
		if (!isBrowser || !IO.current || !target) return;
		IO.current.unobserve(target);
		WM.current.delete(target);
	}

	function disconnect() {
		if (!isBrowser || !IO.current) return;
		IO.current.disconnect();
	}

	return {
		observe,
		unobserve,
		disconnect,
	};
}
