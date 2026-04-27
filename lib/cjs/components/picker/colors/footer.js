'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var react = require('react');
var button = require('../../button/button.js');
var icon = require('../../icon/icon.js');
var input = require('../../input/input.js');
var select = require('../../select/select.js');

const ColorMethods = {
    HEX: "toHexString",
    RGB: "toRgbString",
    HSB: "toHsbString",
};
function Footer(props) {
    const { value, type, onTypeChange, onChange, onOk } = props;
    const [inputValue, setInputValue] = react.useState(value);
    const [colorType, setColorType] = react.useState(type);
    const handleChange = (v) => {
        setInputValue(v);
        onChange(v);
    };
    const handleTypeChange = (t) => {
        setColorType(t);
        onTypeChange(t);
    };
    react.useEffect(() => {
        setInputValue(value);
        setColorType(type);
    }, [value, type]);
    return (jsxRuntime.jsxs("div", { className: "i-colorpicker-footer", children: [jsxRuntime.jsx(select.default, { readOnly: true, hideClear: true, hideArrow: true, style: { width: "5.6em" }, options: ["RGB", "HEX", "HSB"], value: colorType, onChange: handleTypeChange, popupProps: { fitSize: false } }), jsxRuntime.jsx(input.default, { placeholder: "color", value: inputValue, onChange: handleChange }), jsxRuntime.jsx(button.default, { square: true, onClick: onOk, children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.CheckRound, {}) }) })] }));
}

exports.ColorMethods = ColorMethods;
exports.default = Footer;
//# sourceMappingURL=footer.js.map
