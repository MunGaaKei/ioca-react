import classNames from "classnames";
import { ICell, IColumn } from "./type";

export function getCellStyle({
	justify,
	col,
	row,
	colSpan = 1,
	rowSpan = 1,
}: Pick<IColumn, "justify" | "fixed"> & {
	col: number;
	row: number;
	colSpan?: number;
	rowSpan?: number;
	isHeader?: boolean;
}) {
	const style = {
		"--datagrid-justify": justify,
		gridArea: `${row + 1} / ${col + 1} / ${row + 1 + rowSpan} / ${
			col + 1 + colSpan
		}`,
		insetInline: `var(--datagrid-cell-inset-${col})`,
	};

	return style;
}

export function Cell(props: ICell) {
	const {
		column,
		row,
		col,
		data,
		cellEllipsis,
		onCellClick,
		onCellDoubleClick,
	} = props;
	const { id, fixed, justify, rowSpan, render } = column;
	const style = getCellStyle({ justify, fixed, col, row, rowSpan });

	return (
		<div
			className={classNames("i-datagrid-cell", {
				[`i-datagrid-cell-fixed-${fixed}`]: fixed,
			})}
			data-col={id}
			style={style}
			onClick={(e) => onCellClick?.(data, column, row, col, e)}
			onDoubleClick={(e) =>
				onCellDoubleClick?.(data, column, row, col, e)
			}
		>
			{render?.(data[id], data, row, col) ?? (
				<div
					className={classNames("i-datagrid-cell-content", {
						"i-datagrid-cell-content-ellipsis": cellEllipsis,
					})}
				>
					{data[id]}
				</div>
			)}
		</div>
	);
}
