import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { CheckRound } from '@ricons/material';
import classNames from 'classnames';
import Divider from './divider.js';

const STATUS = ["finished", "active", "pending"];
function defaultRenderIcon(i, status) {
    return (jsx("span", { className: 'i-step-item-index', children: status === "finished" ? (jsx(CheckRound, { style: { width: "1em", height: "1.5em" } })) : (i + 1) }));
}
function Item(props) {
    const { index = 0, active = 0, renderIcon = defaultRenderIcon, title, vertical, line = jsx(Divider, {}), asList, style, className, children, onClick, } = props;
    const status = STATUS[index === active ? 1 : index < active ? 0 : 2];
    const handleClick = () => {
        onClick?.(index);
    };
    return (jsx("div", { style: style, className: classNames("i-step-item", {
            [`i-step-item-${status}`]: !asList,
        }, className), onClick: handleClick, children: vertical ? (jsxs(Fragment, { children: [jsxs("div", { className: 'i-step-item-left', children: [renderIcon?.(index, status), line] }), jsxs("div", { className: 'i-step-item-right', children: [jsx("div", { className: 'i-step-item-title', children: title }), children && (jsx("div", { className: 'i-step-item-content', children: children }))] })] })) : (jsxs(Fragment, { children: [jsxs("div", { className: 'i-step-item-title', children: [renderIcon?.(index, status), jsx("span", { children: title }), line] }), children && (jsx("div", { className: 'i-step-item-content', children: children }))] })) }));
}

export { Item as default };
//# sourceMappingURL=item.js.map
