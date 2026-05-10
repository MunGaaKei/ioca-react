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
    const getVirtualCellStyle = react.useCallback(({ justify, col, colSpan = 1, }) => {
        return {
            "--datagrid-justify": justify,
            gridColumn: `${col + 1} / span ${colSpan}`,
            insetInline: `var(--datagrid-cell-inset-${col})`,
        };
    }, []);
    const renderVirtualCell = react.useCallback(({ column, data, row, col, isHeader, }) => {
        const { id, fixed, justify, colSpan, render, title, sorter: sorter$1, renderHeader, } = column;
        const style = {
            ...getVirtualCellStyle({ justify, col, colSpan }),
            ...(isHeader ? { insetBlockStart: 0 } : null),
        };
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
                        }), children: data?.[id] }))), isHeader && sorter$1 && jsxRuntime.jsx(sorter.default, { type: order }), isHeader && resizable && (jsxRuntime.jsx(resize.default, { index: col, onWidthChange: onWidthChange }))] }, id));
    }, [
        cellEllipsis,
        getVirtualCellStyle,
        onWidthChange,
        resizable,
        sortBy,
        sortType,
    ]);
    const handleHeaderClick = react.useCallback((e) => {
        const el = e.target?.closest?.(".i-datagrid-cell[data-col]");
        const id = el?.dataset?.col;
        onHeaderClick(id ? columnById.get(id) : undefined, e);
    }, [columnById, onHeaderClick]);
    const handleBodyScroll = react.useCallback((e) => {
        const el = e.currentTarget;
        if (!el)
            return;
        if (headerRef.current &&
            headerRef.current.scrollLeft !== el.scrollLeft) {
            headerRef.current.scrollLeft = el.scrollLeft;
        }
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
    const handleBodyClickCapture = react.useCallback((e, rowData, rowNum) => {
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
    const handleBodyDoubleClickCapture = react.useCallback((e, rowData, rowNum) => {
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
    const headerCells = react.useMemo(() => columns.map((c, col) => renderVirtualCell({
        column: c,
        row: 0,
        col,
        isHeader: true,
    })), [columns, renderVirtualCell]);
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
    const rowComponent = react.useCallback(({ index, style: itemStyle }) => {
        if (index >= rows.length) {
            return (jsxRuntime.jsx("div", { style: {
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
        return (jsxRuntime.jsx("div", { style: {
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
    return (jsxRuntime.jsxs("div", { ref: containerRef, className: classNames__default("i-datagrid", {
            "i-datagrid-loading": loading$1,
        }), style: { display: "block", width: "100%", maxWidth: "100%" }, children: [header && (jsxRuntime.jsx("div", { ref: headerRef, className: 'i-datagrid-virtual-header', onScroll: handleHeaderScroll, style: headerWrapStyle, children: jsxRuntime.jsx("div", { ref: headerInnerRef, className: 'i-datagrid-header i-datagrid-row', style: headerInnerStyle, onClick: handleHeaderClick, children: headerCells }) })), jsxRuntime.jsx(reactWindow.List, { listRef: listRef, rowCount: rows.length + (virtual.hasMore ? 1 : 0), rowHeight: virtual.rowHeight, overscanCount: Math.max(3, virtual.threshold ?? 8), rowProps: {}, style: listStyle, onScroll: handleBodyScroll, onRowsRendered: handleRowsRendered, rowComponent: rowComponent }), rows.length < 1 && !virtual.hasMore && empty] }));
}

exports.default = VirtualDatagrid;
//# sourceMappingURL=virtual.js.map
