'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var cell = require('./cell.js');
var resize = require('./resize.js');
var sorter = require('./sorter.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

function Row(props) {
    const { row, data, columns, cellEllipsis, onRowClick, onCellClick, onCellDoubleClick, } = props;
    return (jsxRuntime.jsx("div", { className: 'i-datagrid-row', onClick: () => onRowClick?.(data, row), children: columns.map((col, i) => (jsxRuntime.jsx(cell.Cell, { column: col, col: i, row: row, data: data, cellEllipsis: cellEllipsis, onCellClick: onCellClick, onCellDoubleClick: onCellDoubleClick }, i))) }));
}
function Header(props) {
    const { columns, resizable, cellEllipsis, sortBy, sortType, onWidthChange, onHeaderClick, } = props;
    return (jsxRuntime.jsx("div", { className: 'i-datagrid-header i-datagrid-row', children: columns.map((column, col) => {
            const { id, title, fixed, colSpan, sorter: sorter$1, justify, renderHeader, } = column;
            const style = cell.getCellStyle({
                justify,
                row: 0,
                col,
                colSpan,
            });
            const order = sortBy === id ? sortType : "";
            return (jsxRuntime.jsxs("div", { "data-col": id, className: classNames__default.default("i-datagrid-cell", {
                    "i-datagrid-has-sorter": sorter$1,
                    "i-datagrid-cell-fixed": fixed,
                }), style: { ...style, insetBlockStart: 0 }, onClick: (e) => onHeaderClick?.(column, e), children: [renderHeader?.(column, col) ?? (jsxRuntime.jsx("div", { className: classNames__default.default("i-datagrid-cell-content", {
                            "i-datagrid-cell-content-ellipsis": cellEllipsis,
                        }), children: title || id })), sorter$1 && jsxRuntime.jsx(sorter.default, { type: order }), resizable && (jsxRuntime.jsx(resize.default, { index: col, onWidthChange: onWidthChange }))] }, col));
        }) }));
}

exports.Header = Header;
exports.default = Row;
//# sourceMappingURL=row.js.map
