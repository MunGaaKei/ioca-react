'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var react = require('react');
var helpericon = require('../utils/helpericon/helpericon.js');
var item = require('./item.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const Collapse = (props) => {
    const { active, items, multiple, border, headerClickable, className, children, renderToggle = (active) => active ? jsxRuntime.jsx(material.MinusRound, {}) : jsxRuntime.jsx(material.PlusRound, {}), onCollapse, ...restProps } = props;
    const [activeKey, setActiveKey] = react.useState(active);
    const collapses = react.useMemo(() => {
        if (!items) {
            if (!children)
                return [];
            return (react.Children.map(children, (node, i) => {
                const { key, props: nodeProps } = node;
                const { title, children, content, disabled, ...restProps } = nodeProps;
                return {
                    ...restProps,
                    key: key || i,
                    title,
                    content: children || content,
                    disabled,
                };
            }) || []);
        }
        return items;
    }, [children]);
    const handleHeaderClick = (item) => {
        if (!headerClickable)
            return;
        handleToggle(item);
    };
    const handleToggle = (item, e) => {
        const { key, disabled } = item;
        e?.stopPropagation();
        if (disabled)
            return;
        if (!multiple) {
            const nextActive = activeKey === key ? undefined : key;
            setActiveKey(nextActive);
            onCollapse?.(key, nextActive !== undefined);
            return;
        }
        const group = Array.isArray(activeKey) ? [...activeKey] : [];
        const i = group.findIndex((k) => k === key);
        if (i > -1) {
            group.splice(i, 1);
        }
        else {
            key !== undefined && group.push(key);
        }
        setActiveKey(group);
        onCollapse?.(key, i < 0);
    };
    return (jsxRuntime.jsx("div", { className: classNames__default("i-collapse", {
            "i-collapse-bordered": border,
        }, className), ...restProps, children: collapses.map((item) => {
            const { key, title, content, disabled, className, ...restProps } = item;
            const isActive = multiple
                ? (activeKey || []).includes(key)
                : activeKey === key;
            return (jsxRuntime.jsxs("div", { className: classNames__default("i-collapse-item", className, {
                    "i-collapse-active": isActive,
                    "i-collapse-disabled": disabled,
                }), ...restProps, children: [jsxRuntime.jsxs("div", { className: 'i-collapse-header', onClick: () => handleHeaderClick(item), children: [title, jsxRuntime.jsx(helpericon.default, { active: true, className: 'i-collapse-toggle', icon: renderToggle(isActive), onClick: (e) => handleToggle(item, e) })] }), jsxRuntime.jsx("div", { className: 'i-collapse-content', children: content })] }, key));
        }) }));
};
Collapse.Item = item.default;

exports.default = Collapse;
//# sourceMappingURL=collapse.js.map
