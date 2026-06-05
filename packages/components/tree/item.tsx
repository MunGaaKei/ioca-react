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
    children: React.ReactNode;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
}) => {
    const { as: Tag = "a", href, selected, children, ...restProps } = props;

    const className = classNames("i-tree-item-header", {
        "i-tree-item-selected": selected,
    });

    if (typeof Tag === "string") {
        return (
            <Tag href={href} className={className} {...restProps}>
                {children}
            </Tag>
        );
    }

    return (
        <Tag to={href || ""} className={className} {...restProps}>
            {children}
        </Tag>
    );
};

interface TreeListProps {
    flatNodes: FlatNode[];
    onExpand: (key: string) => void;
    selected?: string;
    checked?: string[];
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
    const { flatNodes, onExpand, selected, checked = [], partofs = {}, checkable, nodeProps, renderExtra, loadingKeys, round, className, style, onItemClick, onItemSelect, onItemCheck } = props;

    return (
        <div
            className={classNames("i-tree", className, {
                "i-tree-round": round,
            })}
            style={style}
        >
            {flatNodes.map(({ node, depth, isExpanded }) => {
                const { key = "", as, href, icon, title, disabled, type } = node;
                const children = node[nodeProps.children];
                const hasChildren = children instanceof Promise || (Array.isArray(children) && children.length > 0);
                const loading = loadingKeys?.includes(key);

                if (type === "title") {
                    return (
                        <div key={key} className="i-tree-group-title">
                            {title}
                        </div>
                    );
                }

                if (type && type !== "item") {
                    return (
                        <div key={key} className={`i-tree-type-${type}`}>
                            {title}
                        </div>
                    );
                }

                return (
                    <div
                        key={key}
                        className={classNames("i-tree-item", {
                            "i-tree-expand": isExpanded,
                        })}
                    >
                        <TreeItemHeader
                            as={as}
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
                                    value={checked.includes(key)}
                                    partof={!checked.includes(key) && partofs[key]}
                                    className="i-tree-checkbox"
                                    onChange={() => onItemCheck?.(node, !checked.includes(key), [])}
                                    onClick={(e: MouseEvent) => e.stopPropagation()}
                                />
                            )}

                            {icon && <span className="i-tree-item-icon">{icon}</span>}

                            <span className="i-tree-item-title">{title}</span>

                            {renderExtra?.(node)}

                            {hasChildren && (
                                <Icon
                                    icon={loading ? <Loading size=".86em" /> : <KeyboardArrowDownRound />}
                                    className="i-tree-toggle"
                                    onClick={(e: MouseEvent<HTMLElement>) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onExpand(key);
                                    }}
                                />
                            )}
                        </TreeItemHeader>
                    </div>
                );
            })}
        </div>
    );
}
