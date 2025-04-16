import { jsx } from 'react/jsx-runtime';
import { CalendarMonthTwotone } from '@ricons/material';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { useState, useMemo, useEffect } from 'react';
import Icon from '../../icon/icon.js';
import Input from '../../input/input.js';
import Popup from '../../popup/popup.js';
import Panel from './panel.js';

dayjs.extend(customParseFormat);
const FORMATTYPES = ["YYYY-MM-DD", "YYYY-M-D", "YYYY/MM/DD", "YYYY/M/D"];
const FORMAT = "YYYY-MM-DD";
const Datepicker = (props) => {
    const { name, value, weeks, format = FORMAT, placeholder = props.format ?? FORMAT, className, renderDate, renderMonth, renderYear, popupProps, disabledDate, onDateClick, onChange, onBlur, ...restProps } = props;
    const state = useReactive({
        value,
    });
    const [active, setActive] = useState(false);
    const dayJsValue = useMemo(() => {
        if (!state.value)
            return null;
        const date = dayjs(state.value, format, true);
        if (date.isValid())
            return date;
        return null;
    }, [state.value]);
    const handleDateClick = (date) => {
        handleChange(date.format(format));
    };
    const handleChange = (v) => {
        state.value = v;
        onChange?.(v);
    };
    const handleSetDate = () => {
        if (!state.value)
            return;
        const date = dayjs(state.value, FORMATTYPES, true);
        if (date.isValid()) {
            handleChange(date.format(format));
            return;
        }
        handleChange("");
    };
    const handleBlur = (e) => {
        onBlur?.(e);
        handleSetDate();
    };
    const handleVisibleChange = (v) => {
        popupProps?.onVisibleChange?.(v);
        setActive(v);
    };
    useEffect(() => {
        state.value = value;
    }, [value]);
    return (jsx(Popup, { visible: active, trigger: 'click', position: 'bottom', arrow: false, align: 'start', onVisibleChange: handleVisibleChange, watchResize: true, content: jsx(Panel, { value: dayJsValue, weeks: weeks, renderDate: renderDate, renderMonth: renderMonth, renderYear: renderYear, disabledDate: disabledDate, onDateClick: handleDateClick }), ...popupProps, children: jsx(Input, { value: state.value, append: jsx(Icon, { icon: jsx(CalendarMonthTwotone, {}), className: 'i-datepicker-icon', size: '1em' }), placeholder: placeholder, onChange: handleChange, onBlur: handleBlur, onEnter: handleSetDate, className: classNames("i-datepicker-label", className), ...restProps }) }));
};

export { Datepicker as default };
//# sourceMappingURL=index.js.map
