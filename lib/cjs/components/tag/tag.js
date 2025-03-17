'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var helpericon = require('../utils/helpericon/helpericon.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

const Tag = (props) => {
    const { dot, dotClass, outline, round, size = "normal", hoverShowClose, className, children, onClose, onClick, ...restProps } = props;
    return (jsxRuntime.jsxs("span", { className: classNames__default.default("i-tag", {
            "i-tag-outline": outline,
            "i-tag-clickable": onClick,
            [`i-tag-${size}`]: size !== "normal",
            round,
        }, className), onClick: onClick, ...restProps, children: [dot && jsxRuntime.jsx("span", { className: classNames__default.default("i-tag-dot", dotClass) }), children, onClose && (jsxRuntime.jsx(helpericon.default, { active: true, className: classNames__default.default("i-tag-close", {
                    "i-tag-hover-close": hoverShowClose,
                }), onClick: onClose }))] }));
};

exports.default = Tag;
//# sourceMappingURL=tag.js.map
