'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var radash = require('radash');
var react = require('react');
var icon = require('../../icon/icon.js');

const Helpericon = (props) => {
    const { as = "a", active, className, icon: icon$1 = jsxRuntime.jsx(material.CloseRound, {}), ...restProps } = props;
    if (!active)
        return jsxRuntime.jsx(jsxRuntime.Fragment, {});
    return react.createElement(as, {
        className: classNames("i-helpericon", className),
        ...restProps,
    }, [
        react.createElement(icon.default, {
            key: radash.uid(3),
            icon: icon$1,
        }),
    ]);
};

exports.default = Helpericon;
//# sourceMappingURL=helpericon.js.map
