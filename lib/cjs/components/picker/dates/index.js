'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var ahooks = require('ahooks');
var dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat.js');
var react = require('react');
var icon = require('../../icon/icon.js');
require('../../input/index.js');
var popup = require('../../popup/popup.js');
var panel = require('./panel.js');
var input = require('../../input/input.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);
var customParseFormat__default = /*#__PURE__*/_interopDefault(customParseFormat);

dayjs__default.default.extend(customParseFormat__default.default);
const FORMATTYPES = ["YYYY-MM-DD", "YYYY-M-D", "YYYY/MM/DD", "YYYY/M/D"];
const FORMAT = "YYYY-MM-DD";
const Datepicker = (props) => {
    const { name, value, weeks, format = FORMAT, placeholder = props.format ?? FORMAT, renderDate, renderMonth, renderYear, popupProps, disabledDate, onDateClick, onChange, onBlur, ...restProps } = props;
    const state = ahooks.useReactive({
        value,
    });
    const [active, setActive] = react.useState(false);
    const dayJsValue = react.useMemo(() => {
        if (!state.value)
            return null;
        const date = dayjs__default.default(state.value, format, true);
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
        const date = dayjs__default.default(state.value, FORMATTYPES, true);
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
    react.useEffect(() => {
        state.value = value;
    }, [value]);
    return (jsxRuntime.jsx(popup.default, { visible: active, trigger: 'click', position: 'bottom', arrow: false, align: 'start', onVisibleChange: handleVisibleChange, watchResize: true, content: jsxRuntime.jsx(panel.default, { value: dayJsValue, weeks: weeks, renderDate: renderDate, renderMonth: renderMonth, renderYear: renderYear, disabledDate: disabledDate, onDateClick: handleDateClick }), ...popupProps, children: jsxRuntime.jsx(input.default, { value: state.value, append: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.CalendarMonthTwotone, {}), className: 'i-datepicker-icon', size: '1em' }), placeholder: placeholder, onChange: handleChange, onBlur: handleBlur, onEnter: handleSetDate, ...restProps }) }));
};

exports.default = Datepicker;
//# sourceMappingURL=index.js.map
