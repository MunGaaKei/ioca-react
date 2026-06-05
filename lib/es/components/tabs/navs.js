import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { memo } from 'react';
import Popup from '../popup/popup.js';
import Helpericon from '../utils/helpericon/helpericon.js';

const TabsNavs = (props) => {
    const { tabs, moreTabs, activeKey, vertical, overflow, hideMore, navsJustify = "start", bar, barClass, barStyle, navsRef, renderMore, setNavRef, onOpen, onClose, onMoreTabClick, onKeyAction, } = props;
    return (jsxs(Fragment, { children: [jsxs("div", { ref: navsRef, className: classNames("i-tab-navs", `justify-${navsJustify}`), role: "tablist", "aria-orientation": vertical ? "vertical" : "horizontal", children: [tabs.map((tab, i) => {
                        const { title, key = `${i}`, closable } = tab;
                        const isActive = activeKey === key;
                        return (jsxs("a", { ref: (node) => setNavRef(i, node), className: classNames("i-tab-nav", {
                                "i-tab-active": isActive,
                            }), role: "tab", tabIndex: isActive ? 0 : -1, "aria-selected": isActive, onClick: () => onOpen(key), onKeyDown: (e) => onKeyAction(e, () => onOpen(key)), children: [title, closable && (jsx(Helpericon, { as: "i", active: true, className: "i-tab-nav-close", role: "button", tabIndex: 0, "aria-label": "\u5173\u95ED\u6807\u7B7E\u9875", onClick: (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onClose(key);
                                    }, onKeyDown: (e) => onKeyAction(e, () => onClose(key)) }))] }, key));
                    }), bar && (jsx("span", { className: classNames("i-tab-navs-bar", barClass), style: barStyle }))] }), !hideMore && overflow && moreTabs.length > 0 && (jsx(Popup, { arrow: false, position: vertical ? "right" : "bottom", align: "end", touchable: true, hideDelay: 500, content: jsx("div", { className: "i-tabs-morelist pd-4", children: moreTabs.map((tab, i) => {
                        const { key = `${i}`, title } = tab;
                        const isActive = activeKey === key;
                        return (jsx("a", { className: classNames("i-tab-nav", {
                                "i-tab-active": isActive,
                            }), role: "button", tabIndex: 0, onClick: () => onMoreTabClick(key), onKeyDown: (e) => onKeyAction(e, () => onMoreTabClick(key)), children: title }, key));
                    }) }), children: renderMore(moreTabs) }))] }));
};
var TabsNavs$1 = memo(TabsNavs);

export { TabsNavs$1 as default };
