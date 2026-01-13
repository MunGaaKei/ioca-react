import { jsx, jsxs } from 'react/jsx-runtime';
import { MinusRound, PlusRound } from '@ricons/material';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useMemo, Children } from 'react';
import Helpericon from '../utils/helpericon/helpericon.js';
import Item from './item.js';

const Collapse = (props) => {
    const { active, items, multiple, border, headerClickable, className, children, renderToggle = (active) => active ? jsx(MinusRound, {}) : jsx(PlusRound, {}), onCollapse, ...restProps } = props;
    const state = useReactive({
        active,
    });
    const collapses = useMemo(() => {
        if (!items) {
            if (!children)
                return [];
            return (Children.map(children, (node, i) => {
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
            state.active = state.active === key ? undefined : key;
            onCollapse?.(key, state.active !== undefined);
            return;
        }
        if (!Array.isArray(state.active))
            state.active = [];
        const i = state.active.findIndex((k) => k === key);
        if (i > -1) {
            state.active.splice(i, 1);
        }
        else {
            key !== undefined && state.active.push(key);
        }
        onCollapse?.(key, i < 0);
    };
    return (jsx("div", { className: classNames("i-collapse", {
            "i-collapse-bordered": border,
        }, className), ...restProps, children: collapses.map((item) => {
            const { key, title, content, disabled, className, ...restProps } = item;
            const isActive = multiple
                ? (state.active || []).includes(key)
                : state.active === key;
            return (jsxs("div", { className: classNames("i-collapse-item", className, {
                    "i-collapse-active": isActive,
                    "i-collapse-disabled": disabled,
                }), ...restProps, children: [jsxs("div", { className: 'i-collapse-header', onClick: () => handleHeaderClick(item), children: [title, jsx(Helpericon, { active: true, className: 'i-collapse-toggle', icon: renderToggle(isActive), onClick: (e) => handleToggle(item, e) })] }), jsx("div", { className: 'i-collapse-content', children: content })] }, key));
        }) }));
};
Collapse.Item = Item;

export { Collapse as default };
//# sourceMappingURL=collapse.js.map
