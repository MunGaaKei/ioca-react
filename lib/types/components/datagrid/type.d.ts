import { ReactNode, Key, CSSProperties, MouseEvent } from 'react';

type IData = Record<string, any>;
interface IColumn {
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
interface IDatagrid {
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
    rowHeight?: number;
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

export type { IColumn, IData, IDatagrid };
