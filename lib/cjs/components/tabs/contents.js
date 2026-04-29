'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const TabsContents$1 = (props) => {
    const { tabs, activeKey, cachedTabKeySet, getContent } = props;
    return (jsxRuntime.jsx("div", { className: "i-tab-contents", children: tabs.map((tab, i) => {
            const key = tab.key ?? `${i}`;
            const content = getContent(key);
            const isActive = activeKey === key;
            const show = isActive || cachedTabKeySet.has(key);
            return (show && (jsxRuntime.jsx("div", { className: classNames__default("i-tab-content", {
                    "i-tab-active": isActive,
                }), role: "tabpanel", "aria-hidden": !isActive, children: content }, key)));
        }) }));
};
var TabsContents = react.memo(TabsContents$1);

exports.default = TabsContents;
//# sourceMappingURL=contents.js.map
