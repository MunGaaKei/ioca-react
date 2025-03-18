'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ColorsPanel = require('@rc-component/color-picker');
var ahooks = require('ahooks');
var react = require('react');
var popup = require('../../popup/popup.js');
var footer = require('./footer.js');
var handle = require('./handle.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var ColorsPanel__default = /*#__PURE__*/_interopDefaultCompat(ColorsPanel);

function ColorPicker(props) {
    const { value, type = "HEX", disabledAlpha, children, usePanel, handle: handle$1 = "both", placeholder = "Colors", popupProps, onChange, } = props;
    const state = ahooks.useReactive({
        type,
        value,
        syncValue: value,
        visible: popupProps?.visible,
    });
    const handleChange = (target) => {
        state.syncValue = target;
    };
    const handleComplete = (target) => {
        const method = footer.ColorMethods[state.type];
        if (target.a !== 1) {
            target.a = parseFloat(target.a.toFixed(3));
        }
        state.value = target[method]?.();
    };
    const handleVisibleChange = (v) => {
        state.visible = v;
        popupProps?.onVisibleChange?.(v);
    };
    const handleTypeChange = (t) => {
        const method = footer.ColorMethods[t];
        state.type = t;
        state.value = state.syncValue[method]?.();
    };
    const handleValueChange = (v) => {
        state.value = v;
        state.syncValue = v;
    };
    const handleOk = () => {
        onChange?.(state.value);
        state.visible = false;
    };
    react.useEffect(() => {
        state.syncValue = value;
        state.value = value;
    }, [value]);
    if (usePanel) {
        return jsxRuntime.jsx(ColorsPanel__default, { ...props });
    }
    return (jsxRuntime.jsx(popup.default, { trigger: 'click', touchable: true, position: 'bottom', ...popupProps, visible: state.visible, content: jsxRuntime.jsx(ColorsPanel__default, { value: state.syncValue, disabledAlpha: disabledAlpha, panelRender: (panel) => {
                return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [panel, jsxRuntime.jsx(footer.default, { value: state.value, type: state.type, onTypeChange: handleTypeChange, onChange: handleValueChange, onOk: handleOk })] }));
            }, onChange: handleChange, onChangeComplete: handleComplete }), onVisibleChange: handleVisibleChange, children: children ?? (jsxRuntime.jsx(handle.default, { color: value, handle: handle$1, placeholder: placeholder })) }));
}

exports.default = ColorPicker;
//# sourceMappingURL=index.js.map
