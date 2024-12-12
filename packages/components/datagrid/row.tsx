import classNames from "classnames";
import { Cell, getCellStyle } from "./cell";
import Resize from "./resize";
import Sorter from "./sorter";
import { IHeader, IRow } from "./type";

export default function Row(props: IRow) {
	const {
		row,
		data,
		columns,
		cellEllipsis,
		onRowClick,
		onCellClick,
		onCellDoubleClick,
	} = props;

	return (
		<div className='i-datagrid-row' onClick={() => onRowClick?.(data, row)}>
			{columns.map((col, i) => (
				<Cell
					key={i}
					column={col}
					col={i}
					row={row}
					data={data}
					cellEllipsis={cellEllipsis}
					onCellClick={onCellClick}
					onCellDoubleClick={onCellDoubleClick}
				/>
			))}
		</div>
	);
}

export function Header(props: IHeader) {
	const {
		columns,
		resizable,
		cellEllipsis,
		sortBy,
		sortType,
		onWidthChange,
		onHeaderClick,
	} = props;

	return (
		<div className='i-datagrid-header i-datagrid-row'>
			{columns.map((column, col) => {
				const {
					id,
					title,
					fixed,
					colSpan,
					sorter,
					justify,
					renderHeader,
				} = column;
				const style = getCellStyle({
					justify,
					row: 0,
					col,
					colSpan,
				});

				const order = sortBy === id ? sortType : "";

				return (
					<div
						key={col}
						data-col={id}
						className={classNames("i-datagrid-cell", {
							"i-datagrid-has-sorter": sorter,
							"i-datagrid-cell-fixed": fixed,
						})}
						style={{ ...style, insetBlockStart: 0 }}
						onClick={(e) => onHeaderClick?.(column, e)}
					>
						{renderHeader?.(column, col) ?? (
							<div
								className={classNames(
									"i-datagrid-cell-content",
									{
										"i-datagrid-cell-content-ellipsis":
											cellEllipsis,
									}
								)}
							>
								{title || id}
							</div>
						)}

						{sorter && <Sorter type={order} />}

						{resizable && (
							<Resize index={col} onWidthChange={onWidthChange} />
						)}
					</div>
				);
			})}
		</div>
	);
}
