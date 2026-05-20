'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat.js');
var react = require('react');
var icon = require('../../icon/icon.js');
var input = require('../../input/input.js');
var popup = require('../../popup/popup.js');
var panel = require('./panel.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);
var dayjs__default = /*#__PURE__*/_interopDefaultCompat(dayjs);
var customParseFormat__default = /*#__PURE__*/_interopDefaultCompat(customParseFormat);

dayjs__default.extend(customParseFormat__default);
const DateRange = (props) => {
    const { value, format = "YYYY-MM-DD", placeholder = "选择日期范围", className, disabledDate, onChange, clear, onClear: onClearProp, weeks, unitYear, unitMonth, renderDate, renderMonth, renderYear, ...restProps } = props;
    const [active, setActive] = react.useState(false);
    const inputValue = react.useMemo(() => {
        if (value?.[0] && value?.[1]) {
            return `${value[0]} ~ ${value[1]}`;
        }
        if (value?.[0]) {
            return `${value[0]} ~ `;
        }
        return "";
    }, [value]);
    const dayJsValue = react.useMemo(() => {
        const start = value?.[0] ? dayjs__default(value[0], format, true) : null;
        const end = value?.[1] ? dayjs__default(value[1], format, true) : null;
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
    return (jsxRuntime.jsx(popup.default, { visible: active, trigger: 'click', position: 'bottom', arrow: false, align: 'start', onVisibleChange: handleVisibleChange, content: jsxRuntime.jsx(panel.default, { value: dayJsValue, weeks: weeks, unitYear: unitYear, unitMonth: unitMonth, renderDate: renderDate, renderMonth: renderMonth, renderYear: renderYear, disabledDate: disabledDate, onSelected: handleSelected }), children: jsxRuntime.jsx(input.default, { value: inputValue, placeholder: placeholder, readOnly: true, clear: clear, onClear: handleClear, append: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.CalendarMonthTwotone, {}), className: 'i-datepicker-icon', size: '1em' }), className: classNames__default("i-datepicker-label", className), ...restProps }) }));
};

exports.default = DateRange;
//# sourceMappingURL=daterange.js.map
