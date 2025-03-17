'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var helpericon = require('../utils/helpericon/helpericon.js');

const Tag = (props) => {
    const { dot, dotClass, outline, round, size = "normal", hoverShowClose, className, children, onClose, onClick, ...restProps } = props;
    return (jsxRuntime.jsxs("span", { className: classNames("i-tag", {
            "i-tag-outline": outline,
            "i-tag-clickable": onClick,
            [`i-tag-${size}`]: size !== "normal",
            round,
        }, className), onClick: onClick, ...restProps, children: [dot && jsxRuntime.jsx("span", { className: classNames("i-tag-dot", dotClass) }), children, onClose && (jsxRuntime.jsx(helpericon.default, { active: true, className: classNames("i-tag-close", {
                    "i-tag-hover-close": hoverShowClose,
                }), onClick: onClose }))] }));
};

exports.default = Tag;
//# sourceMappingURL=tag.js.map
