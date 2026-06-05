'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var reactWindow = require('react-window');
var hooks = require('../../js/hooks.js');
var loading = require('../loading/loading.js');
var resize = require('./resize.js');
var sorter = require('./sorter.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const VirtualCell = react.memo(function VirtualCell({ column, data, row, col, isHeader, cellEllipsis, sortBy, sortType, resizable, onWidthChange, }) {
    const { id, fixed, justify, colSpan, render, title, sorter: sorter$1, renderHeader } = column;
    const style = react.useMemo(() => ({
        "--datagrid-justify": justify,
        gridColumn: `${col + 1} / span ${colSpan ?? 1}`,
        insetInline: `var(--datagrid-cell-inset-${col})`,
        ...(isHeader ? { insetBlockStart: 0 } : null),
        position: !isHeader && !fixed ? "static" : undefined,
    }), [col, colSpan, fixed, isHeader, justify]);
    const order = isHeader && sortBy === id ? sortType : "";
    return (jsxRuntime.jsxs("div", { "data-col": id, className: classNames__default("i-datagrid-cell", {
            [`i-datagrid-cell-fixed-${fixed}`]: fixed,
            "i-datagrid-has-sorter": isHeader && sorter$1,
        }), style: style, children: [isHeader
                ? (renderHeader?.(column, col) ?? (jsxRuntime.jsx("div", { className: classNames__default("i-datagrid-cell-content", {
                        "i-datagrid-cell-content-ellipsis": cellEllipsis,
                    }), children: title || id })))
                : (render?.(data?.[id], data, row, col) ?? (jsxRuntime.jsx("div", { className: classNames__default("i-datagrid-cell-content", {
                        "i-datagrid-cell-content-ellipsis": cellEllipsis,
                    }), children: data?.[id] }))), isHeader && sorter$1 && jsxRuntime.jsx(sorter.default, { type: order }), isHeader && resizable && (jsxRuntime.jsx(resize.default, { index: col, onWidthChange: onWidthChange }))] }));
});
// ---------------------------------------------------------------------------
// VirtualRow — memoised row rendered by react-window
// ---------------------------------------------------------------------------
const VirtualRow = react.memo(function VirtualRow({ index, style: itemStyle, ariaAttributes, rows, columns, columnById, columnIndexById, contentWidthPx, virtualRowHeight, header, striped, cellEllipsis, loaderNode, sortBy, sortType, resizable, onWidthChange, onRowClick, onCellClick, onCellDoubleClick, }) {
    if (index >= rows.length) {
        return (jsxRuntime.jsx("div", { ...ariaAttributes, style: {
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
    const handleCellClick = react.useCallback((e) => {
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
    }, [columnById, columnIndexById, onCellClick, rowData, rowNum]);
    const handleCellDoubleClick = react.useCallback((e) => {
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
    }, [columnById, columnIndexById, onCellDoubleClick, rowData, rowNum]);
    const handleRowClick = react.useCallback(() => onRowClick?.(rowData, rowNum), [onRowClick, rowData, rowNum]);
    return (jsxRuntime.jsx("div", { style: {
            ...itemStyle,
            width: contentWidthPx,
            minWidth: "100%",
            display: "grid",
            gridTemplateColumns: "var(--grid-template-columns)",
            height: virtualRowHeight,
            "--datagrid-cell-background": bg,
        }, className: 'i-datagrid-row', onClick: handleRowClick, onClickCapture: handleCellClick, onDoubleClickCapture: handleCellDoubleClick, children: columns.map((c, col) => (jsxRuntime.jsx(VirtualCell, { column: c, data: rowData, row: rowNum, col: col, cellEllipsis: cellEllipsis, sortBy: sortBy, sortType: sortType, resizable: resizable, onWidthChange: onWidthChange }, c.id))) }));
});
// ---------------------------------------------------------------------------
// VirtualDatagrid
// ---------------------------------------------------------------------------
function VirtualDatagrid(props) {
    const { virtual, columns, rows, header, sortBy, sortType, height, loading: loading$1, resizable, striped, cellEllipsis, empty, wrapRef, containerRef, onHeaderClick, onWidthChange, onRowClick, onCellClick, onCellDoubleClick, onScroll, } = props;
    const headerRef = react.useRef(null);
    const headerInnerRef = react.useRef(null);
    const listRef = react.useRef(null);
    const ro = hooks.useResizeObserver();
    const triggerRef = react.useRef({ rowCount: -1 });
    const [viewport, setViewport] = react.useState({ width: 0, height: 0 });
    const [contentWidth, setContentWidth] = react.useState(0);
    const rafRef = react.useRef({
        viewport: 0,
        contentWidth: 0,
        scrollSync: 0,
    });
    const columnById = react.useMemo(() => {
        const map = new Map();
        columns.forEach((c) => map.set(c.id, c));
        return map;
    }, [columns]);
    const columnIndexById = react.useMemo(() => {
        const map = new Map();
        columns.forEach((c, i) => map.set(c.id, i));
        return map;
    }, [columns]);
    const handleHeaderClick = react.useCallback((e) => {
        const el = e.target?.closest?.(".i-datagrid-cell[data-col]");
        const id = el?.dataset?.col;
        onHeaderClick(id ? columnById.get(id) : undefined, e);
    }, [columnById, onHeaderClick]);
    const handleBodyScroll = react.useCallback((e) => {
        const el = e.currentTarget;
        if (!el)
            return;
        if (rafRef.current.scrollSync)
            return;
        rafRef.current.scrollSync = requestAnimationFrame(() => {
            rafRef.current.scrollSync = 0;
            if (!headerRef.current)
                return;
            const target = el.scrollLeft;
            if (headerRef.current.scrollLeft !== target) {
                headerRef.current.scrollLeft = target;
            }
        });
    }, []);
    const handleReachEnd = react.useCallback(() => {
        if (virtual.onReachEnd) {
            virtual.onReachEnd();
            return;
        }
        onScroll?.(undefined);
    }, [onScroll, virtual.onReachEnd]);
    const handleRowsRendered = react.useCallback((_visible, overscan) => {
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
    const handleHeaderScroll = react.useCallback((e) => {
        const el = e.currentTarget;
        if (!el)
            return;
        const listEl = listRef.current?.element;
        if (listEl && listEl.scrollLeft !== el.scrollLeft) {
            listEl.scrollLeft = el.scrollLeft;
        }
    }, []);
    react.useEffect(() => {
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
    react.useEffect(() => {
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
    react.useEffect(() => {
        triggerRef.current.rowCount = -1;
    }, [rows.length, virtual.hasMore]);
    react.useEffect(() => {
        if (!loading$1)
            return;
        const listEl = listRef.current?.element;
        listEl?.scrollTo({ top: 0, left: 0 });
        headerRef.current?.scrollTo({ top: 0, left: 0 });
    }, [loading$1]);
    const listHeight = Math.max(0, (typeof height === "number" ? height : viewport.height || 360) -
        (header ? virtual.rowHeight : 0));
    const hasVerticalScrollbar = rows.length * virtual.rowHeight > listHeight + 1;
    const scrollbarSize = hasVerticalScrollbar ? reactWindow.getScrollbarSize() : 0;
    const measuredContentWidth = Math.max(contentWidth, viewport.width || 0);
    const contentWidthPx = measuredContentWidth
        ? `${measuredContentWidth}px`
        : "fit-content";
    const headerCells = react.useMemo(() => columns.map((c, col) => (jsxRuntime.jsx(VirtualCell, { column: c, row: 0, col: col, isHeader: true, cellEllipsis: cellEllipsis, sortBy: sortBy, sortType: sortType, resizable: resizable, onWidthChange: onWidthChange }, c.id))), [
        cellEllipsis,
        columns,
        onWidthChange,
        resizable,
        sortBy,
        sortType,
    ]);
    const headerInnerStyle = react.useMemo(() => ({
        display: "grid",
        gridTemplateColumns: "var(--grid-template-columns)",
        height: virtual.rowHeight,
        width: contentWidthPx,
        minWidth: "100%",
    }), [contentWidthPx, virtual.rowHeight]);
    const listStyle = react.useMemo(() => ({
        height: listHeight,
        width: "100%",
        overflow: "auto",
    }), [listHeight]);
    const headerWrapStyle = react.useMemo(() => scrollbarSize > 0
        ? {
            paddingRight: scrollbarSize,
            boxSizing: "content-box",
        }
        : undefined, [scrollbarSize]);
    const loaderNode = react.useMemo(() => virtual.loader ?? jsxRuntime.jsx(loading.default, { className: 'my-12' }), [virtual.loader]);
    // Stable row-component reference so react-window can memoise rows.
    const rowProps = react.useMemo(() => ({
        rows,
        columns,
        columnById,
        columnIndexById,
        contentWidthPx,
        virtualRowHeight: virtual.rowHeight,
        header,
        striped,
        cellEllipsis,
        loaderNode,
        sortBy,
        sortType,
        resizable,
        onWidthChange,
        onRowClick,
        onCellClick,
        onCellDoubleClick,
    }), [
        rows,
        columns,
        columnById,
        columnIndexById,
        contentWidthPx,
        virtual.rowHeight,
        header,
        striped,
        cellEllipsis,
        loaderNode,
        sortBy,
        sortType,
        resizable,
        onWidthChange,
        onRowClick,
        onCellClick,
        onCellDoubleClick,
    ]);
    return (jsxRuntime.jsxs("div", { ref: containerRef, className: classNames__default("i-datagrid", {
            "i-datagrid-loading": loading$1,
        }), style: { display: "block", width: "100%", maxWidth: "100%" }, children: [header && (jsxRuntime.jsx("div", { ref: headerRef, className: 'i-datagrid-virtual-header', onScroll: handleHeaderScroll, style: headerWrapStyle, children: jsxRuntime.jsx("div", { ref: headerInnerRef, className: 'i-datagrid-header i-datagrid-row', style: headerInnerStyle, onClick: handleHeaderClick, children: headerCells }) })), jsxRuntime.jsx(reactWindow.List, { listRef: listRef, rowCount: rows.length + (virtual.hasMore ? 1 : 0), rowHeight: virtual.rowHeight, overscanCount: Math.max(3, virtual.threshold ?? 8), rowProps: rowProps, style: listStyle, onScroll: handleBodyScroll, onRowsRendered: handleRowsRendered, rowComponent: VirtualRow }), rows.length < 1 && !virtual.hasMore && empty] }));
}

exports.default = VirtualDatagrid;
//# sourceMappingURL=virtual.js.map
