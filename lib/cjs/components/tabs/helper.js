'use strict';

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var react = require('react');
var button = require('../button/button.js');
var icon = require('../icon/icon.js');

const emptyBarStyle = {
    height: 0,
    width: 0,
};
const defaultRenderMore = () => (jsxRuntime.jsx(button.default, { flat: true, square: true, size: "small", children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.MoreHorizRound, {}) }) }));
const isSameTabs = (prev, next) => prev.length === next.length &&
    prev.every((tab, index) => {
        const target = next[index];
        return (tab.key === target.key &&
            tab.title === target.title &&
            tab.keepDOM === target.keepDOM &&
            tab.closable === target.closable &&
            tab.intersecting === target.intersecting);
    });
const getParsedTabs = (items, children) => {
    const contents = new Map();
    if (!items) {
        const tabs = react.Children.map(children, (node, i) => {
            const { key, props: nodeProps } = node;
            const { title, children: tabChildren, content, keepDOM, closable, } = nodeProps;
            const tabKey = String(key ?? i);
            contents.set(tabKey, tabChildren ?? content);
            return {
                key: tabKey,
                title,
                keepDOM,
                closable,
            };
        }) ?? [];
        return {
            tabs,
            contents,
            keys: new Set(tabs.map((tab) => String(tab.key))),
        };
    }
    const tabs = items.map((item, i) => {
        if (["string", "number"].includes(typeof item)) {
            const key = String(item);
            return { key, title: item };
        }
        const key = String(item.key ?? i);
        contents.set(key, item.content);
        const { content, ...rest } = item;
        return {
            ...rest,
            key,
        };
    });
    return {
        tabs,
        contents,
        keys: new Set(tabs.map((tab) => String(tab.key))),
    };
};

exports.defaultRenderMore = defaultRenderMore;
exports.emptyBarStyle = emptyBarStyle;
exports.getParsedTabs = getParsedTabs;
exports.isSameTabs = isSameTabs;
//# sourceMappingURL=helper.js.map
