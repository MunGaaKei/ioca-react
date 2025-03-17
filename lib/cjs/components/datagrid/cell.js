'use strict';

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

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
    const style = getCellStyle({ justify, fixed, col, row, rowSpan });
    return (jsxRuntime.jsx("div", { className: classNames__default.default("i-datagrid-cell", {
            [`i-datagrid-cell-fixed-${fixed}`]: fixed,
        }), "data-col": id, style: style, onClick: (e) => onCellClick?.(data, column, row, col, e), onDoubleClick: (e) => onCellDoubleClick?.(data, column, row, col, e), children: render?.(data[id], data, col) ?? (jsxRuntime.jsx("div", { className: classNames__default.default("i-datagrid-cell-content", {
                "i-datagrid-cell-content-ellipsis": cellEllipsis,
            }), children: data[id] })) }));
}

exports.Cell = Cell;
exports.getCellStyle = getCellStyle;
//# sourceMappingURL=cell.js.map
