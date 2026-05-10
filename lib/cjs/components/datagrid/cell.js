'use strict';

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function getCellStyle({ justify, col, row, colSpan = 1, rowSpan = 1, }) {
    const style = {
        "--datagrid-justify": justify,
        gridArea: `${row + 1} / ${col + 1} / ${row + 1 + rowSpan} / ${col + 1 + colSpan}`,
        insetInline: `var(--datagrid-cell-inset-${col})`,
    };
    return style;
}
function Cell(props) {
    const { column, row, col, data, cellEllipsis, onCellClick, onCellDoubleClick, } = props;
    const { id, fixed, justify, rowSpan, render } = column;
    const style = react.useMemo(() => getCellStyle({ justify, col, row, rowSpan }), [col, fixed, justify, row, rowSpan]);
    const handleClick = react.useCallback((e) => onCellClick?.(data, column, row, col, e), [col, column, data, onCellClick, row]);
    const handleDoubleClick = react.useCallback((e) => onCellDoubleClick?.(data, column, row, col, e), [col, column, data, onCellDoubleClick, row]);
    return (jsxRuntime.jsx("div", { className: classNames__default("i-datagrid-cell", {
            [`i-datagrid-cell-fixed-${fixed}`]: fixed,
        }), "data-col": id, style: style, onClick: handleClick, onDoubleClick: handleDoubleClick, children: render?.(data[id], data, row, col) ?? (jsxRuntime.jsx("div", { className: classNames__default("i-datagrid-cell-content", {
                "i-datagrid-cell-content-ellipsis": cellEllipsis,
            }), children: data[id] })) }));
}

exports.Cell = Cell;
exports.getCellStyle = getCellStyle;
//# sourceMappingURL=cell.js.map
