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
import { TreeItemHeader } from "./item";

interface VirtualTreeProps {
	flatNodes: FlatNode[];
	onExpand: (key: string) => void;
	selected?: string;
	checked?: string[];
	partofs?: Record<string, boolean>;
	checkable?: boolean;
	nodeProps: { key: string; title: string; children: string };
	renderExtra?: (item: ITreeItem) => React.ReactNode;
	loadingKeys?: string[];
	height?: number | string;
	useVirtual: TVirtual;
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
		checked = [],
		partofs = {},
		checkable,
		nodeProps,
		renderExtra,
		loadingKeys,
		height,
		useVirtual,
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

	const rowComponent = useCallback(
		({
			index,
			style: itemStyle,
		}: {
			index: number;
			style: React.CSSProperties;
		}) => {
			const flatNode = flatNodes[index];
			if (!flatNode) return null;

			const { node, depth, isExpanded } = flatNode;
			const { key = "", as, href, icon, title, disabled, type } = node;
			const children = node[nodeProps.children];
			const hasChildren = children instanceof Promise || (Array.isArray(children) && children.length > 0);
			const loading = loadingKeys?.includes(key);

			if (type === "title") {
				return (
					<div style={itemStyle} className="i-tree-group-title">
						{title}
					</div>
				);
			}

			if (type && type !== "item") {
				return (
					<div style={itemStyle} className={`i-tree-type-${type}`}>
						{title}
					</div>
				);
			}

			return (
				<div style={itemStyle}>
					<TreeItemHeader
						as={as}
						href={href}
						style={{
							paddingLeft: `${depth * 1.5 + 0.5}em`,
						}}
						selected={selected === key}
						onClick={(e) => {
							if (disabled) {
								e.preventDefault();
								e.stopPropagation();
								return;
							}
							if (hasChildren) onExpand(key);
							onItemClick?.(node, e);
							onItemSelect?.(key, node);
						}}
					>
						{checkable && (
							<Checkbox.Item
								value={checked.includes(key)}
								partof={
									!checked.includes(key) && partofs[key]
								}
								className="i-tree-checkbox"
								onChange={() =>
									onItemCheck?.(
										node,
										!checked.includes(key),
										[],
									)
								}
								onClick={(e: React.MouseEvent) =>
									e.stopPropagation()
								}
							/>
						)}

						{icon && (
							<span className="i-tree-item-icon">{icon}</span>
						)}

						<span className="i-tree-item-title">{title}</span>

						{renderExtra?.(node)}

						{hasChildren && (
							<Icon
								icon={loading ? <Loading size=".86em" /> : <KeyboardArrowDownRound />}
								className={classNames("i-tree-toggle", {
									"i-tree-expand": isExpanded,
								})}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onExpand(key);
								}}
							/>
						)}
					</TreeItemHeader>
				</div>
			);
		},
		[
			flatNodes,
			selected,
			checked,
			partofs,
			checkable,
			nodeProps,
			renderExtra,
			loadingKeys,
			onExpand,
			onItemClick,
			onItemSelect,
			onItemCheck,
		],
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
				rowHeight={useVirtual.rowHeight}
				overscanCount={Math.max(3, useVirtual.threshold ?? 8)}
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
