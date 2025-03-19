import { jsxs, jsx } from 'react/jsx-runtime';
import { CheckRound } from '@ricons/material';
import { useReactive } from 'ahooks';
import { useEffect } from 'react';
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
    const state = useReactive({
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
    useEffect(() => {
        state.value = value;
        state.type = type;
    }, [value, type]);
    return (jsxs("div", { className: 'i-colorpicker-footer', children: [jsx(Select, { readOnly: true, hideClear: true, hideArrow: true, style: { width: "5.6em" }, options: ["RGB", "HEX", "HSB"], value: state.type, onChange: handleTypeChange }), jsx(Input, { placeholder: 'color', value: state.value, onChange: handleChange }), jsx(Button, { square: true, onClick: onOk, children: jsx(Icon, { icon: jsx(CheckRound, {}) }) })] }));
}

export { ColorMethods, Footer as default };
//# sourceMappingURL=footer.js.map
