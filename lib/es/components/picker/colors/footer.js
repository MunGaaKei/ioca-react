import { jsxs, jsx } from 'react/jsx-runtime';
import { CheckRound } from '@ricons/material';
import { useState, useEffect } from 'react';
import Button from '../../button/button.js';
import Icon from '../../icon/icon.js';
import Input from '../../input/input.js';
import Select from '../../select/select.js';

const ColorMethods = {
    HEX: "toHexString",
    RGB: "toRgbString",
    HSB: "toHsbString",
};
function Footer(props) {
    const { value, type, onTypeChange, onChange, onOk } = props;
    const [inputValue, setInputValue] = useState(value);
    const [colorType, setColorType] = useState(type);
    const handleChange = (v) => {
        setInputValue(v);
        onChange(v);
    };
    const handleTypeChange = (t) => {
        setColorType(t);
        onTypeChange(t);
    };
    useEffect(() => {
        setInputValue(value);
        setColorType(type);
    }, [value, type]);
    return (jsxs("div", { className: "i-colorpicker-footer", children: [jsx(Select, { readOnly: true, hideClear: true, hideArrow: true, style: { width: "5.6em" }, options: ["RGB", "HEX", "HSB"], value: colorType, onChange: handleTypeChange, popupProps: { fitSize: false } }), jsx(Input, { placeholder: "color", value: inputValue, onChange: handleChange }), jsx(Button, { square: true, onClick: onOk, children: jsx(Icon, { icon: jsx(CheckRound, {}) }) })] }));
}

export { ColorMethods, Footer as default };
//# sourceMappingURL=footer.js.map
