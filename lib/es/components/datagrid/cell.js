import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useMemo, useCallback } from 'react';

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
    const style = useMemo(() => getCellStyle({ justify, col, row, rowSpan }), [col, fixed, justify, row, rowSpan]);
    const handleClick = useCallback((e) => onCellClick?.(data, column, row, col, e), [col, column, data, onCellClick, row]);
    const handleDoubleClick = useCallback((e) => onCellDoubleClick?.(data, column, row, col, e), [col, column, data, onCellDoubleClick, row]);
    return (jsx("div", { className: classNames("i-datagrid-cell", {
            [`i-datagrid-cell-fixed-${fixed}`]: fixed,
        }), "data-col": id, style: style, onClick: handleClick, onDoubleClick: handleDoubleClick, children: render?.(data[id], data, row, col) ?? (jsx("div", { className: classNames("i-datagrid-cell-content", {
                "i-datagrid-cell-content-ellipsis": cellEllipsis,
            }), children: data[id] })) }));
}

export { Cell, getCellStyle };
//# sourceMappingURL=cell.js.map
