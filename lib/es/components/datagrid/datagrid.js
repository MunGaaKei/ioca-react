import { jsx, jsxs } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useReactive } from '../../js/hooks.js';
import { getNextSorter } from '../../js/utils.js';
import Loading from '../loading/loading.js';
import Empty from '../utils/empty/index.js';
import { hasArrayChanged, buildGridTemplateColumns, buildCssWidths, applyFixedInsets } from './helper.js';
import Row, { Header } from './row.js';
import VirtualDatagrid from './virtual.js';

const Datagrid = (props) => {
    const { data = [], columns = [], border = true, striped, header = true, resizable, cellPadding = ".5em", cellEllipsis, empty = jsx(Empty, {}), loading, height = "unset", rowHeight, style, className, rowKey, virtual, renderLoading = () => jsx(Loading, { className: "color-3", absolute: true }), onCellClick, onRowClick, onCellDoubleClick, onHeaderClick, onSort, onScroll, onResize, } = props;
    const container = useRef(null);
    const wrapRef = useRef(null);
    const state = useReactive({
        rows: data,
        widths: columns.map((col) => col.width ?? "min-content"),
        sortBy: "",
        sortType: "",
    });
    const previewRef = useRef({ index: -1, width: -1, template: "" });
    useEffect(() => {
        const next = columns.map((col, i) => (col.width != null ? col.width : (state.widths[i] ?? "min-content")));
        if (hasArrayChanged(next, state.widths))
            state.widths = next;
    }, [columns, state]);
    const styles = useMemo(() => {
        const { widths } = state;
        const o = {
            ...style,
            "--grid-template-columns": buildGridTemplateColumns(widths),
        };
        if (!resizable)
            return o;
        const cssWidths = buildCssWidths(widths);
        applyFixedInsets((k, v) => {
            o[k] = v;
        }, columns, cssWidths);
        return o;
    }, [columns, resizable, state.widths, style]);
    const handleWidthChange = useCallback((i, w, phase = "commit") => {
        if (!resizable)
            return;
        if (phase === "preview") {
            const el = wrapRef.current;
            if (!el)
                return;
            if (previewRef.current.index === i && previewRef.current.width === w) {
                return;
            }
            const template = buildGridTemplateColumns(state.widths, i, w);
            if (previewRef.current.template !== template) {
                el.style.setProperty("--grid-template-columns", template);
                const cssWidths = buildCssWidths(state.widths, i, w);
                applyFixedInsets((k, v) => el.style.setProperty(k, v), columns, cssWidths);
                previewRef.current.template = template;
            }
            previewRef.current.index = i;
            previewRef.current.width = w;
            return;
        }
        previewRef.current.index = -1;
        previewRef.current.width = -1;
        previewRef.current.template = "";
        if (state.widths[i] === w)
            return;
        const next = [...state.widths];
        next[i] = w;
        state.widths = next;
        onResize?.(columns[i], w);
    }, [columns, onResize, resizable, state, wrapRef]);
    const handleHeaderClick = useCallback((column, e) => {
        if (column?.sorter) {
            const [sortBy, sortType] = getNextSorter(state.sortBy, state.sortType, column.id);
            Object.assign(state, {
                sortBy,
                sortType,
            });
            onSort?.(sortBy, sortType);
        }
        onHeaderClick?.(column, e);
    }, [onHeaderClick, onSort, state]);
    const rows = useMemo(() => {
        const { sortBy, sortType } = state;
        if (sortBy && !onSort) {
            const sorter = columns.find((col) => col.id === sortBy)?.sorter;
            const sortFn = typeof sorter === "function" ? sorter : (a, b) => b[sortBy] - a[sortBy];
            const sorted = [...data].sort(sortFn);
            return sortType === "desc" ? sorted : sorted.reverse();
        }
        return data;
    }, [data, columns, state.sortBy, state.sortType]);
    const useVirtual = useMemo(() => {
        if (!virtual)
            return false;
        const rowHeight = virtual.rowHeight;
        return !!rowHeight && rowHeight > 0;
    }, [virtual]);
    const rowAuto = !useVirtual && rowHeight != null ? rowHeight : undefined;
    useEffect(() => {
        if (!container.current)
            return;
        const hasUnmeasured = columns.some((col, i) => col.width == null && typeof state.widths[i] !== "number");
        if (!hasUnmeasured)
            return;
        const div = container.current;
        const rafId = requestAnimationFrame(() => {
            const headerRow = div.querySelector(".i-datagrid-header.i-datagrid-row");
            const bodyRow = div.querySelector(".i-datagrid-row:not(.i-datagrid-header)");
            const headerCells = headerRow ? Array.from(headerRow.children) : [];
            const bodyCells = bodyRow ? Array.from(bodyRow.children) : [];
            const cellCount = Math.max(headerCells.length, bodyCells.length);
            if (cellCount < 1)
                return;
            const next = columns.map((col, i) => {
                if (col.width != null)
                    return col.width;
                const prev = state.widths[i];
                if (typeof prev === "number")
                    return prev;
                const hw = headerCells[i]?.offsetWidth ?? 0;
                const bw = bodyCells[i]?.offsetWidth ?? 0;
                const w = Math.max(hw, bw);
                return w > 0 ? w : "min-content";
            });
            if (hasArrayChanged(next, state.widths))
                state.widths = next;
        });
        return () => cancelAnimationFrame(rafId);
    }, [columns, state]);
    useEffect(() => {
        if (!loading)
            return;
        if (useVirtual)
            return;
        container.current?.scrollTo({ top: 0, left: 0 });
    }, [loading, useVirtual]);
    const mergedStyle = useMemo(() => ({
        "--cell-padding": cellPadding,
        ...styles,
    }), [cellPadding, styles]);
    const getRowKey = useMemo(() => {
        if (typeof rowKey === "function")
            return rowKey;
        if (typeof rowKey === "string") {
            return (row) => row?.[rowKey];
        }
        return (_row, index) => index;
    }, [rowKey]);
    return (jsxs("div", { style: {
            maxHeight: height,
            ...mergedStyle,
        }, className: classNames("i-datagrid-container", className, {
            "i-datagrid-bordered": border,
            "i-datagrid-striped": striped,
            "i-datagrid-normal": !virtual,
        }), children: [jsx("div", { ref: wrapRef, className: "i-datagrid-inner", style: useVirtual ? { overflowX: "visible", overflowY: "hidden" } : undefined, children: useVirtual && virtual ? (jsx(VirtualDatagrid, { virtual: virtual, columns: columns, rows: rows, header: header, sortBy: state.sortBy, sortType: state.sortType, height: height, loading: loading, resizable: resizable, striped: striped, cellEllipsis: cellEllipsis, empty: empty, wrapRef: wrapRef, containerRef: container, getRowKey: getRowKey, onHeaderClick: handleHeaderClick, onWidthChange: handleWidthChange, onRowClick: onRowClick, onCellClick: onCellClick, onCellDoubleClick: onCellDoubleClick, onScroll: onScroll })) : (jsxs("div", { ref: container, className: "i-datagrid", style: rowAuto != null ? { gridAutoRows: rowAuto } : undefined, onWheel: onScroll, children: [header && jsx(Header, { columns: columns, resizable: resizable, sortType: state.sortType, sortBy: state.sortBy, cellEllipsis: cellEllipsis, onWidthChange: handleWidthChange, onHeaderClick: handleHeaderClick }), rows.map((row, i) => (jsx(Row, { row: i + (header ? 1 : 0), data: row, cellEllipsis: cellEllipsis, columns: columns, onCellClick: onCellClick, onRowClick: onRowClick, onCellDoubleClick: onCellDoubleClick }, getRowKey(row, i) ?? i))), rows.length < 1 && empty] })) }), loading && renderLoading()] }));
};

export { Datagrid as default };
