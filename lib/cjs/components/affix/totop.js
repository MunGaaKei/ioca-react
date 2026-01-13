'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var button = require('../button/button.js');
var icon = require('../icon/icon.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function ToTop(props) {
    const { style, className, onClick } = props;
    return (jsxRuntime.jsx(button.default, { square: true, className: classNames__default("i-affix-totop", className), style: { ...style }, onClick: onClick, children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.SkipPreviousRound, {}), rotate: 90 }) }));
}

exports.default = ToTop;
//# sourceMappingURL=totop.js.map
