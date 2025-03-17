'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

const Card = (props) => {
    const { hideShadow, border, className, children, header, footer, ...restProps } = props;
    return (jsxRuntime.jsxs("div", { className: classNames__default.default("i-card", className, {
            shadow: !hideShadow,
            "i-card-bordered": border,
        }), ...restProps, children: [header && jsxRuntime.jsx("div", { className: 'i-card-header', children: header }), children && jsxRuntime.jsx("div", { className: 'i-card-content', children: children }), footer && jsxRuntime.jsx("div", { className: 'i-card-footer', children: footer })] }));
};

exports.default = Card;
//# sourceMappingURL=card.js.map
