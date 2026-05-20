'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var react = require('react');
var panel = require('../dates/panel.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var dayjs__default = /*#__PURE__*/_interopDefaultCompat(dayjs);

const DoublePanel = (props) => {
    const { value, weeks, unitYear, unitMonth, renderDate, renderMonth, renderYear, disabledDate, onSelected, } = props;
    const [baseMonth, setBaseMonth] = react.useState(value?.[0] || dayjs__default());
    const [startDate, setStartDate] = react.useState(value?.[0] || null);
    const [endDate, setEndDate] = react.useState(value?.[1] || null);
    const [selecting, setSelecting] = react.useState("start");
    const [hoverDate, setHoverDate] = react.useState(null);
    const nextMonth = react.useMemo(() => baseMonth.add(1, "month"), [baseMonth]);
    react.useEffect(() => {
        setStartDate(value?.[0] || null);
        setEndDate(value?.[1] || null);
        setBaseMonth(value?.[0] || dayjs__default());
    }, [value]);
    const handleDateClick = (date) => {
        if (selecting === "start") {
            setStartDate(date);
            setSelecting("end");
        }
        else {
            let start = startDate || date;
            let end = date;
            if (start.isAfter(end)) {
                [start, end] = [end, start];
            }
            setEndDate(end);
            setSelecting("start");
            onSelected?.([start, end]);
        }
    };
    const handleDateHover = (date) => {
        if (selecting === "end" && startDate) {
            setHoverDate(date);
        }
    };
    const handleOperateMonth = (next) => {
        setBaseMonth((m) => m[next ? "add" : "subtract"](1, "month"));
    };
    return (jsxRuntime.jsxs("div", { className: 'i-daterange-panel i-daterange-grids', children: [jsxRuntime.jsx("div", { className: 'i-daterange-col', children: jsxRuntime.jsx(panel.default, { value: startDate, month: baseMonth, rangeEnd: endDate, hoverDate: hoverDate, onDateHover: handleDateHover, weeks: weeks, unitYear: unitYear, unitMonth: unitMonth, renderDate: renderDate, renderMonth: renderMonth, renderYear: renderYear, disabledDate: disabledDate, onDateClick: handleDateClick, onOperateMonth: handleOperateMonth }) }), jsxRuntime.jsx("div", { className: 'i-daterange-col', children: jsxRuntime.jsx(panel.default, { value: startDate, month: nextMonth, rangeEnd: endDate, hoverDate: hoverDate, onDateHover: handleDateHover, weeks: weeks, unitYear: unitYear, unitMonth: unitMonth, renderDate: renderDate, renderMonth: renderMonth, renderYear: renderYear, disabledDate: disabledDate, onDateClick: handleDateClick, onOperateMonth: handleOperateMonth }) })] }));
};

exports.default = DoublePanel;
//# sourceMappingURL=panel.js.map
