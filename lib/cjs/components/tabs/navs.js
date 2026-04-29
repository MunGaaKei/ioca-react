'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var popup = require('../popup/popup.js');
var helpericon = require('../utils/helpericon/helpericon.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const TabsNavs$1 = (props) => {
    const { tabs, moreTabs, activeKey, vertical, overflow, hideMore, navsJustify = "start", bar, barClass, barStyle, navsRef, renderMore, setNavRef, onOpen, onClose, onMoreTabClick, onKeyAction, } = props;
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs("div", { ref: navsRef, className: classNames__default("i-tab-navs", `justify-${navsJustify}`), role: "tablist", "aria-orientation": vertical ? "vertical" : "horizontal", children: [tabs.map((tab, i) => {
                        const { title, key = `${i}`, closable } = tab;
                        const isActive = activeKey === key;
                        return (jsxRuntime.jsxs("a", { ref: (node) => setNavRef(i, node), className: classNames__default("i-tab-nav", {
                                "i-tab-active": isActive,
                            }), role: "tab", tabIndex: isActive ? 0 : -1, "aria-selected": isActive, onClick: () => onOpen(key), onKeyDown: (e) => onKeyAction(e, () => onOpen(key)), children: [title, closable && (jsxRuntime.jsx(helpericon.default, { as: "i", active: true, className: "i-tab-nav-close", role: "button", tabIndex: 0, "aria-label": "\u5173\u95ED\u6807\u7B7E\u9875", onClick: (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onClose(key);
                                    }, onKeyDown: (e) => onKeyAction(e, () => onClose(key)) }))] }, key));
                    }), bar && (jsxRuntime.jsx("span", { className: classNames__default("i-tab-navs-bar", barClass), style: barStyle }))] }), !hideMore && overflow && moreTabs.length > 0 && (jsxRuntime.jsx(popup.default, { arrow: false, position: vertical ? "right" : "bottom", align: "end", touchable: true, hideDelay: 500, content: jsxRuntime.jsx("div", { className: "i-tabs-morelist pd-4", children: moreTabs.map((tab, i) => {
                        const { key = `${i}`, title } = tab;
                        const isActive = activeKey === key;
                        return (jsxRuntime.jsx("a", { className: classNames__default("i-tab-nav", {
                                "i-tab-active": isActive,
                            }), role: "button", tabIndex: 0, onClick: () => onMoreTabClick(key), onKeyDown: (e) => onKeyAction(e, () => onMoreTabClick(key)), children: title }, key));
                    }) }), children: renderMore(moreTabs) }))] }));
};
var TabsNavs = react.memo(TabsNavs$1);

exports.default = TabsNavs;
//# sourceMappingURL=navs.js.map
