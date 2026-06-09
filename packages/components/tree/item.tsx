import { KeyboardArrowDownRound } from "@ricons/material";
import classNames from "classnames";
import { MouseEvent } from "react";
import Checkbox from "../checkbox";
import Icon from "../icon";
import Loading from "../loading";
import { FlatNode, ITreeItem } from "./type";

export const TreeItemHeader = (props: {
    as?: ITreeItem["as"];
    href?: string;
    selected?: boolean;
    style?: React.CSSProperties;
    attrs?: Record<string, any>;
    children: React.ReactNode;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
}) => {
    const { as: Tag = "a", href, selected, children, attrs, ...restProps } = props;

    const className = classNames("i-tree-item-header", {
        "i-tree-item-selected": selected,
    });

    if (typeof Tag === "string") {
        return (
            <Tag href={href} className={className} {...attrs} {...restProps}>
                {children}
            </Tag>
        );
    }

    return (
        <Tag to={href || ""} className={className} {...attrs} {...restProps}>
            {children}
        </Tag>
    );
};

export interface TreeRowProps {
	flatNode: FlatNode;
	wrapperStyle?: React.CSSProperties;
	virtualMode?: boolean;
	selected?: string;
	checkedSet: Set<string>;
	partofs?: Record<string, boolean>;
	checkable?: boolean;
	nodeProps: { key: string; title: string; children: string };
	renderExtra?: (item: ITreeItem) => React.ReactNode;
	loadingKeys?: string[];
	onExpand: (key: string) => void;
	onItemClick?: (item: ITreeItem, e: MouseEvent<HTMLElement>) => void;
	onItemSelect?: (key: string, item: ITreeItem) => void;
	onItemCheck?: (item: ITreeItem, checked: boolean, checkedKeys: string[]) => void;
}

export function TreeRow(props: TreeRowProps) {
	const {
		flatNode,
		wrapperStyle,
		virtualMode,
		selected,
		checkedSet,
		partofs = {},
		checkable,
		nodeProps,
		renderExtra,
		loadingKeys,
		onExpand,
		onItemClick,
		onItemSelect,
		onItemCheck,
	} = props;

	const { node, depth, isExpanded } = flatNode;
	const { key = "", as, href, icon, title, disabled, type, attrs } = node;
	const children = node[nodeProps.children];
	const hasChildren = children instanceof Promise || typeof children === "function" || (Array.isArray(children) && children.length > 0);
	const loading = loadingKeys?.includes(key);

	if (type === "title") {
		return <div style={wrapperStyle} className="i-tree-group-title">{title}</div>;
	}

	if (type && type !== "item") {
		return <div style={wrapperStyle} className={`i-tree-type-${type}`}>{title}</div>;
	}

	return (
		<div
			className={!virtualMode ? classNames("i-tree-item", { "i-tree-expand": isExpanded }) : undefined}
			style={wrapperStyle}
		>
			<TreeItemHeader
				as={as}
				attrs={attrs}
				href={href}
				style={{ paddingLeft: `${depth * 1.5 + 0.5}em` }}
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
						value={checkedSet.has(key)}
						partof={!checkedSet.has(key) && partofs[key]}
						className="i-tree-checkbox"
						onChange={() => onItemCheck?.(node, !checkedSet.has(key), [])}
						onClick={(e: MouseEvent) => e.stopPropagation()}
					/>
				)}

				{icon && <span className="i-tree-item-icon">{icon}</span>}

				<span className="i-tree-item-title">{title}</span>

				{renderExtra?.(node)}

				{hasChildren && (
					<Icon
						icon={loading ? <Loading size=".86em" /> : <KeyboardArrowDownRound />}
						className={classNames("i-tree-toggle", {
							"i-tree-expand": virtualMode ? isExpanded : false,
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
}

interface TreeListProps {
    flatNodes: FlatNode[];
    onExpand: (key: string) => void;
    selected?: string;
    checkedSet: Set<string>;
    partofs?: Record<string, boolean>;
    checkable?: boolean;
    nodeProps: { key: string; title: string; children: string };
    renderExtra?: (item: ITreeItem) => React.ReactNode;
    loadingKeys?: string[];
    round?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onItemClick?: (item: ITreeItem, e: MouseEvent<HTMLElement>) => void;
    onItemSelect?: (key: string, item: ITreeItem) => void;
    onItemCheck?: (item: ITreeItem, checked: boolean, checkedKeys: string[]) => void;
}

export function TreeList(props: TreeListProps) {
    const { flatNodes, onExpand, selected, checkedSet, partofs = {}, checkable, nodeProps, renderExtra, loadingKeys, round, className, style, onItemClick, onItemSelect, onItemCheck } = props;

    return (
        <div
            className={classNames("i-tree", className, {
                "i-tree-round": round,
            })}
            style={style}
        >
            {flatNodes.map((flatNode) => {
                const { key = "" } = flatNode.node;
                return (
                    <TreeRow
                        key={key}
                        flatNode={flatNode}
                        selected={selected}
                        checkedSet={checkedSet}
                        partofs={partofs}
                        checkable={checkable}
                        nodeProps={nodeProps}
                        renderExtra={renderExtra}
                        loadingKeys={loadingKeys}
                        onExpand={onExpand}
                        onItemClick={onItemClick}
                        onItemSelect={onItemSelect}
                        onItemCheck={onItemCheck}
                    />
                );
            })}
        </div>
    );
}
