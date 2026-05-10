import classNames from "classnames";
import {
	CSSProperties,
	Key,
	MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { useReactive } from "../../js/hooks";
import { getNextSorter } from "../../js/utils";
import Loading from "../loading";
import Empty from "../utils/empty";
import {
	applyFixedInsets,
	buildCssWidths,
	buildGridTemplateColumns,
} from "./helper";
import "./index.css";
import Row, { Header } from "./row";
import type { IColumn, IData, IDatagrid, TDatagridState } from "./type";
import VirtualDatagrid from "./virtual";

const Datagrid = (props: IDatagrid) => {
	const {
		data = [],
		columns = [],
		border,
		striped,
		header = true,
		resizable,
		cellPadding = ".5em",
		cellEllipsis,
		empty = <Empty />,
		loading,
		height = "unset",
		style,
		className,
		rowKey,
		virtual,
		renderLoading = () => (
			<Loading size='1.5em' className='color-3' absolute />
		),
		onCellClick,
		onRowClick,
		onCellDoubleClick,
		onHeaderClick,
		onSort,
		onScroll,
		onResize,
	} = props;

	const container = useRef<HTMLDivElement>(null);
	const wrapRef = useRef<HTMLDivElement>(null);

	const state = useReactive<TDatagridState>({
		rows: data,
		widths: columns.map((col) => col.width ?? "min-content"),
		sortBy: "",
		sortType: "",
	});
	const previewRef = useRef({ index: -1, width: -1, template: "" });

	useEffect(() => {
		const next = columns.map((col, i) => {
			if (col.width != null) return col.width;
			return state.widths[i] ?? "min-content";
		});

		let changed = next.length !== state.widths.length;
		if (!changed) {
			for (let i = 0; i < next.length; i++) {
				if (next[i] !== state.widths[i]) {
					changed = true;
					break;
				}
			}
		}

		if (changed) state.widths = next;
	}, [columns, state]);

	const styles = useMemo(() => {
		const { widths } = state;

		const o = {
			...style,
			"--grid-template-columns": buildGridTemplateColumns(widths),
		};

		if (!resizable) return o;

		const cssWidths = buildCssWidths(widths);
		applyFixedInsets(
			(k, v) => {
				(o as any)[k] = v;
			},
			columns,
			cssWidths,
		);

		return o;
	}, [columns, resizable, state.widths, style]);

	const handleWidthChange = useCallback(
		(i: number, w: number, phase: "preview" | "commit" = "commit") => {
			if (!resizable) return;
			if (phase === "preview") {
				const el = wrapRef.current;
				if (!el) return;
				if (
					previewRef.current.index === i &&
					previewRef.current.width === w
				) {
					return;
				}

				const template = buildGridTemplateColumns(state.widths, i, w);
				if (previewRef.current.template !== template) {
					el.style.setProperty("--grid-template-columns", template);
					const cssWidths = buildCssWidths(state.widths, i, w);
					applyFixedInsets(
						(k, v) => el.style.setProperty(k, v),
						columns,
						cssWidths,
					);
					previewRef.current.template = template;
				}
				previewRef.current.index = i;
				previewRef.current.width = w;
				return;
			}

			previewRef.current.index = -1;
			previewRef.current.width = -1;
			previewRef.current.template = "";

			if (state.widths[i] === w) return;

			const next = [...state.widths];
			next[i] = w;
			state.widths = next;
			onResize?.(columns[i], w);
		},
		[columns, onResize, resizable, state, wrapRef],
	);

	const handleHeaderClick = useCallback(
		(column?: IColumn, e?: MouseEvent) => {
			if (column?.sorter) {
				const [sortBy, sortType] = getNextSorter(
					state.sortBy,
					state.sortType,
					column.id,
				);

				Object.assign(state, {
					sortBy,
					sortType,
				});

				onSort?.(sortBy, sortType);
			}

			onHeaderClick?.(column, e);
		},
		[onHeaderClick, onSort, state],
	);

	const rows = useMemo(() => {
		const { sortBy, sortType } = state;

		if (sortBy && !onSort) {
			const sorter = columns.find((col) => col.id === sortBy)?.sorter;
			const sortFn =
				typeof sorter === "function"
					? sorter
					: (a: IData, b: IData) => b[sortBy] - a[sortBy];
			const sorted = [...data].sort(sortFn);

			return sortType === "desc" ? sorted : sorted.reverse();
		}

		return data;
	}, [data, columns, state.sortBy, state.sortType]);

	const useVirtual = useMemo(() => {
		if (!virtual) return false;
		const rowHeight = virtual.rowHeight;
		return !!rowHeight && rowHeight > 0;
	}, [virtual]);

	useEffect(() => {
		if (!resizable) return;
		if (!container.current) return;
		if (
			!columns.some(
				(col, i) =>
					col.width == null && typeof state.widths[i] !== "number",
			)
		) {
			return;
		}

		let rafId: number | null = null;
		let tries = 0;

		const run = () => {
			rafId = null;
			const div = container.current;
			if (!div) return;

			const headerRow = div.querySelector(
				".i-datagrid-header.i-datagrid-row",
			) as HTMLElement | null;
			const bodyRow = div.querySelector(
				".i-datagrid-row:not(.i-datagrid-header)",
			) as HTMLElement | null;

			const headerCells = headerRow ? Array.from(headerRow.children) : [];
			const bodyCells = bodyRow ? Array.from(bodyRow.children) : [];

			const cellCount = Math.max(headerCells.length, bodyCells.length);
			if (cellCount < 1) {
				tries++;
				if (tries < 10) rafId = requestAnimationFrame(run);
				return;
			}

			const measured = new Array<number | null>(cellCount).fill(null);
			for (let i = 0; i < cellCount; i++) {
				const hw = (headerCells[i] as HTMLElement | undefined)
					?.offsetWidth;
				const bw = (bodyCells[i] as HTMLElement | undefined)
					?.offsetWidth;
				const w = Math.max(hw ?? 0, bw ?? 0);
				measured[i] = w > 0 ? w : null;
			}

			const next = columns.map((col, i) => {
				if (col.width != null) return col.width;
				const cur = state.widths[i];
				if (typeof cur === "number") return cur;
				return measured[i] ?? cur ?? "min-content";
			});

			let changed = next.length !== state.widths.length;
			if (!changed) {
				for (let i = 0; i < next.length; i++) {
					if (next[i] !== state.widths[i]) {
						changed = true;
						break;
					}
				}
			}
			if (changed) state.widths = next;
		};

		rafId = requestAnimationFrame(run);
		return () => {
			if (rafId != null) cancelAnimationFrame(rafId);
		};
	}, [columns, resizable, state, useVirtual]);

	useEffect(() => {
		if (!loading) return;
		if (useVirtual) return;
		container.current?.scrollTo({ top: 0, left: 0 });
	}, [loading, useVirtual]);

	const mergedStyle = useMemo(
		() =>
			({
				"--cell-padding": cellPadding,
				...styles,
			}) as CSSProperties,
		[cellPadding, styles],
	);

	const getRowKey = useMemo(() => {
		if (typeof rowKey === "function") return rowKey;
		if (typeof rowKey === "string") {
			return (row: IData) => row?.[rowKey] as Key;
		}

		return (_row: IData, index: number) => index as Key;
	}, [rowKey]);

	return (
		<div
			ref={wrapRef}
			style={{
				maxHeight: height,
				...(useVirtual
					? { overflowX: "visible", overflowY: "hidden" }
					: null),
				...mergedStyle,
			}}
			className={classNames("i-datagrid-container", className, {
				"i-datagrid-bordered": border,
				"i-datagrid-striped": striped,
			})}
		>
			{useVirtual && virtual ? (
				<VirtualDatagrid
					virtual={virtual}
					columns={columns}
					rows={rows}
					header={header}
					sortBy={state.sortBy}
					sortType={state.sortType}
					height={height}
					loading={loading}
					resizable={resizable}
					striped={striped}
					cellEllipsis={cellEllipsis}
					empty={empty}
					wrapRef={wrapRef}
					containerRef={container}
					getRowKey={getRowKey}
					onHeaderClick={handleHeaderClick}
					onWidthChange={handleWidthChange}
					onRowClick={onRowClick}
					onCellClick={onCellClick}
					onCellDoubleClick={onCellDoubleClick}
					onScroll={onScroll}
				/>
			) : (
				<div
					ref={container}
					className={classNames("i-datagrid", {
						"i-datagrid-loading": loading,
					})}
					onWheel={onScroll}
				>
					{header && (
						<Header
							columns={columns}
							resizable={resizable}
							sortType={state.sortType}
							sortBy={state.sortBy}
							cellEllipsis={cellEllipsis}
							onWidthChange={handleWidthChange}
							onHeaderClick={handleHeaderClick}
						/>
					)}

					{rows.map((row, i) => (
						<Row
							key={getRowKey(row, i) ?? i}
							row={i + (header ? 1 : 0)}
							data={row}
							cellEllipsis={cellEllipsis}
							columns={columns}
							onCellClick={onCellClick}
							onRowClick={onRowClick}
							onCellDoubleClick={onCellDoubleClick}
						/>
					))}

					{rows.length < 1 && empty}
				</div>
			)}

			{loading && renderLoading()}
		</div>
	);
};

export default Datagrid;
