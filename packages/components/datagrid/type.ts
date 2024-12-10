import { CSSProperties, MouseEvent, ReactNode } from "react";

export type IData = Record<string, any>;

type TSort = {
	sortBy: string;
	sortType: string;
};

export interface IColumn {
	id: string;
	title?: ReactNode;
	sorter?: boolean;
	justify?: string;
	rowSpan?: number;
	colSpan?: number;
	width?: string;
	fixed?: "left" | "right";
	render?: (value?: any, data?: IData, index?: number) => ReactNode;
	renderHeader?: (column?: IColumn, index?: number) => ReactNode;
}

export interface IDatagrid {
	data: IData[];
	columns?: IColumn[];
	border?: boolean;
	striped?: boolean;
	header?: boolean;
	resizable?: boolean;
	loading?: boolean;
	empty?: ReactNode;
	cellPadding?: string | number;
	height?: number | string;
	style?: CSSProperties;
	className?: string;
	renderLoading?: () => ReactNode;
	onRowClick?: (data?: IData, row?: number) => void;
	onCellClick?: (
		data?: IData,
		column?: IColumn,
		row?: number,
		col?: number,
		e?: MouseEvent
	) => void;
	onCellDoubleClick?: (
		data?: IData,
		column?: IColumn,
		row?: number,
		col?: number,
		e?: MouseEvent
	) => void;
	onHeaderClick?: (column?: IColumn, e?: MouseEvent) => void;
	onSort?: (sortBy: string, sortType: string) => void;
	onScroll?: (e: MouseEvent) => void;
	onResize?: (column?: IColumn, width?: number) => void;
}

export interface IRow
	extends Pick<
		IDatagrid,
		"onCellClick" | "onCellDoubleClick" | "onRowClick" | "onHeaderClick"
	> {
	data: IData;
	columns: IColumn[];
	row: number;
}

export interface ICell
	extends Pick<IDatagrid, "onCellClick" | "onCellDoubleClick"> {
	column: IColumn;
	data: IData;
	row: number;
	col: number;
}

export interface IHeader extends Omit<IRow, "data" | "row">, TSort {
	resizable?: boolean;
	onWidthChange: (i: number, width: number) => void;
}

export type TDatagridState = {
	rows: IData[];
	widths: (number | string)[];
} & TSort;
