import { jsx, jsxs } from 'react/jsx-runtime';
import { KeyboardArrowDownRound } from '@ricons/material';
import classNames from 'classnames';
import Checkbox from '../checkbox/checkbox.js';
import Icon from '../icon/icon.js';
import Loading from '../loading/loading.js';

const TreeItemHeader = (props) => {
    const { as: Tag = "a", href, selected, children, attrs, ...restProps } = props;
    const className = classNames("i-tree-item-header", {
        "i-tree-item-selected": selected,
    });
    if (typeof Tag === "string") {
        return (jsx(Tag, { href: href, className: className, ...attrs, ...restProps, children: children }));
    }
    return (jsx(Tag, { to: href || "", className: className, ...attrs, ...restProps, children: children }));
};
function TreeRow(props) {
    const { flatNode, wrapperStyle, virtualMode, selected, checkedSet, partofs = {}, checkable, nodeProps, renderExtra, loadingKeys, onExpand, onItemClick, onItemSelect, onItemCheck, } = props;
    const { node, depth, isExpanded } = flatNode;
    const { key = "", as, href, icon, title, disabled, type, attrs } = node;
    const children = node[nodeProps.children];
    const hasChildren = children instanceof Promise || typeof children === "function" || (Array.isArray(children) && children.length > 0);
    const loading = loadingKeys?.includes(key);
    if (type === "title") {
        return jsx("div", { style: wrapperStyle, className: "i-tree-group-title", children: title });
    }
    if (type && type !== "item") {
        return jsx("div", { style: wrapperStyle, className: `i-tree-type-${type}`, children: title });
    }
    return (jsx("div", { className: !virtualMode ? classNames("i-tree-item", { "i-tree-expand": isExpanded }) : undefined, style: wrapperStyle, children: jsxs(TreeItemHeader, { as: as, attrs: attrs, href: href, style: { paddingLeft: `${depth * 1.5 + 0.5}em` }, selected: selected === key, onClick: (e) => {
                if (disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                if (hasChildren)
                    onExpand(key);
                onItemClick?.(node, e);
                onItemSelect?.(key, node);
            }, children: [checkable && (jsx(Checkbox.Item, { value: checkedSet.has(key), partof: !checkedSet.has(key) && partofs[key], className: "i-tree-checkbox", onChange: () => onItemCheck?.(node, !checkedSet.has(key), []), onClick: (e) => e.stopPropagation() })), icon && jsx("span", { className: "i-tree-item-icon", children: icon }), jsx("span", { className: "i-tree-item-title", children: title }), renderExtra?.(node), hasChildren && (jsx(Icon, { icon: loading ? jsx(Loading, { size: ".86em" }) : jsx(KeyboardArrowDownRound, {}), className: classNames("i-tree-toggle", {
                        "i-tree-expand": virtualMode ? isExpanded : false,
                    }), onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onExpand(key);
                    } }))] }) }));
}
function TreeList(props) {
    const { flatNodes, onExpand, selected, checkedSet, partofs = {}, checkable, nodeProps, renderExtra, loadingKeys, round, className, style, onItemClick, onItemSelect, onItemCheck } = props;
    return (jsx("div", { className: classNames("i-tree", className, {
            "i-tree-round": round,
        }), style: style, children: flatNodes.map((flatNode) => {
            const { key = "" } = flatNode.node;
            return (jsx(TreeRow, { flatNode: flatNode, selected: selected, checkedSet: checkedSet, partofs: partofs, checkable: checkable, nodeProps: nodeProps, renderExtra: renderExtra, loadingKeys: loadingKeys, onExpand: onExpand, onItemClick: onItemClick, onItemSelect: onItemSelect, onItemCheck: onItemCheck }, key));
        }) }));
}

export { TreeItemHeader, TreeList, TreeRow };
