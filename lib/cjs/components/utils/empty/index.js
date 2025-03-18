'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function Empty(props) {
    const { className, ...restProps } = props;
    return (jsxRuntime.jsx(material.InboxTwotone, { className: classNames__default("i-empty", className), ...restProps }));
}

exports.default = Empty;
//# sourceMappingURL=index.js.map
