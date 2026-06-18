import { CSSProperties, Key, MouseEvent, ReactNode, RefObject } from "react";

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
    width?: string | number;
    fixed?: "left" | "right";
    render?: (value?: any, data?: IData, row?: number, col?: number) => ReactNode;
    renderHeader?: (column?: IColumn, col?: number) => ReactNode;
}

export interface IDatagrid {
    data: IData[];
    columns?: IColumn[];
    rowKey?: string | ((row: IData, index: number) => Key);
    border?: boolean;
    striped?: boolean;
    header?: boolean;
    resizable?: boolean;
    loading?: boolean;
    empty?: ReactNode;
    cellPadding?: string | number;
    cellEllipsis?: boolean;
    height?: number | string;
    style?: CSSProperties;
    className?: string;
    virtual?: {
        rowHeight: number;
        hasMore?: boolean;
        threshold?: number;
        pageSize?: number;
        loader?: ReactNode;
        onReachEnd?: () => void;
    };
    renderLoading?: () => ReactNode;
    onRowClick?: (data?: IData, row?: number) => void;
    onCellClick?: (data?: IData, column?: IColumn, row?: number, col?: number, e?: MouseEvent) => void;
    onCellDoubleClick?: (data?: IData, column?: IColumn, row?: number, col?: number, e?: MouseEvent) => void;
    onHeaderClick?: (column?: IColumn, e?: MouseEvent) => void;
    onSort?: (sortBy: string, sortType: string) => void;
    onScroll?: (e: MouseEvent) => void;
    onResize?: (column?: IColumn, width?: number) => void;
}

export type TVirtual = NonNullable<IDatagrid["virtual"]>;

export type VirtualDatagridProps = Pick<IDatagrid, "cellEllipsis" | "height" | "loading" | "resizable" | "striped" | "onCellClick" | "onCellDoubleClick" | "onRowClick" | "onScroll"> & {
    virtual: TVirtual;
    columns: IColumn[];
    rows: IData[];
    header: boolean;
    sortBy: string;
    sortType: string;
    empty: ReactNode;
    wrapRef: RefObject<HTMLDivElement | null>;
    containerRef: RefObject<HTMLDivElement | null>;
    getRowKey: (row: IData, index: number) => Key;
    onHeaderClick: (column?: IColumn, e?: any) => void;
    onWidthChange: (i: number, w: number, phase?: "preview" | "commit") => void;
};

export interface IRow extends Pick<IDatagrid, "cellEllipsis" | "onCellClick" | "onCellDoubleClick" | "onRowClick" | "onHeaderClick"> {
    data: IData;
    columns: IColumn[];
    row: number;
}

export interface ICell extends Pick<IDatagrid, "cellEllipsis" | "onCellClick" | "onCellDoubleClick"> {
    column: IColumn;
    data: IData;
    row: number;
    col: number;
}

export interface IHeader extends Omit<IRow, "data" | "row">, TSort {
    resizable?: boolean;
    onWidthChange: (i: number, width: number, phase?: "preview" | "commit") => void;
}

export type TDatagridState = {
    rows: IData[];
    widths: (number | string)[];
} & TSort;
