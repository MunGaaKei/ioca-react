'use strict';

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var react = require('react');
var checkbox = require('../checkbox/checkbox.js');
var icon = require('../icon/icon.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

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
            return (jsxRuntime.jsx("div", { className: 'i-tree-group-title', children: title }, i));
        }
        if (type && type !== "item") {
            return (jsxRuntime.jsx("div", { className: `i-tree-type-${type}`, children: title }, i));
        }
        return (jsxRuntime.jsx(TreeItem, { index: i, item: item, depth: depth, nodeProps: nodeProps, ...restProps }, itemKey));
    });
    if (depth > 0)
        return jsxRuntime.jsx(jsxRuntime.Fragment, { children: contents });
    return (jsxRuntime.jsx("div", { className: classNames__default("i-tree", className, {
            "i-tree-round": round,
        }), style: style, children: contents }));
}
const Header = (props) => {
    const { as: Tag = "a", href, selected, children, ...restProps } = props;
    const className = classNames__default("i-tree-item-header", {
        "i-tree-item-selected": selected,
    });
    if (typeof Tag === "string") {
        return (jsxRuntime.jsx(Tag, { href: href, className: className, ...restProps, children: children }));
    }
    return (jsxRuntime.jsx(Tag, { to: href || "", className: className, ...restProps, children: children }));
};
const TreeItem = (props) => {
    const { item, depth = 0, index, selected, checked = [], partofs = {}, checkable, nodeProps, renderExtra, onItemClick, onItemSelect, onItemCheck, ...restProps } = props;
    const { as, key = "", href, icon: icon$1, title, expanded, disabled } = item;
    const children = item[nodeProps.children];
    const [expand, setExpand] = react.useState(expanded);
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
    return (jsxRuntime.jsxs("div", { className: classNames__default("i-tree-item", {
            "i-tree-expand": expand,
        }), children: [jsxRuntime.jsxs(Header, { as: as, href: href, style: { paddingLeft: `${depth * 1.5 + 0.5}em` }, selected: selected === key, onClick: handleItemClick, children: [checkable && (jsxRuntime.jsx(checkbox.default.Item, { value: itemChecked, partof: !itemChecked && partofs[key], className: 'i-tree-checkbox', onChange: handleItemCheck, onClick: (e) => e.stopPropagation() })), icon$1 && jsxRuntime.jsx("span", { className: 'i-tree-item-icon', children: icon$1 }), jsxRuntime.jsx("span", { className: 'i-tree-item-title', children: title }), renderExtra?.(item), children && (jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.KeyboardArrowDownRound, {}), className: 'i-tree-toggle', onClick: (e) => handleExpand(e, true) }))] }), children?.length && (jsxRuntime.jsx("div", { className: 'i-tree-item-content', children: jsxRuntime.jsx(TreeList, { data: children, depth: depth + 1, selected: selected, checkable: checkable, parent: item, partofs: partofs, checked: checked, nodeProps: nodeProps, renderExtra: renderExtra, onItemClick: onItemClick, onItemSelect: onItemSelect, onItemCheck: onItemCheck, ...restProps }) }))] }));
};

exports.TreeItem = TreeItem;
exports.TreeList = TreeList;
//# sourceMappingURL=item.js.map
