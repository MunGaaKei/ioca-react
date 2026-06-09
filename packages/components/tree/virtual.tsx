import { KeyboardArrowDownRound } from "@ricons/material";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
// @ts-ignore
import { List as VirtualList } from "react-window";
import Checkbox from "../checkbox";
import Icon from "../icon";
import Loading from "../loading";
import { useResizeObserver } from "../../js/hooks";
import { FlatNode, ITreeItem, TVirtual } from "./type";
import { TreeRow } from "./item";

interface VirtualTreeProps {
	flatNodes: FlatNode[];
	onExpand: (key: string) => void;
	selected?: string;
	checkedSet: Set<string>;
	partofs?: Record<string, boolean>;
	checkable?: boolean;
	nodeProps: { key: string; title: string; children: string };
	renderExtra?: (item: ITreeItem) => React.ReactNode;
	loadingKeys?: string[];
	height?: number | string;
	virtual: TVirtual;
	className?: string;
	style?: React.CSSProperties;
	onItemClick?: (item: ITreeItem, e: React.MouseEvent<HTMLElement>) => void;
	onItemSelect?: (key: string, item: ITreeItem) => void;
	onItemCheck?: (
		item: ITreeItem,
		checked: boolean,
		checkedKeys: string[],
	) => void;
}

export default function VirtualTree(props: VirtualTreeProps) {
	const {
		flatNodes,
		onExpand,
		selected,
		checkedSet,
		partofs = {},
		checkable,
		nodeProps,
		renderExtra,
		loadingKeys,
		height,
		virtual,
		className,
		style,
		onItemClick,
		onItemSelect,
		onItemCheck,
	} = props;

	const listRef = useRef<any>(null);
	const wrapRef = useRef<HTMLDivElement>(null);
	const ro = useResizeObserver();
	const [viewportHeight, setViewportHeight] = useState(0);

	useEffect(() => {
		const el = wrapRef.current;
		if (!el) return;
		const update = () => {
			const r = el.getBoundingClientRect();
			setViewportHeight((prev) => (prev === r.height ? prev : r.height));
		};
		update();
		ro.observe?.(el, update);
		return () => ro.unobserve?.(el);
	}, [ro]);

	const listHeight = Math.max(
		0,
		(typeof height === "number" ? height : viewportHeight || 360),
	);

	const propsRef = useRef(props);
	propsRef.current = props;

	const rowComponent = useCallback(
		({
			index,
			style,
		}: {
			index: number;
			style: React.CSSProperties;
		}) => {
			const p = propsRef.current;
			const flatNode = p.flatNodes[index];
			if (!flatNode) return null;
			return (
				<TreeRow
					flatNode={flatNode}
					wrapperStyle={style}
					virtualMode
					selected={p.selected}
					checkedSet={p.checkedSet}
					partofs={p.partofs}
					checkable={p.checkable}
					nodeProps={p.nodeProps}
					renderExtra={p.renderExtra}
					loadingKeys={p.loadingKeys}
					onExpand={p.onExpand}
					onItemClick={p.onItemClick}
					onItemSelect={p.onItemSelect}
					onItemCheck={p.onItemCheck}
				/>
			);
		},
		[],
	);

	return (
		<div
			ref={wrapRef}
			className={classNames("i-tree", className)}
			style={{ display: "block", width: "100%", height: "100%", ...style }}
		>
			<VirtualList
				listRef={listRef}
				rowCount={flatNodes.length}
				rowHeight={virtual.rowHeight}
				overscanCount={Math.max(3, virtual.threshold ?? 8)}
				rowProps={{} as any}
				style={{
					width: "100%",
					height: listHeight,
					overflow: "auto",
				}}
				rowComponent={rowComponent}
			/>
		</div>
	);
}
