import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import ColorsPanel from '@rc-component/color-picker';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import InputContainer from '../../input/container.js';
import Popup from '../../popup/popup.js';
import Footer, { ColorMethods } from './footer.js';
import Handle from './handle.js';

function ColorPicker(props) {
    const { value, type = "HEX", disabledAlpha, children, usePanel, handle = "both", placeholder = "Colors", popupProps, onChange, label, required, className, style, ...restProps } = props;
    const [colorType, setColorType] = useState(type);
    const [colorValue, setColorValue] = useState(value);
    const [syncValue, setSyncValue] = useState(value);
    const [visible, setVisible] = useState(popupProps?.visible);
    const handleChange = (target) => {
        setSyncValue(target);
    };
    const handleComplete = (target) => {
        const method = ColorMethods[colorType];
        if (target.a !== 1) {
            target.a = parseFloat(target.a.toFixed(3));
        }
        setColorValue(target[method]?.());
    };
    const handleVisibleChange = (v) => {
        setVisible(v);
        popupProps?.onVisibleChange?.(v);
    };
    const handleTypeChange = (t) => {
        const method = ColorMethods[t];
        setColorType(t);
        setColorValue(syncValue?.[method]?.());
    };
    const handleValueChange = (v) => {
        setColorValue(v);
        setSyncValue(v);
    };
    const handleOk = () => {
        onChange?.(colorValue);
        setVisible(false);
    };
    useEffect(() => {
        setSyncValue(value);
        setColorValue(value);
    }, [value]);
    useEffect(() => {
        if (popupProps?.visible !== undefined) {
            setVisible(popupProps.visible);
        }
    }, [popupProps?.visible]);
    if (usePanel) {
        return (jsx(InputContainer, { label: label, required: required, children: jsx(ColorsPanel, { ...restProps, value: value, onChange: onChange }) }));
    }
    return (jsx(InputContainer, { label: label, required: required, className: classNames("i-colorpicker", className), style: style, children: jsx(Popup, { trigger: "click", touchable: true, position: "bottom", ...popupProps, visible: visible, content: jsx(ColorsPanel, { ...restProps, value: syncValue, disabledAlpha: disabledAlpha, panelRender: (panel) => {
                    return (jsxs(Fragment, { children: [panel, jsx(Footer, { value: colorValue, type: colorType, onTypeChange: handleTypeChange, onChange: handleValueChange, onOk: handleOk })] }));
                }, onChange: handleChange, onChangeComplete: handleComplete }), onVisibleChange: handleVisibleChange, children: typeof children === "function"
                ? children({ type: colorType, value: colorValue })
                : (children ?? (jsx(Handle, { color: value, handle: handle, placeholder: placeholder }))) }) }));
}

export { ColorPicker as default };
//# sourceMappingURL=index.js.map
