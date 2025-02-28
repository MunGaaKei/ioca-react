import { useEffect } from "react";

type TMouseEvent = (e: MouseEvent) => void;
type TKeyboardEvent = (e: KeyboardEvent) => void;
type TEventOption = {
	disabled?: boolean;
};

const ClickEvents = new Set<TMouseEvent>();
const MouseMoveEvents = new Set<TMouseEvent>();
const MouseUpEvents = new Set<TMouseEvent>();
const KeydownEvents = new Set<TKeyboardEvent>();

const touchable = "ontouchend" in document;
const EVENTS: any = {
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

export function useMouseMove(listener: TMouseEvent, options?: TEventOption) {
	useEffect(() => {
		if (options?.disabled) return;

		MouseMoveEvents.add(listener);
		return () => {
			MouseMoveEvents.delete(listener);
		};
	}, [listener]);
}

export function useMouseUp(listener: TMouseEvent, options?: TEventOption) {
	useEffect(() => {
		if (options?.disabled) return;

		MouseUpEvents.add(listener);
		return () => {
			MouseUpEvents.delete(listener);
		};
	}, [listener]);
}

export function useKeydown(listener: TKeyboardEvent, options?: TEventOption) {
	useEffect(() => {
		if (options?.disabled) return;

		KeydownEvents.add(listener);
		return () => {
			KeydownEvents.delete(listener);
		};
	}, [listener]);
}

export function useIntersectionObserver(configs?: IntersectionObserverInit) {
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
