import { jsx } from 'react/jsx-runtime';
import { MoreHorizRound } from '@ricons/material';
import { Children } from 'react';
import Button from '../button/button.js';
import Icon from '../icon/icon.js';

const emptyBarStyle = {
    height: 0,
    width: 0,
};
const defaultRenderMore = () => (jsx(Button, { flat: true, square: true, size: "small", children: jsx(Icon, { icon: jsx(MoreHorizRound, {}) }) }));
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
        const tabs = Children.map(children, (node, i) => {
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

export { defaultRenderMore, emptyBarStyle, getParsedTabs, isSameTabs };
