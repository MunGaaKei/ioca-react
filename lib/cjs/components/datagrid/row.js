'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var cell = require('./cell.js');
var resize = require('./resize.js');
var sorter = require('./sorter.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function Row(props) {
    const { row, data, columns, cellEllipsis, onRowClick, onCellClick, onCellDoubleClick, } = props;
    const handleRowClick = react.useCallback(() => {
        onRowClick?.(data, row);
    }, [data, onRowClick, row]);
    return (jsxRuntime.jsx("div", { className: 'i-datagrid-row', onClick: handleRowClick, children: columns.map((col, i) => (jsxRuntime.jsx(cell.Cell, { column: col, col: i, row: row, data: data, cellEllipsis: cellEllipsis, onCellClick: onCellClick, onCellDoubleClick: onCellDoubleClick }, i))) }));
}
function Header(props) {
    const { columns, resizable, cellEllipsis, sortBy, sortType, onWidthChange, onHeaderClick, } = props;
    const columnById = react.useMemo(() => {
        const map = new Map();
        columns.forEach((c) => map.set(c.id, c));
        return map;
    }, [columns]);
    const handleClick = react.useCallback((e) => {
        const el = e.target?.closest?.(".i-datagrid-cell[data-col]");
        const id = el?.dataset?.col;
        onHeaderClick?.(id ? columnById.get(id) : undefined, e);
    }, [columnById, onHeaderClick]);
    return (jsxRuntime.jsx("div", { className: 'i-datagrid-header i-datagrid-row', onClick: handleClick, children: columns.map((column, col) => {
            const { id, title, fixed, colSpan, sorter: sorter$1, justify, renderHeader, } = column;
            const style = cell.getCellStyle({
                justify,
                row: 0,
                col,
                colSpan,
            });
            const order = sortBy === id ? sortType : "";
            return (jsxRuntime.jsxs("div", { "data-col": id, className: classNames__default("i-datagrid-cell", {
                    "i-datagrid-has-sorter": sorter$1,
                    "i-datagrid-cell-fixed": fixed,
                }), style: { ...style, insetBlockStart: 0 }, children: [renderHeader?.(column, col) ?? (jsxRuntime.jsx("div", { className: classNames__default("i-datagrid-cell-content", {
                            "i-datagrid-cell-content-ellipsis": cellEllipsis,
                        }), children: title || id })), sorter$1 && jsxRuntime.jsx(sorter.default, { type: order }), resizable && (jsxRuntime.jsx(resize.default, { index: col, onWidthChange: onWidthChange }))] }, col));
        }) }));
}

exports.Header = Header;
exports.default = Row;
//# sourceMappingURL=row.js.map
