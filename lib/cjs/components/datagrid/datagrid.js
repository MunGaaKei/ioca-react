'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ahooks = require('ahooks');
var classNames = require('classnames');
var react = require('react');
var utils = require('../../js/utils.js');
var loading = require('../loading/loading.js');
var index = require('../utils/empty/index.js');
var row = require('./row.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Datagrid = (props) => {
    const { data = [], columns = [], border, striped, header = true, resizable, cellPadding = ".5em", cellEllipsis, empty = jsxRuntime.jsx(index.default, {}), loading: loading$1, height = "unset", style, className, renderLoading = () => (jsxRuntime.jsx(loading.default, { size: '1.5em', className: 'color-3', absolute: true })), onCellClick, onRowClick, onCellDoubleClick, onHeaderClick, onSort, onScroll, onResize, } = props;
    const container = react.useRef(null);
    const state = ahooks.useReactive({
        rows: data,
        widths: columns.map((col) => col.width ?? "min-content"),
        sortBy: "",
        sortType: "",
    });
    const styles = react.useMemo(() => {
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
            const [sortBy, sortType] = utils.getNextSorter(state.sortBy, state.sortType, column.id);
            Object.assign(state, {
                sortBy,
                sortType,
            });
            onSort?.(sortBy, sortType);
        }
        onHeaderClick?.(column, e);
    };
    const rows = react.useMemo(() => {
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
    react.useEffect(() => {
        if (!container.current)
            return;
        const { current: div } = container;
        const tds = div.querySelector(".i-datagrid-row")?.children;
        if (!tds?.length)
            return;
        state.widths = Array.from(tds).map((node) => node.offsetWidth);
    }, [columns, resizable]);
    react.useEffect(() => {
        loading$1 && container.current?.scrollTo({ top: 0, left: 0 });
    }, [loading$1]);
    const mergedStyle = {
        "--cell-padding": cellPadding,
        ...styles,
    };
    return (jsxRuntime.jsxs("div", { style: { maxHeight: height, ...mergedStyle }, className: classNames__default("i-datagrid-container", className, {
            "i-datagrid-bordered": border,
            "i-datagrid-striped": striped,
        }), children: [jsxRuntime.jsxs("div", { ref: container, className: classNames__default("i-datagrid", {
                    "i-datagrid-loading": loading$1,
                }), onWheel: onScroll, children: [header && (jsxRuntime.jsx(row.Header, { columns: columns, resizable: resizable, sortType: state.sortType, sortBy: state.sortBy, cellEllipsis: cellEllipsis, onWidthChange: handleWidthChange, onHeaderClick: handleHeaderClick })), rows.map((row$1, i) => (jsxRuntime.jsx(row.default, { row: i + (header ? 1 : 0), data: row$1, cellEllipsis: cellEllipsis, columns: columns, onCellClick: onCellClick, onRowClick: onRowClick, onCellDoubleClick: onCellDoubleClick }, i))), rows.length < 1 && empty] }), loading$1 && renderLoading()] }));
};

exports.default = Datagrid;
//# sourceMappingURL=datagrid.js.map
