import classNames from "classnames";
import type { ReactNode } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore
import { List as VirtualList, getScrollbarSize } from "react-window";
import { useResizeObserver } from "../../js/hooks";
import Loading from "../loading";
import Resize from "./resize";
import Sorter from "./sorter";
import type { IColumn, IData, VirtualDatagridProps } from "./type";

// ---------------------------------------------------------------------------
// VirtualCell — memoized cell for virtual grid rows
// ---------------------------------------------------------------------------

type VirtualCellProps = {
	column: IColumn;
	data?: IData;
	row: number;
	col: number;
	isHeader?: boolean;
	cellEllipsis?: boolean;
	sortBy: string;
	sortType: string;
	resizable?: boolean;
	onWidthChange?: (i: number, w: number, phase?: "preview" | "commit") => void;
};

const VirtualCell = memo(function VirtualCell({
	column,
	data,
	row,
	col,
	isHeader,
	cellEllipsis,
	sortBy,
	sortType,
	resizable,
	onWidthChange,
}: VirtualCellProps) {
	const { id, fixed, justify, colSpan, render, title, sorter, renderHeader } =
		column;

	const style = useMemo(
		() =>
			({
				"--datagrid-justify": justify,
				gridColumn: `${col + 1} / span ${colSpan ?? 1}`,
				insetInline: `var(--datagrid-cell-inset-${col})`,
				...(isHeader ? { insetBlockStart: 0 } : null),
				position: !isHeader && !fixed ? ("static" as const) : undefined,
			}) as any,
		[col, colSpan, fixed, isHeader, justify],
	);

	const order = isHeader && sortBy === id ? sortType : "";

	return (
		<div
			data-col={id}
			className={classNames("i-datagrid-cell", {
				[`i-datagrid-cell-fixed-${fixed}`]: fixed,
				"i-datagrid-has-sorter": isHeader && sorter,
			})}
			style={style}
		>
			{isHeader
				? (renderHeader?.(column, col) ?? (
						<div
							className={classNames("i-datagrid-cell-content", {
								"i-datagrid-cell-content-ellipsis": cellEllipsis,
							})}
						>
							{title || id}
						</div>
					))
				: (render?.(data?.[id], data, row, col) ?? (
						<div
							className={classNames("i-datagrid-cell-content", {
								"i-datagrid-cell-content-ellipsis": cellEllipsis,
							})}
						>
							{data?.[id]}
						</div>
					))}

			{isHeader && sorter && <Sorter type={order} />}
			{isHeader && resizable && (
				<Resize index={col} onWidthChange={onWidthChange} />
			)}
		</div>
	);
});

// ---------------------------------------------------------------------------
// Row-level data carried through react-window's rowProps
// ---------------------------------------------------------------------------

type RowCustomProps = {
	rows: IData[];
	columns: IColumn[];
	columnById: Map<string, IColumn>;
	columnIndexById: Map<string, number>;
	contentWidthPx: string;
	virtualRowHeight: number;
	header: boolean;
	striped?: boolean;
	cellEllipsis?: boolean;
	loaderNode: ReactNode;
	sortBy: string;
	sortType: string;
	resizable?: boolean;
	onWidthChange?: (i: number, w: number, phase?: "preview" | "commit") => void;
	onRowClick?: (data?: IData, row?: number) => void;
	onCellClick?: VirtualDatagridProps["onCellClick"];
	onCellDoubleClick?: VirtualDatagridProps["onCellDoubleClick"];
};

// ---------------------------------------------------------------------------
// VirtualRow — memoised row rendered by react-window
// ---------------------------------------------------------------------------

