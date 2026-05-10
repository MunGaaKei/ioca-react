import { jsx, jsxs } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
import { Cell, getCellStyle } from './cell.js';
import Resize from './resize.js';
import Sorter from './sorter.js';

function Row(props) {
    const { row, data, columns, cellEllipsis, onRowClick, onCellClick, onCellDoubleClick, } = props;
    const handleRowClick = useCallback(() => {
        onRowClick?.(data, row);
    }, [data, onRowClick, row]);
    return (jsx("div", { className: 'i-datagrid-row', onClick: handleRowClick, children: columns.map((col, i) => (jsx(Cell, { column: col, col: i, row: row, data: data, cellEllipsis: cellEllipsis, onCellClick: onCellClick, onCellDoubleClick: onCellDoubleClick }, i))) }));
}
function Header(props) {
    const { columns, resizable, cellEllipsis, sortBy, sortType, onWidthChange, onHeaderClick, } = props;
    const columnById = useMemo(() => {
        const map = new Map();
        columns.forEach((c) => map.set(c.id, c));
        return map;
    }, [columns]);
    const handleClick = useCallback((e) => {
        const el = e.target?.closest?.(".i-datagrid-cell[data-col]");
        const id = el?.dataset?.col;
        onHeaderClick?.(id ? columnById.get(id) : undefined, e);
    }, [columnById, onHeaderClick]);
    return (jsx("div", { className: 'i-datagrid-header i-datagrid-row', onClick: handleClick, children: columns.map((column, col) => {
            const { id, title, fixed, colSpan, sorter, justify, renderHeader, } = column;
            const style = getCellStyle({
                justify,
                row: 0,
                col,
                colSpan,
            });
            const order = sortBy === id ? sortType : "";
            return (jsxs("div", { "data-col": id, className: classNames("i-datagrid-cell", {
                    "i-datagrid-has-sorter": sorter,
                    "i-datagrid-cell-fixed": fixed,
                }), style: { ...style, insetBlockStart: 0 }, children: [renderHeader?.(column, col) ?? (jsx("div", { className: classNames("i-datagrid-cell-content", {
                            "i-datagrid-cell-content-ellipsis": cellEllipsis,
                        }), children: title || id })), sorter && jsx(Sorter, { type: order }), resizable && (jsx(Resize, { index: col, onWidthChange: onWidthChange }))] }, col));
        }) }));
}

export { Header, Row as default };
//# sourceMappingURL=row.js.map
