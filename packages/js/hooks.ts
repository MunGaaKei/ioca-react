import { useEffect } from "react";

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
	if (!document || initialized) return;
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

const defaultObserver = {
	observe: undefined,
	unobserve: undefined,
	disconnect: undefined,
};

export function useIntersectionObserver(configs?: IntersectionObserverInit) {
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

	function observe(target: HTMLElement, callback: Function) {
		if (WM.get(target)) return;
		WM.set(target, callback);
		target && IO.observe(target);
	}

	function unobserve(target: HTMLElement) {
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

export function useResizeObserver() {
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

	function observe(target: HTMLElement, callback: Function) {
		if (WM.get(target)) return;
		target && IO.observe(target);
		WM.set(target, callback);
	}

	function unobserve(target: HTMLElement) {
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
