import { jsx } from 'react/jsx-runtime';
import { AccessTimeRound } from '@ricons/material';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import Icon from '../../icon/icon.js';
import Input from '../../input/input.js';
import Popup from '../../popup/popup.js';
import Panel from './panel.js';

const FORMAT = "hh:mm:ss";
function TimePicker(props) {
    const { name, value, format = FORMAT, periods, placeholder = props.format ?? FORMAT, className, renderItem, onChange, onBlur, popupProps, ...restProps } = props;
    const [timeValue, setTimeValue] = useState(value);
    const [safeValue, setSafeValue] = useState(undefined);
    const [active, setActive] = useState(false);
    const handleChange = (v) => {
        setTimeValue(v);
    };
    const handleFallback = (v) => {
        setSafeValue(v);
    };
    const handleValidTime = () => {
        if (!timeValue)
            return;
        setTimeValue(safeValue);
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
        setTimeValue(value);
    }, [value]);
    return (jsx(Popup, { visible: active, trigger: 'click', position: 'bottom', arrow: false, align: 'start', watchResize: true, ...popupProps, onVisibleChange: handleVisibleChange, content: jsx(Panel, { value: timeValue, format: format, periods: periods, renderItem: renderItem, onChange: handleChange, onFallback: handleFallback }), children: jsx(Input, { value: timeValue, placeholder: placeholder, append: jsx(Icon, { icon: jsx(AccessTimeRound, {}), className: 'i-timepicker-icon', size: '1em' }), onChange: handleChange, onBlur: handleBlur, className: classNames("i-timepicker-label", className), ...restProps }) }));
}

export { TimePicker as default };
//# sourceMappingURL=index.js.map
