import { jsx, jsxs } from 'react/jsx-runtime';
import classNames from 'classnames';
import { Cell, getCellStyle } from './cell.js';
import Resize from './resize.js';
import Sorter from './sorter.js';

function Row(props) {
    const { row, data, columns, cellEllipsis, onRowClick, onCellClick, onCellDoubleClick, } = props;
    return (jsx("div", { className: 'i-datagrid-row', onClick: () => onRowClick?.(data, row), children: columns.map((col, i) => (jsx(Cell, { column: col, col: i, row: row, data: data, cellEllipsis: cellEllipsis, onCellClick: onCellClick, onCellDoubleClick: onCellDoubleClick }, i))) }));
}
function Header(props) {
    const { columns, resizable, cellEllipsis, sortBy, sortType, onWidthChange, onHeaderClick, } = props;
    return (jsx("div", { className: 'i-datagrid-header i-datagrid-row', children: columns.map((column, col) => {
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
                }), style: { ...style, insetBlockStart: 0 }, onClick: (e) => onHeaderClick?.(column, e), children: [renderHeader?.(column, col) ?? (jsx("div", { className: classNames("i-datagrid-cell-content", {
                            "i-datagrid-cell-content-ellipsis": cellEllipsis,
                        }), children: title || id })), sorter && jsx(Sorter, { type: order }), resizable && (jsx(Resize, { index: col, onWidthChange: onWidthChange }))] }, col));
        }) }));
}

export { Header, Row as default };
//# sourceMappingURL=row.js.map
