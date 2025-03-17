'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
require('../button/index.js');
var icon = require('../icon/icon.js');
var button = require('../button/button.js');

function ToTop(props) {
    const { style, className, onClick } = props;
    return (jsxRuntime.jsx(button.default, { square: true, className: classNames("i-affix-totop", className), style: { ...style }, onClick: onClick, children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.SkipPreviousRound, {}), rotate: 90 }) }));
}

exports.default = ToTop;
//# sourceMappingURL=totop.js.map
