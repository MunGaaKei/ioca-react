'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var ahooks = require('ahooks');
var classNames = require('classnames');
var react = require('react');
var icon = require('../../icon/icon.js');
var input = require('../../input/input.js');
var popup = require('../../popup/popup.js');
var panel = require('./panel.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const FORMAT = "hh:mm:ss";
function TimePicker(props) {
    const { name, value, format = FORMAT, periods, placeholder = props.format ?? FORMAT, className, renderItem, onChange, onBlur, popupProps, ...restProps } = props;
    const state = ahooks.useReactive({
        value,
        safeValue: undefined,
    });
    const [active, setActive] = react.useState(false);
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
    react.useEffect(() => {
        state.value = value;
    }, [value]);
    return (jsxRuntime.jsx(popup.default, { visible: active, trigger: 'click', position: 'bottom', arrow: false, align: 'start', watchResize: true, ...popupProps, onVisibleChange: handleVisibleChange, content: jsxRuntime.jsx(panel.default, { value: state.value, format: format, periods: periods, renderItem: renderItem, onChange: handleChange, onFallback: handleFallback }), children: jsxRuntime.jsx(input.default, { value: state.value, placeholder: placeholder, append: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.AccessTimeRound, {}), className: 'i-timepicker-icon', size: '1em' }), onChange: handleChange, onBlur: handleBlur, className: classNames__default("i-timepicker-label", className), ...restProps }) }));
}

exports.default = TimePicker;
//# sourceMappingURL=index.js.map
