'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');

function Empty(props) {
    const { className, ...restProps } = props;
    return (jsxRuntime.jsx(material.InboxTwotone, { className: classNames("i-empty", className), ...restProps }));
}

exports.default = Empty;
//# sourceMappingURL=index.js.map
