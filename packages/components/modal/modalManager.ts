export type StackEntry = {
	mid: string;
	visible: boolean;
	hideBackdrop: boolean;
	closable: boolean;
};

type Listener = () => void;

const CONTAINER_ID = "i-modal-container";
const BACKDROP_ID = "i-modal-backdrop";
let containerEl: HTMLDivElement | null = null;
let backdropEl: HTMLDivElement | null = null;
const stack: StackEntry[] = [];
const listeners = new Set<Listener>();

function ensureContainer(): HTMLDivElement {
	if (containerEl) return containerEl;

	containerEl = document.createElement("div");
	containerEl.id = CONTAINER_ID;
	containerEl.className = "i-modal-container";
	document.body.append(containerEl);

	backdropEl = document.createElement("div");
	backdropEl.id = BACKDROP_ID;
	backdropEl.className = "i-modal-backdrop";
	containerEl.prepend(backdropEl);

	return containerEl;
}

function syncBackdrop() {
	if (!backdropEl) return;
	const show = stack.some((e) => e.visible && !e.hideBackdrop);
	backdropEl.classList.toggle("i-modal-backdrop-active", show);
}

function notify() {
	listeners.forEach((fn) => fn());
}

export function register(entry: StackEntry): () => void {
	ensureContainer();
	stack.push(entry);
	syncBackdrop();
	notify();

	return () => {
		const idx = stack.findIndex((e) => e.mid === entry.mid);
		if (idx !== -1) stack.splice(idx, 1);
		syncBackdrop();
		notify();

		if (stack.length === 0) {
			backdropEl?.remove();
			backdropEl = null;
			containerEl?.remove();
			containerEl = null;
		}
	};
}

export function updateVisible(mid: string, visible: boolean) {
	const entry = stack.find((e) => e.mid === mid);
	if (entry) {
		entry.visible = visible;
		syncBackdrop();
		notify();
	}
}

export function isTop(mid: string): boolean {
	const top = getTopVisible();
	return top?.mid === mid;
}

export function getTopVisible(): StackEntry | undefined {
	for (let i = stack.length - 1; i >= 0; i--) {
		if (stack[i].visible) return stack[i];
	}
	return undefined;
}

export function getContainer(): HTMLDivElement {
	return ensureContainer();
}

export function subscribe(fn: Listener): () => void {
	listeners.add(fn);
	return () => listeners.delete(fn);
}

export function shouldShowBackdrop(): boolean {
	return stack.some((e) => e.visible && !e.hideBackdrop);
}
