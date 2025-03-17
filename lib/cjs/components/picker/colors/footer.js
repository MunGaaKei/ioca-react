'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var ahooks = require('ahooks');
var react = require('react');
require('../../button/index.js');
var icon = require('../../icon/icon.js');
require('../../input/index.js');
var select = require('../../select/select.js');
var input = require('../../input/input.js');
var button = require('../../button/button.js');

const ColorMethods = {
    HEX: "toHexString",
    RGB: "toRgbString",
    HSB: "toHsbString",
};
function Footer(props) {
    const { value, type, onTypeChange, onChange, onOk } = props;
    const state = ahooks.useReactive({
        value,
        type,
    });
    const handleChange = (v) => {
        state.value = v;
        onChange(v);
    };
    const handleTypeChange = (t) => {
        state.type = t;
        onTypeChange(t);
    };
    react.useEffect(() => {
        state.value = value;
        state.type = type;
    }, [value, type]);
    return (jsxRuntime.jsxs("div", { className: 'i-colorpicker-footer', children: [jsxRuntime.jsx(select.default, { readOnly: true, hideClear: true, hideArrow: true, style: { width: "5.6em" }, options: ["RGB", "HEX", "HSB"], value: state.type, onChange: handleTypeChange }), jsxRuntime.jsx(input.default, { placeholder: 'color', value: state.value, onChange: handleChange }), jsxRuntime.jsx(button.default, { square: true, onClick: onOk, children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.CheckRound, {}) }) })] }));
}

exports.ColorMethods = ColorMethods;
exports.default = Footer;
//# sourceMappingURL=footer.js.map
