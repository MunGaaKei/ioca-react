import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { KeyboardArrowDownRound } from '@ricons/material';
import classNames from 'classnames';
import { useState } from 'react';
import Checkbox from '../checkbox/checkbox.js';
import Icon from '../icon/icon.js';

function TreeList(props) {
    const { data = [], depth = 0, round, style, className, parent, nodeProps, ...restProps } = props;
    const contents = data.map((item, i) => {
        const { type } = item;
        const title = item[nodeProps.title];
        const itemKey = item[nodeProps.key] ||
            (parent?.key !== undefined ? `${parent.key}-${i}` : `${i}`);
        item.key = itemKey;
        item.parent = parent;
        if (type === "title") {
            return (jsx("div", { className: 'i-tree-group-title', children: title }, i));
        }
        if (type && type !== "item") {
            return (jsx("div", { className: `i-tree-type-${type}`, children: title }, i));
        }
        return (jsx(TreeItem, { index: i, item: item, depth: depth, nodeProps: nodeProps, ...restProps }, itemKey));
    });
    if (depth > 0)
        return jsx(Fragment, { children: contents });
    return (jsx("div", { className: classNames("i-tree", className, {
            "i-tree-round": round,
        }), style: style, children: contents }));
}
const Header = (props) => {
    const { as: Tag = "a", href, selected, children, ...restProps } = props;
    const className = classNames("i-tree-item-header", {
        "i-tree-item-selected": selected,
    });
    if (typeof Tag === "string") {
        return (jsx(Tag, { href: href, className: className, ...restProps, children: children }));
    }
    return (jsx(Tag, { to: href || "", className: className, ...restProps, children: children }));
};
const TreeItem = (props) => {
    const { item, depth = 0, index, selected, checked = [], partofs = {}, checkable, nodeProps, renderExtra, onItemClick, onItemSelect, onItemCheck, ...restProps } = props;
    const { as, key = "", href, icon, title, expanded, disabled } = item;
    const children = item[nodeProps.children];
    const [expand, setExpand] = useState(expanded);
    const handleExpand = (e, fromToggle) => {
        if (fromToggle) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (disabled || !children?.length)
            return;
        setExpand((v) => !v);
    };
    const handleItemClick = (e) => {
        if (disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        handleExpand(e);
        onItemClick?.(item, e);
        onItemSelect?.(key, item);
    };
    const handleItemCheck = (checked) => onItemCheck?.(item, checked, []);
    const itemChecked = checked.includes(key);
    return (jsxs("div", { className: classNames("i-tree-item", {
            "i-tree-expand": expand,
        }), children: [jsxs(Header, { as: as, href: href, style: { paddingLeft: `${depth * 1.5 + 0.5}em` }, selected: selected === key, onClick: handleItemClick, children: [checkable && (jsx(Checkbox.Item, { value: itemChecked, partof: !itemChecked && partofs[key], className: 'i-tree-checkbox', onChange: handleItemCheck, onClick: (e) => e.stopPropagation() })), icon && jsx("span", { className: 'i-tree-item-icon', children: icon }), jsx("span", { className: 'i-tree-item-title', children: title }), renderExtra?.(item), children && (jsx(Icon, { icon: jsx(KeyboardArrowDownRound, {}), className: 'i-tree-toggle', onClick: (e) => handleExpand(e, true) }))] }), children?.length && (jsx("div", { className: 'i-tree-item-content', children: jsx(TreeList, { data: children, depth: depth + 1, selected: selected, checkable: checkable, parent: item, partofs: partofs, checked: checked, nodeProps: nodeProps, renderExtra: renderExtra, onItemClick: onItemClick, onItemSelect: onItemSelect, onItemCheck: onItemCheck, ...restProps }) }))] }));
};

export { TreeItem, TreeList };
//# sourceMappingURL=item.js.map
