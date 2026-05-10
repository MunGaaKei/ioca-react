import { jsxs, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { getScrollbarSize, List } from 'react-window';
import { useResizeObserver } from '../../js/hooks.js';
import Loading from '../loading/loading.js';
import Resize from './resize.js';
import Sorter from './sorter.js';

function VirtualDatagrid(props) {
    const { virtual, columns, rows, header, sortBy, sortType, height, loading, resizable, striped, cellEllipsis, empty, wrapRef, containerRef, onHeaderClick, onWidthChange, onRowClick, onCellClick, onCellDoubleClick, onScroll, } = props;
    const headerRef = useRef(null);
    const headerInnerRef = useRef(null);
    const listRef = useRef(null);
    const ro = useResizeObserver();
    const triggerRef = useRef({ rowCount: -1 });
    const [viewport, setViewport] = useState({ width: 0, height: 0 });
    const [contentWidth, setContentWidth] = useState(0);
    const rafRef = useRef({
        viewport: 0,
        contentWidth: 0,
    });
    const columnById = useMemo(() => {
        const map = new Map();
        columns.forEach((c) => map.set(c.id, c));
        return map;
    }, [columns]);
    const columnIndexById = useMemo(() => {
        const map = new Map();
        columns.forEach((c, i) => map.set(c.id, i));
        return map;
    }, [columns]);
    const getVirtualCellStyle = useCallback(({ justify, col, colSpan = 1, }) => {
        return {
            "--datagrid-justify": justify,
            gridColumn: `${col + 1} / span ${colSpan}`,
            insetInline: `var(--datagrid-cell-inset-${col})`,
        };
    }, []);
    const renderVirtualCell = useCallback(({ column, data, row, col, isHeader, }) => {
        const { id, fixed, justify, colSpan, render, title, sorter, renderHeader, } = column;
        const style = {
            ...getVirtualCellStyle({ justify, col, colSpan }),
            ...(isHeader ? { insetBlockStart: 0 } : null),
        };
        const order = isHeader && sortBy === id ? sortType : "";
        return (jsxs("div", { "data-col": id, className: classNames("i-datagrid-cell", {
                [`i-datagrid-cell-fixed-${fixed}`]: fixed,
                "i-datagrid-has-sorter": isHeader && sorter,
            }), style: style, children: [isHeader
                    ? (renderHeader?.(column, col) ?? (jsx("div", { className: classNames("i-datagrid-cell-content", {
                            "i-datagrid-cell-content-ellipsis": cellEllipsis,
                        }), children: title || id })))
                    : (render?.(data?.[id], data, row, col) ?? (jsx("div", { className: classNames("i-datagrid-cell-content", {
                            "i-datagrid-cell-content-ellipsis": cellEllipsis,
                        }), children: data?.[id] }))), isHeader && sorter && jsx(Sorter, { type: order }), isHeader && resizable && (jsx(Resize, { index: col, onWidthChange: onWidthChange }))] }, id));
    }, [
        cellEllipsis,
        getVirtualCellStyle,
        onWidthChange,
        resizable,
        sortBy,
        sortType,
    ]);
    const handleHeaderClick = useCallback((e) => {
        const el = e.target?.closest?.(".i-datagrid-cell[data-col]");
        const id = el?.dataset?.col;
        onHeaderClick(id ? columnById.get(id) : undefined, e);
    }, [columnById, onHeaderClick]);
    const handleBodyScroll = useCallback((e) => {
        const el = e.currentTarget;
        if (!el)
            return;
        if (headerRef.current &&
            headerRef.current.scrollLeft !== el.scrollLeft) {
            headerRef.current.scrollLeft = el.scrollLeft;
        }
    }, []);
    const handleReachEnd = useCallback(() => {
        if (virtual.onReachEnd) {
            virtual.onReachEnd();
            return;
        }
        onScroll?.(undefined);
    }, [onScroll, virtual.onReachEnd]);
    const handleRowsRendered = useCallback((_visible, overscan) => {
        if (!virtual.hasMore)
            return;
        const threshold = virtual.threshold ?? 8;
        const stopIndex = overscan?.stopIndex ?? -1;
        if (stopIndex < rows.length - 1 - threshold)
            return;
        if (triggerRef.current.rowCount === rows.length)
            return;
        triggerRef.current.rowCount = rows.length;
        handleReachEnd();
    }, [handleReachEnd, rows.length, virtual.hasMore, virtual.threshold]);
    const handleHeaderScroll = useCallback((e) => {
        const el = e.currentTarget;
        if (!el)
            return;
        const listEl = listRef.current?.element;
        if (listEl && listEl.scrollLeft !== el.scrollLeft) {
            listEl.scrollLeft = el.scrollLeft;
        }
    }, []);
    const handleBodyClickCapture = useCallback((e, rowData, rowNum) => {
        if (!onCellClick)
            return;
        const el = e.target?.closest?.(".i-datagrid-cell[data-col]");
        const id = el?.dataset?.col;
        if (!id)
            return;
        const column = columnById.get(id);
        const col = columnIndexById.get(id);
        if (!column || col == null)
            return;
        onCellClick(rowData, column, rowNum, col, e);
    }, [columnById, columnIndexById, onCellClick]);
    const handleBodyDoubleClickCapture = useCallback((e, rowData, rowNum) => {
        if (!onCellDoubleClick)
            return;
        const el = e.target?.closest?.(".i-datagrid-cell[data-col]");
        const id = el?.dataset?.col;
        if (!id)
            return;
        const column = columnById.get(id);
        const col = columnIndexById.get(id);
        if (!column || col == null)
            return;
        onCellDoubleClick(rowData, column, rowNum, col, e);
    }, [columnById, columnIndexById, onCellDoubleClick]);
    useEffect(() => {
        const el = wrapRef.current;
        if (!el)
            return;
        const update = () => {
            if (rafRef.current.viewport)
                cancelAnimationFrame(rafRef.current.viewport);
            rafRef.current.viewport = requestAnimationFrame(() => {
                rafRef.current.viewport = 0;
                const r = el.getBoundingClientRect();
                const w = Math.round(r.width);
                const h = Math.round(r.height);
                setViewport((prev) => {
                    if (prev.width === w && prev.height === h)
                        return prev;
                    return { width: w, height: h };
                });
            });
        };
        update();
        ro.observe?.(el, update);
        return () => {
            ro.unobserve?.(el);
            if (rafRef.current.viewport)
                cancelAnimationFrame(rafRef.current.viewport);
            rafRef.current.viewport = 0;
        };
    }, [ro, wrapRef]);
    useEffect(() => {
        const el = headerInnerRef.current;
        if (!el)
            return;
        const update = () => {
            if (rafRef.current.contentWidth) {
                cancelAnimationFrame(rafRef.current.contentWidth);
            }
            rafRef.current.contentWidth = requestAnimationFrame(() => {
                rafRef.current.contentWidth = 0;
                const w = Math.ceil(el.scrollWidth);
                setContentWidth((prev) => (prev === w ? prev : w));
            });
        };
        update();
        ro.observe?.(el, update);
        return () => {
            ro.unobserve?.(el);
            if (rafRef.current.contentWidth) {
                cancelAnimationFrame(rafRef.current.contentWidth);
            }
            rafRef.current.contentWidth = 0;
        };
    }, [ro]);
    useEffect(() => {
        triggerRef.current.rowCount = -1;
    }, [rows.length, virtual.hasMore]);
    useEffect(() => {
        if (!loading)
            return;
        const listEl = listRef.current?.element;
        listEl?.scrollTo({ top: 0, left: 0 });
        headerRef.current?.scrollTo({ top: 0, left: 0 });
    }, [loading]);
    const listHeight = Math.max(0, (typeof height === "number" ? height : viewport.height || 360) -
        (header ? virtual.rowHeight : 0));
    const hasVerticalScrollbar = rows.length * virtual.rowHeight > listHeight + 1;
    const scrollbarSize = hasVerticalScrollbar ? getScrollbarSize() : 0;
    const measuredContentWidth = Math.max(contentWidth, viewport.width || 0);
    const contentWidthPx = measuredContentWidth
        ? `${measuredContentWidth}px`
        : "fit-content";
    const headerCells = useMemo(() => columns.map((c, col) => renderVirtualCell({
        column: c,
        row: 0,
        col,
        isHeader: true,
    })), [columns, renderVirtualCell]);
    const headerInnerStyle = useMemo(() => ({
        display: "grid",
        gridTemplateColumns: "var(--grid-template-columns)",
        height: virtual.rowHeight,
        width: contentWidthPx,
        minWidth: "100%",
    }), [contentWidthPx, virtual.rowHeight]);
    const listStyle = useMemo(() => ({
        height: listHeight,
        width: "100%",
        overflow: "auto",
    }), [listHeight]);
    const headerWrapStyle = useMemo(() => scrollbarSize > 0
        ? {
            paddingRight: scrollbarSize,
            boxSizing: "content-box",
        }
        : undefined, [scrollbarSize]);
    const loaderNode = useMemo(() => virtual.loader ?? jsx(Loading, { className: 'my-12' }), [virtual.loader]);
    const rowComponent = useCallback(({ index, style: itemStyle }) => {
        if (index >= rows.length) {
            return (jsx("div", { style: {
                    ...itemStyle,
                    width: contentWidthPx,
                    minWidth: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }, children: loaderNode }));
        }
        const rowData = rows[index];
        const rowNum = index + (header ? 1 : 0);
        const bg = striped && index % 2 === 0 ? "var(--background-1)" : undefined;
        return (jsx("div", { style: {
                ...itemStyle,
                width: contentWidthPx,
                minWidth: "100%",
                display: "grid",
                gridTemplateColumns: "var(--grid-template-columns)",
                height: virtual.rowHeight,
                "--datagrid-cell-background": bg,
            }, className: 'i-datagrid-row', onClickCapture: (e) => handleBodyClickCapture(e, rowData, rowNum), onDoubleClickCapture: (e) => handleBodyDoubleClickCapture(e, rowData, rowNum), onClick: () => onRowClick?.(rowData, rowNum), children: columns.map((c, col) => renderVirtualCell({
                column: c,
                data: rowData,
                row: rowNum,
                col,
            })) }));
    }, [
        columns,
        contentWidthPx,
        handleBodyClickCapture,
        handleBodyDoubleClickCapture,
        header,
        loaderNode,
        onRowClick,
        renderVirtualCell,
        rows,
        striped,
        virtual.rowHeight,
    ]);
    return (jsxs("div", { ref: containerRef, className: classNames("i-datagrid", {
            "i-datagrid-loading": loading,
        }), style: { display: "block", width: "100%", maxWidth: "100%" }, children: [header && (jsx("div", { ref: headerRef, className: 'i-datagrid-virtual-header', onScroll: handleHeaderScroll, style: headerWrapStyle, children: jsx("div", { ref: headerInnerRef, className: 'i-datagrid-header i-datagrid-row', style: headerInnerStyle, onClick: handleHeaderClick, children: headerCells }) })), jsx(List, { listRef: listRef, rowCount: rows.length + (virtual.hasMore ? 1 : 0), rowHeight: virtual.rowHeight, overscanCount: Math.max(3, virtual.threshold ?? 8), rowProps: {}, style: listStyle, onScroll: handleBodyScroll, onRowsRendered: handleRowsRendered, rowComponent: rowComponent }), rows.length < 1 && !virtual.hasMore && empty] }));
}

export { VirtualDatagrid as default };
//# sourceMappingURL=virtual.js.map
