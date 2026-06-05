'use strict';

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var checkbox = require('../checkbox/checkbox.js');
var icon = require('../icon/icon.js');
var loading = require('../loading/loading.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const TreeItemHeader = (props) => {
    const { as: Tag = "a", href, selected, children, ...restProps } = props;
    const className = classNames__default("i-tree-item-header", {
        "i-tree-item-selected": selected,
    });
    if (typeof Tag === "string") {
        return (jsxRuntime.jsx(Tag, { href: href, className: className, ...restProps, children: children }));
    }
    return (jsxRuntime.jsx(Tag, { to: href || "", className: className, ...restProps, children: children }));
};
function TreeRow(props) {
    const { flatNode, wrapperStyle, virtualMode, selected, checkedSet, partofs = {}, checkable, nodeProps, renderExtra, loadingKeys, onExpand, onItemClick, onItemSelect, onItemCheck, } = props;
    const { node, depth, isExpanded } = flatNode;
    const { key = "", as, href, icon: icon$1, title, disabled, type } = node;
    const children = node[nodeProps.children];
    const hasChildren = children instanceof Promise || (Array.isArray(children) && children.length > 0);
    const loading$1 = loadingKeys?.includes(key);
    if (type === "title") {
        return jsxRuntime.jsx("div", { style: wrapperStyle, className: "i-tree-group-title", children: title });
    }
    if (type && type !== "item") {
        return jsxRuntime.jsx("div", { style: wrapperStyle, className: `i-tree-type-${type}`, children: title });
    }
    return (jsxRuntime.jsx("div", { className: !virtualMode ? classNames__default("i-tree-item", { "i-tree-expand": isExpanded }) : undefined, style: wrapperStyle, children: jsxRuntime.jsxs(TreeItemHeader, { as: as, href: href, style: { paddingLeft: `${depth * 1.5 + 0.5}em` }, selected: selected === key, onClick: (e) => {
                if (disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                if (hasChildren)
                    onExpand(key);
                onItemClick?.(node, e);
                onItemSelect?.(key, node);
            }, children: [checkable && (jsxRuntime.jsx(checkbox.default.Item, { value: checkedSet.has(key), partof: !checkedSet.has(key) && partofs[key], className: "i-tree-checkbox", onChange: () => onItemCheck?.(node, !checkedSet.has(key), []), onClick: (e) => e.stopPropagation() })), icon$1 && jsxRuntime.jsx("span", { className: "i-tree-item-icon", children: icon$1 }), jsxRuntime.jsx("span", { className: "i-tree-item-title", children: title }), renderExtra?.(node), hasChildren && (jsxRuntime.jsx(icon.default, { icon: loading$1 ? jsxRuntime.jsx(loading.default, { size: ".86em" }) : jsxRuntime.jsx(material.KeyboardArrowDownRound, {}), className: classNames__default("i-tree-toggle", {
                        "i-tree-expand": virtualMode ? isExpanded : false,
                    }), onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onExpand(key);
                    } }))] }) }));
}
function TreeList(props) {
    const { flatNodes, onExpand, selected, checkedSet, partofs = {}, checkable, nodeProps, renderExtra, loadingKeys, round, className, style, onItemClick, onItemSelect, onItemCheck } = props;
    return (jsxRuntime.jsx("div", { className: classNames__default("i-tree", className, {
            "i-tree-round": round,
        }), style: style, children: flatNodes.map((flatNode) => {
            const { key = "" } = flatNode.node;
            return (jsxRuntime.jsx(TreeRow, { flatNode: flatNode, selected: selected, checkedSet: checkedSet, partofs: partofs, checkable: checkable, nodeProps: nodeProps, renderExtra: renderExtra, loadingKeys: loadingKeys, onExpand: onExpand, onItemClick: onItemClick, onItemSelect: onItemSelect, onItemCheck: onItemCheck }, key));
        }) }));
}

exports.TreeItemHeader = TreeItemHeader;
exports.TreeList = TreeList;
exports.TreeRow = TreeRow;
//# sourceMappingURL=item.js.map
