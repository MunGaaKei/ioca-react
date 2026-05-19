function getDeep(obj, path) {
    if (!path.includes("."))
        return obj[path];
    return path.split(".").reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}
function setDeep(obj, path, value) {
    const parts = path.split(".");
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        if (current[key] == null || typeof current[key] !== "object") {
            current[key] = {};
        }
        current = current[key];
    }
    current[parts[parts.length - 1]] = value;
}
function deleteDeep(obj, path) {
    const parts = path.split(".");
    const parent = parts
        .slice(0, -1)
        .reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
    if (parent != null) {
        delete parent[parts[parts.length - 1]];
    }
}

export { deleteDeep, getDeep, setDeep };
//# sourceMappingURL=utils.js.map
