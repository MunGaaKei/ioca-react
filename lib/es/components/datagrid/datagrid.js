import { jsx, jsxs } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useRef, useMemo, useEffect } from 'react';
import { getNextSorter } from '../../js/utils.js';
import Loading from '../loading/loading.js';
import Empty from '../utils/empty/index.js';
import Row, { Header } from './row.js';

const Datagrid = (props) => {
    const { data = [], columns = [], border, striped, header = true, resizable, cellPadding = ".5em", cellEllipsis, empty = jsx(Empty, {}), loading, height = "unset", style, className, renderLoading = () => (jsx(Loading, { size: '1.5em', className: 'color-3', absolute: true })), onCellClick, onRowClick, onCellDoubleClick, onHeaderClick, onSort, onScroll, onResize, } = props;
    const container = useRef(null);
    const state = useReactive({
        rows: data,
        widths: columns.map((col) => col.width ?? "min-content"),
        sortBy: "",
        sortType: "",
    });
    const styles = useMemo(() => {
        const { widths } = state;
        const o = {
            ...style,
            "--grid-template-columns": widths
                .map((w) => {
                return typeof w === "number" ? `${w}px` : w;
            })
                .join(" "),
        };
        if (!resizable)
            return o;
        const fws = columns.map((col, i) => {
            const { fixed } = col;
            if (!fixed)
                return 0;
            return widths[i];
        });
        columns.map((col, i) => {
            const { fixed } = col;
            if (!fixed)
                return;
            if (i === 0) {
                o[`--datagrid-cell-inset-0`] = 0;
            }
            else if (i === fws.length - 1) {
                o[`--datagrid-cell-inset-${fws.length - 1}`] = "auto 0";
            }
            else {
                const isLeft = fixed === "left";
                const before = isLeft ? fws.slice(0, i) : fws.slice(i + 1);
                const sum = before.reduce((pre, cur) => pre + cur) + "px";
                const result = isLeft ? `${sum} auto` : `auto ${sum}`;
                o[`--datagrid-cell-inset-${i}`] = result;
            }
        });
        return o;
    }, [state.widths, resizable]);
    const handleWidthChange = (i, w) => {
        if (!resizable)
            return;
        const [...ws] = state.widths;
        ws[i] = w;
        state.widths = ws;
        onResize?.(columns[i], w);
    };
    const handleHeaderClick = (column, e) => {
        if (column?.sorter) {
            const [sortBy, sortType] = getNextSorter(state.sortBy, state.sortType, column.id);
            Object.assign(state, {
                sortBy,
                sortType,
            });
            onSort?.(sortBy, sortType);
        }
        onHeaderClick?.(column, e);
    };
    const rows = useMemo(() => {
        const { sortBy, sortType } = state;
        if (sortBy && !onSort) {
            const sorter = columns.find((col) => col.id === sortBy)?.sorter;
            const sortFn = typeof sorter === "function"
                ? sorter
                : (a, b) => b[sortBy] - a[sortBy];
            const sorted = [...data].sort(sortFn);
            return sortType === "desc" ? sorted : sorted.reverse();
        }
        return data;
    }, [data, columns, state.sortBy, state.sortType]);
    useEffect(() => {
        if (!container.current)
            return;
        const { current: div } = container;
        const tds = div.querySelector(".i-datagrid-row")?.children;
        if (!tds?.length)
            return;
        state.widths = Array.from(tds).map((node) => node.offsetWidth);
    }, [columns, resizable]);
    useEffect(() => {
        loading && container.current?.scrollTo({ top: 0, left: 0 });
    }, [loading]);
    const mergedStyle = {
        "--cell-padding": cellPadding,
        ...styles,
    };
    return (jsxs("div", { style: { maxHeight: height, ...mergedStyle }, className: classNames("i-datagrid-container", className, {
            "i-datagrid-bordered": border,
            "i-datagrid-striped": striped,
        }), children: [jsxs("div", { ref: container, className: classNames("i-datagrid", {
                    "i-datagrid-loading": loading,
                }), onWheel: onScroll, children: [header && (jsx(Header, { columns: columns, resizable: resizable, sortType: state.sortType, sortBy: state.sortBy, cellEllipsis: cellEllipsis, onWidthChange: handleWidthChange, onHeaderClick: handleHeaderClick })), rows.map((row, i) => (jsx(Row, { row: i + (header ? 1 : 0), data: row, cellEllipsis: cellEllipsis, columns: columns, onCellClick: onCellClick, onRowClick: onRowClick, onCellDoubleClick: onCellDoubleClick }, i))), rows.length < 1 && empty] }), loading && renderLoading()] }));
};

export { Datagrid as default };
//# sourceMappingURL=datagrid.js.map
