import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useRef, useState, useEffect, useCallback } from 'react';
import { List } from 'react-window';
import { useResizeObserver } from '../../js/hooks.js';
import { TreeRow } from './item.js';

function VirtualTree(props) {
    const { flatNodes, onExpand, selected, checkedSet, partofs = {}, checkable, nodeProps, renderExtra, loadingKeys, height, useVirtual, className, style, onItemClick, onItemSelect, onItemCheck, } = props;
    const listRef = useRef(null);
    const wrapRef = useRef(null);
    const ro = useResizeObserver();
    const [viewportHeight, setViewportHeight] = useState(0);
    useEffect(() => {
        const el = wrapRef.current;
        if (!el)
            return;
        const update = () => {
            const r = el.getBoundingClientRect();
            setViewportHeight((prev) => (prev === r.height ? prev : r.height));
        };
        update();
        ro.observe?.(el, update);
        return () => ro.unobserve?.(el);
    }, [ro]);
    const listHeight = Math.max(0, (typeof height === "number" ? height : viewportHeight || 360));
    const propsRef = useRef(props);
    propsRef.current = props;
    const rowComponent = useCallback(({ index, style, }) => {
        const p = propsRef.current;
        const flatNode = p.flatNodes[index];
        if (!flatNode)
            return null;
        return (jsx(TreeRow, { flatNode: flatNode, wrapperStyle: style, virtualMode: true, selected: p.selected, checkedSet: p.checkedSet, partofs: p.partofs, checkable: p.checkable, nodeProps: p.nodeProps, renderExtra: p.renderExtra, loadingKeys: p.loadingKeys, onExpand: p.onExpand, onItemClick: p.onItemClick, onItemSelect: p.onItemSelect, onItemCheck: p.onItemCheck }));
    }, []);
    return (jsx("div", { ref: wrapRef, className: classNames("i-tree", className), style: { display: "block", width: "100%", height: "100%", ...style }, children: jsx(List, { listRef: listRef, rowCount: flatNodes.length, rowHeight: useVirtual.rowHeight, overscanCount: Math.max(3, useVirtual.threshold ?? 8), rowProps: {}, style: {
                width: "100%",
                height: listHeight,
                overflow: "auto",
            }, rowComponent: rowComponent }) }));
}

export { VirtualTree as default };
//# sourceMappingURL=virtual.js.map
