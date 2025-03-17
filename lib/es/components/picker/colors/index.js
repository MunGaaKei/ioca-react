import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import ColorsPanel from '@rc-component/color-picker';
import { useReactive } from 'ahooks';
import { useEffect } from 'react';
import Popup from '../../popup/popup.js';
import Footer, { ColorMethods } from './footer.js';
import Handle from './handle.js';

function ColorPicker(props) {
    const { value, type = "HEX", disabledAlpha, children, usePanel, handle = "both", placeholder = "Colors", popupProps, onChange, } = props;
    const state = useReactive({
        type,
        value,
        syncValue: value,
        visible: popupProps?.visible,
    });
    const handleChange = (target) => {
        state.syncValue = target;
    };
    const handleComplete = (target) => {
        const method = ColorMethods[state.type];
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
        const method = ColorMethods[t];
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
    useEffect(() => {
        state.syncValue = value;
        state.value = value;
    }, [value]);
    if (usePanel) {
        return jsx(ColorsPanel, { ...props });
    }
    return (jsx(Popup, { trigger: 'click', touchable: true, position: 'bottom', ...popupProps, visible: state.visible, content: jsx(ColorsPanel, { value: state.syncValue, disabledAlpha: disabledAlpha, panelRender: (panel) => {
                return (jsxs(Fragment, { children: [panel, jsx(Footer, { value: state.value, type: state.type, onTypeChange: handleTypeChange, onChange: handleValueChange, onOk: handleOk })] }));
            }, onChange: handleChange, onChangeComplete: handleComplete }), onVisibleChange: handleVisibleChange, children: children ?? (jsx(Handle, { color: value, handle: handle, placeholder: placeholder })) }));
}

export { ColorPicker as default };
//# sourceMappingURL=index.js.map
