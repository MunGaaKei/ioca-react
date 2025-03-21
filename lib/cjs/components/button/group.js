'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var button = require('./button.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function Group(props) {
    const { children, vertical, buttonProps, className, style } = props;
    const nodes = react.useMemo(() => {
        return react.Children.map(children, (node) => {
            const { type } = node;
            if (type === button.default) {
                return react.cloneElement(node, Object.assign({}, node.props, buttonProps));
            }
            return node;
        });
    }, [children]);
    return (jsxRuntime.jsx("div", { className: classNames__default(className, vertical ? "i-btn-group-vertical" : "i-btn-group-horizonal"), style: style, children: nodes }));
}

exports.default = Group;
//# sourceMappingURL=group.js.map
