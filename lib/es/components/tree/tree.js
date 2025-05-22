import { jsx } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import { useEffect, useImperativeHandle } from 'react';
import { TreeList } from './item.js';

const defaultNodeProps = {
    key: "key",
    title: "title",
    children: "children",
};
const Tree = (props) => {
    const { data = [], ref, selected, checked = [], disabledRelated, nodeProps, onItemSelect, onItemCheck, ...restProps } = props;
    const state = useReactive({
        selected,
        checked,
        partofs: {},
        nodeMaps: new Map(),
    });
    const oNodeProps = Object.assign({}, defaultNodeProps, nodeProps);
    const isChecked = (key) => state.checked.includes(key || "");
    const checkItem = (item, checked, direction) => {
        const { key = "", parent, children } = item;
        const shouldChanged = { [key]: checked };
        const partofs = { [key]: false };
        if (disabledRelated)
            return [shouldChanged];
        if (checked) {
            if (parent && direction !== "leaf") {
                const hasUnchecked = parent.children?.some((o) => o.key !== key && !isChecked(o.key));
                const [changes, parts] = checkItem(parent, true, "root");
                if (!hasUnchecked) {
                    Object.assign(shouldChanged, changes);
                }
                Object.assign(partofs, hasUnchecked ? parts : {}, {
                    [parent.key]: true,
                });
            }
            if (children?.length && direction !== "root") {
                children.map((o) => {
                    if (isChecked(o.key))
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
            const hasChecked = parent.children?.some((o) => isChecked(o.key) && o.key !== key);
            Object.assign(partofs, hasChecked ? {} : parts, {
                [parent.key]: hasChecked,
                [key]: false,
            });
        }
        if (children?.length && direction !== "root") {
            children.map((o) => {
                const [changes] = checkItem(o, false, "leaf");
                if (!isChecked(o.key))
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
        state.checked = checked
            ? Array.from(new Set([...state.checked, ...changedKeys]))
            : state.checked.filter((k) => !changedKeys.includes(k));
        Object.assign(state.partofs, partofs);
        onItemCheck?.(item, checked, state.checked);
    };
    const handleSelect = (key, item) => {
        if (!props.selectable)
            return;
        state.selected = key;
        onItemSelect?.(key, item);
    };
    useEffect(() => {
        if (selected === undefined)
            return;
        state.selected = selected;
    }, [selected]);
    useEffect(() => {
        state.nodeMaps.clear();
        const { key, children } = oNodeProps;
        const recursive = (nodes) => {
            nodes.map((o) => {
                state.nodeMaps.set(o[key], o);
                o[children]?.length > 0 && recursive(o[children]);
            });
        };
        recursive(data);
    }, [data]);
    useImperativeHandle(ref, () => {
        return {
            getChecked: () => {
                const items = [];
                state.checked.map((k) => {
                    const item = state.nodeMaps.get(k);
                    items.push(item);
                });
                return [state.checked, items];
            },
            getSelected: () => {
                const item = state.nodeMaps.get(state.selected);
                return [state.selected, item];
            },
            getPartofs: () => {
                const items = [];
                const keys = Object.keys(state.partofs).filter((k) => {
                    const indeterminate = state.partofs[k];
                    if (indeterminate) {
                        const item = state.nodeMaps.get(k);
                        items.push(item);
                    }
                    return indeterminate;
                });
                return [keys, items];
            },
        };
    });
    return (jsx(TreeList, { data: data, selected: state.selected, checked: state.checked, partofs: state.partofs, nodeProps: oNodeProps, onItemCheck: handleCheck, onItemSelect: handleSelect, ...restProps }));
};

export { Tree as default };
//# sourceMappingURL=tree.js.map
