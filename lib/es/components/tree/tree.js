import { jsx } from 'react/jsx-runtime';
import { flushSync } from 'react-dom';
import { useState, useRef, useMemo, useEffect, useImperativeHandle } from 'react';
import { TreeList } from './item.js';
import VirtualTree from './virtual.js';

const defaultNodeProps = {
    key: "key",
    title: "title",
    children: "children",
};
function flattenTree(nodes, expandedMap, nodeProps, depth = 0, parentItem, asyncChildrenMap = {}) {
    const result = [];
    nodes.forEach((item, i) => {
        const mapKey = item[nodeProps.key];
        item.key = mapKey || `${parentItem?.key ?? ""}-${i}`;
        item.parent = parentItem;
        const isExpanded = !!expandedMap[item.key];
        result.push({ node: item, depth, isExpanded });
        const children = asyncChildrenMap[item.key] || item[nodeProps.children];
        if (Array.isArray(children) && children.length) {
            const childNodes = flattenTree(children, expandedMap, nodeProps, depth + 1, item, asyncChildrenMap);
            if (isExpanded)
                result.push(...childNodes);
        }
    });
    return result;
}
const Tree = (props) => {
    const { data = [], ref, selected, checked = [], disabledRelated, nodeProps, height, virtual, onItemSelect, onItemCheck, ...restProps } = props;
    const [selectedKey, setSelectedKey] = useState(selected);
    const [checkedKeys, setCheckedKeys] = useState(checked);
    const [partofs, setPartofs] = useState({});
    const [loadingMap, setLoadingMap] = useState({});
    const [asyncChildrenMap, setAsyncChildrenMap] = useState({});
    const nodeMapsRef = useRef(new Map());
    const oNodeProps = useMemo(() => ({ ...defaultNodeProps, ...nodeProps }), [nodeProps]);
    const checkedSet = useMemo(() => new Set(checkedKeys), [checkedKeys]);
    const [expandedMap, setExpandedMap] = useState(() => {
        const map = {};
        const walk = (nodes, parentKey = "") => {
            nodes.forEach((item, i) => {
                const mapKey = item[oNodeProps.key];
                const key = mapKey || `${parentKey}-${i}`;
                if (item.expanded)
                    map[key] = true;
                const children = item[oNodeProps.children];
                if (Array.isArray(children) && children.length)
                    walk(children, key);
            });
        };
        walk(data);
        return map;
    });
    const handleExpand = (key) => {
        if (loadingMap[key])
            return;
        const item = nodeMapsRef.current.get(key);
        if (!item)
            return;
        const rawChildren = item[oNodeProps.children];
        const isLazy = typeof rawChildren === "function";
        const isAsync = rawChildren instanceof Promise || isLazy;
        const isExpanded = !!expandedMap[key];
        if (isAsync && !isExpanded) {
            flushSync(() => {
                setLoadingMap((prev) => ({ ...prev, [key]: true }));
                setExpandedMap((prev) => ({ ...prev, [key]: true }));
            });
            const promise = isLazy ? rawChildren() : rawChildren;
            promise
                .then((resolved) => {
                item[oNodeProps.children] = resolved;
                setAsyncChildrenMap((prev) => ({ ...prev, [key]: resolved }));
            })
                .finally(() => {
                setLoadingMap((prev) => {
                    const next = { ...prev };
                    delete next[key];
                    return next;
                });
            });
        }
        else {
            setExpandedMap((prev) => ({
                ...prev,
                [key]: !prev[key],
            }));
        }
    };
    const flatNodes = useMemo(() => flattenTree(data, expandedMap, oNodeProps, 0, undefined, asyncChildrenMap), [data, expandedMap, oNodeProps, asyncChildrenMap]);
    const loadingKeys = useMemo(() => Object.keys(loadingMap).filter((k) => loadingMap[k]), [loadingMap]);
    const checkItem = (item, checked, direction) => {
        const { key = "", parent, children } = item;
        const shouldChanged = { [key]: checked };
        const partofs = { [key]: false };
        if (disabledRelated)
            return [shouldChanged];
        if (checked) {
            if (parent && direction !== "leaf") {
                const hasUnchecked = Array.isArray(parent.children)
                    ? parent.children.some((o) => o.key !== key && !checkedSet.has(o.key))
                    : false;
                const [changes, parts] = checkItem(parent, true, "root");
                if (!hasUnchecked) {
                    Object.assign(shouldChanged, changes);
                }
                Object.assign(partofs, hasUnchecked ? parts : {}, {
                    [parent.key]: true,
                });
            }
            if (Array.isArray(children) && children.length && direction !== "root") {
                children.map((o) => {
                    if (checkedSet.has(o.key))
                        return;
                    const [changes] = checkItem(o, true, "leaf");
                    Object.assign(shouldChanged, changes);
                    partofs[o.key] = false;
                });
            }
            return [shouldChanged, partofs];
        }
        if (parent && direction !== "leaf") {
            const [changes, parts] = checkItem(parent, false, "root");
            Object.assign(shouldChanged, changes);
            const hasChecked = Array.isArray(parent.children)
                ? parent.children.some((o) => checkedSet.has(o.key) && o.key !== key)
                : false;
            Object.assign(partofs, hasChecked ? {} : parts, {
                [parent.key]: hasChecked,
                [key]: false,
            });
        }
        if (Array.isArray(children) && children.length && direction !== "root") {
            children.map((o) => {
                const [changes] = checkItem(o, false, "leaf");
                if (!checkedSet.has(o.key))
                    return;
                Object.assign(shouldChanged, changes);
                partofs[o.key] = false;
            });
        }
        return [shouldChanged, partofs];
    };
    const handleCheck = (item, checked) => {
        const [shouldChanged, partofs] = checkItem(item, checked);
        const changedKeys = Object.keys(shouldChanged);
        const changedKeysSet = new Set(changedKeys);
        const nextChecked = checked
            ? Array.from(new Set([...checkedKeys, ...changedKeys]))
            : checkedKeys.filter((k) => !changedKeysSet.has(k));
        setCheckedKeys(nextChecked);
        setPartofs((p) => ({ ...p, ...partofs }));
        onItemCheck?.(item, checked, nextChecked);
    };
    const handleSelect = (key, item) => {
        if (!props.selectable)
            return;
        setSelectedKey(key);
        onItemSelect?.(key, item);
    };
    useEffect(() => {
        if (selected === undefined)
            return;
        setSelectedKey(selected);
    }, [selected]);
    useEffect(() => {
        nodeMapsRef.current.clear();
        const { key: keyProp, children: childrenProp } = oNodeProps;
        const walk = (nodes, parentKey = "") => {
            nodes.forEach((item, i) => {
                const mapKey = item[keyProp];
                const key = (mapKey || `${parentKey}-${i}`);
                nodeMapsRef.current.set(key, item);
                const itemChildren = item[childrenProp];
                if (Array.isArray(itemChildren) && itemChildren.length) {
                    walk(itemChildren, key);
                }
            });
        };
        walk(data);
    }, [data, oNodeProps, asyncChildrenMap]);
    useEffect(() => {
        if (!props.selected)
            return;
        const node = nodeMapsRef.current.get(props.selected);
        if (!node)
            return;
        const toExpand = {};
        let p = node.parent;
        while (p) {
            if (p.key)
                toExpand[p.key] = true;
            p = p.parent;
        }
        if (Object.keys(toExpand).length > 0) {
            setExpandedMap((prev) => ({ ...prev, ...toExpand }));
        }
    }, [props.selected]);
    useImperativeHandle(ref, () => {
        return {
            getChecked: () => {
                const items = [];
                checkedKeys.map((k) => {
                    const item = nodeMapsRef.current.get(k);
                    items.push(item);
                });
                return [checkedKeys, items];
            },
            getSelected: () => {
                const item = nodeMapsRef.current.get(selectedKey);
                return [selectedKey, item];
            },
            getPartofs: () => {
                const items = [];
                const keys = Object.keys(partofs).filter((k) => {
                    const indeterminate = partofs[k];
                    if (indeterminate) {
                        const item = nodeMapsRef.current.get(k);
                        items.push(item);
                    }
                    return indeterminate;
                });
                return [keys, items];
            },
        };
    });
    if (virtual) {
        return (jsx(VirtualTree, { flatNodes: flatNodes, onExpand: handleExpand, height: height, virtual: virtual, selected: selectedKey, checkedSet: checkedSet, partofs: partofs, nodeProps: oNodeProps, loadingKeys: loadingKeys, onItemCheck: handleCheck, onItemSelect: handleSelect, ...restProps }));
    }
    return (jsx(TreeList, { flatNodes: flatNodes, onExpand: handleExpand, selected: selectedKey, checkedSet: checkedSet, partofs: partofs, nodeProps: oNodeProps, loadingKeys: loadingKeys, onItemCheck: handleCheck, onItemSelect: handleSelect, ...restProps }));
};

export { Tree as default };
