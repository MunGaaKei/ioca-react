'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ColorsPanel = require('@rc-component/color-picker');
var react = require('react');
var popup = require('../../popup/popup.js');
var footer = require('./footer.js');
var handle = require('./handle.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var ColorsPanel__default = /*#__PURE__*/_interopDefaultCompat(ColorsPanel);

function ColorPicker(props) {
    const { value, type = "HEX", disabledAlpha, children, usePanel, handle: handle$1 = "both", placeholder = "Colors", popupProps, onChange, } = props;
    const [colorType, setColorType] = react.useState(type);
    const [colorValue, setColorValue] = react.useState(value);
    const [syncValue, setSyncValue] = react.useState(value);
    const [visible, setVisible] = react.useState(popupProps?.visible);
    const handleChange = (target) => {
        setSyncValue(target);
    };
    const handleComplete = (target) => {
        const method = footer.ColorMethods[colorType];
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
        const method = footer.ColorMethods[t];
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
    react.useEffect(() => {
        setSyncValue(value);
        setColorValue(value);
    }, [value]);
    react.useEffect(() => {
        if (popupProps?.visible !== undefined) {
            setVisible(popupProps.visible);
        }
    }, [popupProps?.visible]);
    if (usePanel) {
        return jsxRuntime.jsx(ColorsPanel__default, { ...props });
    }
    return (jsxRuntime.jsx(popup.default, { trigger: 'click', touchable: true, position: 'bottom', ...popupProps, visible: visible, content: jsxRuntime.jsx(ColorsPanel__default, { value: syncValue, disabledAlpha: disabledAlpha, panelRender: (panel) => {
                return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [panel, jsxRuntime.jsx(footer.default, { value: colorValue, type: colorType, onTypeChange: handleTypeChange, onChange: handleValueChange, onOk: handleOk })] }));
            }, onChange: handleChange, onChangeComplete: handleComplete }), onVisibleChange: handleVisibleChange, children: children ?? (jsxRuntime.jsx(handle.default, { color: value, handle: handle$1, placeholder: placeholder })) }));
}

exports.default = ColorPicker;
//# sourceMappingURL=index.js.map
