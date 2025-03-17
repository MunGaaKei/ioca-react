import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';

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
    return (jsx("div", { className: classNames("i-datagrid-cell", {
            [`i-datagrid-cell-fixed-${fixed}`]: fixed,
        }), "data-col": id, style: style, onClick: (e) => onCellClick?.(data, column, row, col, e), onDoubleClick: (e) => onCellDoubleClick?.(data, column, row, col, e), children: render?.(data[id], data, col) ?? (jsx("div", { className: classNames("i-datagrid-cell-content", {
                "i-datagrid-cell-content-ellipsis": cellEllipsis,
            }), children: data[id] })) }));
}

export { Cell, getCellStyle };
//# sourceMappingURL=cell.js.map
