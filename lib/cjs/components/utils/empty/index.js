'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

function Empty(props) {
    const { className, ...restProps } = props;
    return (jsxRuntime.jsx(material.InboxTwotone, { className: classNames__default.default("i-empty", className), ...restProps }));
}

exports.default = Empty;
//# sourceMappingURL=index.js.map
