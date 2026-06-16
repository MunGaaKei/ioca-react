const CONTAINER_ID = "i-modal-container";
const BACKDROP_ID = "i-modal-backdrop";
let containerEl = null;
let backdropEl = null;
const stack = [];
const listeners = new Set();
function ensureContainer() {
    if (containerEl)
        return containerEl;
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
    if (!backdropEl)
        return;
    const show = stack.some((e) => e.visible && !e.hideBackdrop);
    backdropEl.classList.toggle("i-modal-backdrop-active", show);
}
function notify() {
    listeners.forEach((fn) => fn());
}
function register(entry) {
    ensureContainer();
    stack.push(entry);
    syncBackdrop();
    notify();
    return () => {
        const idx = stack.findIndex((e) => e.mid === entry.mid);
        if (idx !== -1)
            stack.splice(idx, 1);
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
function updateVisible(mid, visible) {
    const entry = stack.find((e) => e.mid === mid);
    if (entry) {
        entry.visible = visible;
        syncBackdrop();
        notify();
    }
}
function isTop(mid) {
    const top = getTopVisible();
    return top?.mid === mid;
}
function getTopVisible() {
    for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].visible)
            return stack[i];
    }
    return undefined;
}
function getContainer() {
    return ensureContainer();
}
function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

export { getContainer, getTopVisible, isTop, register, subscribe, updateVisible };
