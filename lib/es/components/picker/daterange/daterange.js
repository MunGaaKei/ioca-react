import { jsx } from 'react/jsx-runtime';
import { CalendarMonthTwotone } from '@ricons/material';
import classNames from 'classnames';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { useState, useMemo } from 'react';
import Icon from '../../icon/icon.js';
import Input from '../../input/input.js';
import Popup from '../../popup/popup.js';
import DoublePanel from './panel.js';

dayjs.extend(customParseFormat);
const DateRange = (props) => {
    const { value, format = "YYYY-MM-DD", placeholder = "选择日期范围", className, disabledDate, onChange, clear, onClear: onClearProp, weeks, unitYear, unitMonth, renderDate, renderMonth, renderYear, ...restProps } = props;
    const [active, setActive] = useState(false);
    const inputValue = useMemo(() => {
        if (value?.[0] && value?.[1]) {
            return `${value[0]} ~ ${value[1]}`;
        }
        if (value?.[0]) {
            return `${value[0]} ~ `;
        }
        return "";
    }, [value]);
    const dayJsValue = useMemo(() => {
        const start = value?.[0] ? dayjs(value[0], format, true) : null;
        const end = value?.[1] ? dayjs(value[1], format, true) : null;
        if (start?.isValid() || end?.isValid()) {
            return [start?.isValid() ? start : null, end?.isValid() ? end : null];
        }
        return null;
    }, [value, format]);
    const handleSelected = (dates) => {
        const formatted = dates.map((d) => d.format(format));
        onChange?.([formatted[0], formatted[1]]);
        setActive(false);
    };
    const handleVisibleChange = (v) => {
        setActive(v);
    };
    const handleClear = () => {
        onChange?.([undefined, undefined]);
        setActive(false);
        onClearProp?.();
    };
    return (jsx(Popup, { visible: active, trigger: 'click', position: 'bottom', arrow: false, align: 'start', onVisibleChange: handleVisibleChange, content: jsx(DoublePanel, { value: dayJsValue, weeks: weeks, unitYear: unitYear, unitMonth: unitMonth, renderDate: renderDate, renderMonth: renderMonth, renderYear: renderYear, disabledDate: disabledDate, onSelected: handleSelected }), children: jsx(Input, { value: inputValue, placeholder: placeholder, readOnly: true, clear: clear, onClear: handleClear, append: jsx(Icon, { icon: jsx(CalendarMonthTwotone, {}), className: 'i-datepicker-icon', size: '1em' }), className: classNames("i-datepicker-label", className), ...restProps }) }));
};

export { DateRange as default };
//# sourceMappingURL=daterange.js.map
