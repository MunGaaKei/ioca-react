'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var item = require('./item.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const List = (props) => {
    const { label, type, className, children, ...restProps } = props;
    return (jsxRuntime.jsx("ul", { className: classNames__default("i-list", className), ...restProps, children: react.Children.map(children, (node, i) => {
            const renderLabel = typeof label === "function" ? label(i) : label;
            const { type, props: nodeProps } = node;
            if (type === item.default) {
                return react.cloneElement(node, {
                    label: renderLabel,
                    ...nodeProps,
                    type,
                });
            }
            return node;
        }) }));
};
List.Item = item.default;

exports.default = List;
//# sourceMappingURL=list.js.map