const VirtualRow = memo(function VirtualRow({
	index,
	style: itemStyle,
	rows,
	columns,
	columnById,
	columnIndexById,
	contentWidthPx,
	virtualRowHeight,
	header,
	striped,
	cellEllipsis,
	loaderNode,
	sortBy,
	sortType,
	resizable,
	onWidthChange,
	onRowClick,
	onCellClick,
	onCellDoubleClick,
}: { index: number; style: any } & RowCustomProps) {
	if (index >= rows.length) {
		return (
			<div
				style={{
					...itemStyle,
					width: contentWidthPx,
					minWidth: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{loaderNode}
			</div>
		);
	}

	const rowData = rows[index];
	const rowNum = index + (header ? 1 : 0);
	const bg =
		striped && index % 2 === 0 ? "var(--background-1)" : undefined;

	const handleCellClick = useCallback(
		(e: any) => {
			if (!onCellClick) return;
			const el = (e.target as HTMLElement | null)?.closest?.(
				".i-datagrid-cell[data-col]",
			) as HTMLElement | null;
			const id = el?.dataset?.col;
			if (!id) return;
			const column = columnById.get(id);
			const col = columnIndexById.get(id);
			if (!column || col == null) return;
			onCellClick(rowData, column, rowNum, col, e);
		},
		[columnById, columnIndexById, onCellClick, rowData, rowNum],
	);

	const handleCellDoubleClick = useCallback(
		(e: any) => {
			if (!onCellDoubleClick) return;
			const el = (e.target as HTMLElement | null)?.closest?.(
				".i-datagrid-cell[data-col]",
			) as HTMLElement | null;
			const id = el?.dataset?.col;
			if (!id) return;
			const column = columnById.get(id);
			const col = columnIndexById.get(id);
			if (!column || col == null) return;
			onCellDoubleClick(rowData, column, rowNum, col, e);
		},
		[columnById, columnIndexById, onCellDoubleClick, rowData, rowNum],
	);

	const handleRowClick = useCallback(
		() => onRowClick?.(rowData, rowNum),
		[onRowClick, rowData, rowNum],
	);

	return (
		<div
			style={{
				...itemStyle,
				width: contentWidthPx,
				minWidth: "100%",
				display: "grid",
				gridTemplateColumns: "var(--grid-template-columns)",
				height: virtualRowHeight,
				"--datagrid-cell-background": bg,
			}}
			className='i-datagrid-row'
			onClick={handleRowClick}
			onClickCapture={handleCellClick}
			onDoubleClickCapture={handleCellDoubleClick}
		>
			{columns.map((c, col) => (
				<VirtualCell
					key={c.id}
					column={c}
					data={rowData}
					row={rowNum}
					col={col}
					cellEllipsis={cellEllipsis}
					sortBy={sortBy}
					sortType={sortType}
					resizable={resizable}
					onWidthChange={onWidthChange}
				/>
			))}
		</div>
	);
});

// ---------------------------------------------------------------------------
// VirtualDatagrid
// ---------------------------------------------------------------------------

export default function VirtualDatagrid(props: VirtualDatagridProps) {
	const {
		virtual,
		columns,
		rows,
		header,
		sortBy,
		sortType,
		height,
		loading,
		resizable,
		striped,
		cellEllipsis,
		empty,
		wrapRef,
		containerRef,
		onHeaderClick,
		onWidthChange,
		onRowClick,
		onCellClick,
		onCellDoubleClick,
		onScroll,
	} = props;

	const headerRef = useRef<HTMLDivElement>(null);
	const headerInnerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<any>(null);
	const ro = useResizeObserver();
	const triggerRef = useRef({ rowCount: -1 });
	const [viewport, setViewport] = useState({ width: 0, height: 0 });
	const [contentWidth, setContentWidth] = useState(0);
	const rafRef = useRef({
		viewport: 0 as number | 0,
		contentWidth: 0 as number | 0,
		scrollSync: 0 as number | 0,
	});

	const columnById = useMemo(() => {
		const map = new Map<string, IColumn>();
		columns.forEach((c) => map.set(c.id, c));
		return map;
	}, [columns]);

	const columnIndexById = useMemo(() => {
		const map = new Map<string, number>();
		columns.forEach((c, i) => map.set(c.id, i));
		return map;
	}, [columns]);

	const handleHeaderClick = useCallback(
		(e: any) => {
			const el = (e.target as HTMLElement | null)?.closest?.(
				".i-datagrid-cell[data-col]",
			) as HTMLElement | null;
			const id = el?.dataset?.col;
			onHeaderClick(id ? columnById.get(id) : undefined, e);
		},
		[columnById, onHeaderClick],
	);

	const handleBodyScroll = useCallback((e: any) => {
		const el = e.currentTarget as HTMLDivElement | null;
		if (!el) return;

		if (rafRef.current.scrollSync) return;
		rafRef.current.scrollSync = requestAnimationFrame(() => {
			rafRef.current.scrollSync = 0;
			if (!headerRef.current) return;
			const target = el.scrollLeft;
			if (headerRef.current.scrollLeft !== target) {
				headerRef.current.scrollLeft = target;
			}
		});
	}, []);

	const handleReachEnd = useCallback(() => {
		if (virtual.onReachEnd) {
			virtual.onReachEnd();
			return;
		}
		onScroll?.(undefined as any);
	}, [onScroll, virtual.onReachEnd]);

	const handleRowsRendered = useCallback(
		(_visible: any, overscan: any) => {
			if (!virtual.hasMore) return;
			const threshold = virtual.threshold ?? 8;
			const stopIndex = overscan?.stopIndex ?? -1;
			if (stopIndex < rows.length - 1 - threshold) return;
			if (triggerRef.current.rowCount === rows.length) return;
			triggerRef.current.rowCount = rows.length;
			handleReachEnd();
		},
		[handleReachEnd, rows.length, virtual.hasMore, virtual.threshold],
	);

	const handleHeaderScroll = useCallback((e: any) => {
		const el = e.currentTarget as HTMLDivElement | null;
		if (!el) return;
		const listEl = listRef.current?.element as HTMLDivElement | null;
		if (listEl && listEl.scrollLeft !== el.scrollLeft) {
			listEl.scrollLeft = el.scrollLeft;
		}
	}, []);

	useEffect(() => {
		const el = wrapRef.current;
		if (!el) return;

		const update = () => {
			if (rafRef.current.viewport)
				cancelAnimationFrame(rafRef.current.viewport);
			rafRef.current.viewport = requestAnimationFrame(() => {
				rafRef.current.viewport = 0;
				const r = el.getBoundingClientRect();
				const w = Math.round(r.width);
				const h = Math.round(r.height);
				setViewport((prev) => {
					if (prev.width === w && prev.height === h) return prev;
					return { width: w, height: h };
				});
			});
		};

		update();
		ro.observe?.(el, update);
		return () => {
			ro.unobserve?.(el);
			if (rafRef.current.viewport)
				cancelAnimationFrame(rafRef.current.viewport);
			rafRef.current.viewport = 0;
		};
	}, [ro, wrapRef]);

	useEffect(() => {
		const el = headerInnerRef.current;
		if (!el) return;

		const update = () => {
			if (rafRef.current.contentWidth) {
				cancelAnimationFrame(rafRef.current.contentWidth);
			}
			rafRef.current.contentWidth = requestAnimationFrame(() => {
				rafRef.current.contentWidth = 0;
				const w = Math.ceil(el.scrollWidth);
				setContentWidth((prev) => (prev === w ? prev : w));
			});
		};

		update();
		ro.observe?.(el, update);
		return () => {
			ro.unobserve?.(el);
			if (rafRef.current.contentWidth) {
				cancelAnimationFrame(rafRef.current.contentWidth);
			}
			rafRef.current.contentWidth = 0;
		};
	}, [ro]);

	useEffect(() => {
		triggerRef.current.rowCount = -1;
	}, [rows.length, virtual.hasMore]);

	useEffect(() => {
		if (!loading) return;
		const listEl = listRef.current?.element as HTMLDivElement | null;
		listEl?.scrollTo({ top: 0, left: 0 });
		headerRef.current?.scrollTo({ top: 0, left: 0 });
	}, [loading]);

	const listHeight = Math.max(
		0,
		(typeof height === "number" ? height : viewport.height || 360) -
			(header ? virtual.rowHeight : 0),
	);
	const hasVerticalScrollbar =
		rows.length * virtual.rowHeight > listHeight + 1;
	const scrollbarSize = hasVerticalScrollbar ? getScrollbarSize() : 0;
	const measuredContentWidth = Math.max(contentWidth, viewport.width || 0);
	const contentWidthPx = measuredContentWidth
		? `${measuredContentWidth}px`
		: "fit-content";

	const headerCells = useMemo(
		() =>
			columns.map((c, col) => (
				<VirtualCell
					key={c.id}
					column={c}
					row={0}
					col={col}
					isHeader
					cellEllipsis={cellEllipsis}
					sortBy={sortBy}
					sortType={sortType}
					resizable={resizable}
					onWidthChange={onWidthChange}
				/>
			)),
		[
			cellEllipsis,
			columns,
			onWidthChange,
			resizable,
			sortBy,
			sortType,
		],
	);

	const headerInnerStyle = useMemo(
		() => ({
			display: "grid",
			gridTemplateColumns: "var(--grid-template-columns)",
			height: virtual.rowHeight,
			width: contentWidthPx,
			minWidth: "100%",
		}),
		[contentWidthPx, virtual.rowHeight],
	);

	const listStyle = useMemo(
		() => ({
			height: listHeight,
			width: "100%",
			overflow: "auto",
		}),
		[listHeight],
	);

	const headerWrapStyle = useMemo(
		() =>
			scrollbarSize > 0
				? {
						paddingRight: scrollbarSize,
						boxSizing: "content-box" as const,
					}
				: undefined,
		[scrollbarSize],
	);

	const loaderNode = useMemo<ReactNode>(
		() => virtual.loader ?? <Loading className='my-12' />,
		[virtual.loader],
	);

	// Stable row-component reference so react-window can memoise rows.
	const rowProps = useMemo<RowCustomProps>(
		() => ({
			rows,
			columns,
			columnById,
			columnIndexById,
			contentWidthPx,
			virtualRowHeight: virtual.rowHeight,
			header,
			striped,
			cellEllipsis,
			loaderNode,
			sortBy,
			sortType,
			resizable,
			onWidthChange,
			onRowClick,
			onCellClick,
			onCellDoubleClick,
		}),
		[
			rows,
			columns,
			columnById,
			columnIndexById,
			contentWidthPx,
			virtual.rowHeight,
			header,
			striped,
			cellEllipsis,
			loaderNode,
			sortBy,
			sortType,
			resizable,
			onWidthChange,
			onRowClick,
			onCellClick,
			onCellDoubleClick,
		],
	);

	return (
		<div
			ref={containerRef}
			className={classNames("i-datagrid", {
				"i-datagrid-loading": loading,
			})}
			style={{ display: "block", width: "100%", maxWidth: "100%" }}
		>
			{header && (
				<div
					ref={headerRef}
					className='i-datagrid-virtual-header'
					onScroll={handleHeaderScroll}
					style={headerWrapStyle}
				>
					<div
						ref={headerInnerRef}
						className='i-datagrid-header i-datagrid-row'
						style={headerInnerStyle}
						onClick={handleHeaderClick}
					>
						{headerCells}
					</div>
				</div>
			)}

			<VirtualList
				listRef={listRef}
				rowCount={rows.length + (virtual.hasMore ? 1 : 0)}
				rowHeight={virtual.rowHeight}
				overscanCount={Math.max(3, virtual.threshold ?? 8)}
				rowProps={rowProps as any}
				style={listStyle}
				onScroll={handleBodyScroll}
				onRowsRendered={handleRowsRendered}
				rowComponent={VirtualRow}
			/>
			{rows.length < 1 && !virtual.hasMore && empty}
		</div>
	);
}
