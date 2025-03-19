import { jsx } from 'react/jsx-runtime';
import { AccessTimeRound } from '@ricons/material';
import { useReactive } from 'ahooks';
import { useState, useEffect } from 'react';
import Icon from '../../icon/icon.js';
import Input from '../../input/input.js';
import Popup from '../../popup/popup.js';
import Panel from './panel.js';

const FORMAT = "hh:mm:ss";
function TimePicker(props) {
    const { name, value, format = FORMAT, periods, placeholder = props.format ?? FORMAT, renderItem, onChange, onBlur, popupProps, ...restProps } = props;
    const state = useReactive({
        value,
        safeValue: undefined,
    });
    const [active, setActive] = useState(false);
    const handleChange = (v) => {
        state.value = v;
    };
    const handleFallback = (v) => {
        state.safeValue = v;
    };
    const handleValidTime = () => {
        if (!state.value)
            return;
        state.value = state.safeValue;
        handleChange(state.safeValue);
    };
    const handleBlur = (e) => {
        onBlur?.(e);
        handleValidTime();
    };
    const handleVisibleChange = (v) => {
        popupProps?.onVisibleChange?.(v);
        setActive(v);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    return (jsx(Popup, { visible: active, trigger: 'click', position: 'bottom', arrow: false, align: 'start', watchResize: true, ...popupProps, onVisibleChange: handleVisibleChange, content: jsx(Panel, { value: state.value, format: format, periods: periods, renderItem: renderItem, onChange: handleChange, onFallback: handleFallback }), children: jsx(Input, { value: state.value, placeholder: placeholder, append: jsx(Icon, { icon: jsx(AccessTimeRound, {}), className: 'i-timepicker-icon', size: '1em' }), onChange: handleChange, onBlur: handleBlur, ...restProps }) }));
}

export { TimePicker as default };
//# sourceMappingURL=index.js.map
