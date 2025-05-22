'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var divider = require('./divider.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const STATUS = ["finished", "active", "pending"];
function defaultRenderIcon(i, status) {
    return (jsxRuntime.jsx("span", { className: 'i-step-item-index', children: status === "finished" ? (jsxRuntime.jsx(material.CheckRound, { style: { width: "1em", height: "1.5em" } })) : (i + 1) }));
}
function Item(props) {
    const { index = 0, active = 0, renderIcon = defaultRenderIcon, title, vertical, line = jsxRuntime.jsx(divider.default, {}), asList, style, className, children, onClick, } = props;
    const status = STATUS[index === active ? 1 : index < active ? 0 : 2];
    const handleClick = () => {
        onClick?.(index);
    };
    return (jsxRuntime.jsx("div", { style: style, className: classNames__default("i-step-item", {
            [`i-step-item-${status}`]: !asList,
        }, className), onClick: handleClick, children: vertical ? (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs("div", { className: 'i-step-item-left', children: [renderIcon?.(index, status), line] }), jsxRuntime.jsxs("div", { className: 'i-step-item-right', children: [jsxRuntime.jsx("div", { className: 'i-step-item-title', children: title }), children && (jsxRuntime.jsx("div", { className: 'i-step-item-content', children: children }))] })] })) : (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs("div", { className: 'i-step-item-title', children: [renderIcon?.(index, status), jsxRuntime.jsx("span", { children: title }), line] }), children && (jsxRuntime.jsx("div", { className: 'i-step-item-content', children: children }))] })) }));
}

exports.default = Item;
//# sourceMappingURL=item.js.map
