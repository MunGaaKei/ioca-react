'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var dayjs = require('dayjs');
var react = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);
var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const Dates = (props) => {
    const { value, month, weeks = ["一", "二", "三", "四", "五", "六", "日"], renderDate = (date) => date.date(), disabledDate, onDateClick, } = props;
    const today = dayjs__default.default();
    const dates = react.useMemo(() => {
        const dates = [];
        const lastDateOfLastMonth = month.add(-1, "month").endOf("month");
        let { $W, $D } = lastDateOfLastMonth;
        if ($W !== 0) {
            const lastMonthDates = Array.from({ length: $W }).map((whatever, i) => lastDateOfLastMonth.add(i + 1 - $W, "day"));
            dates.push(...lastMonthDates);
        }
        const lastDate = month.endOf("month");
        $D = lastDate.$D;
        $W = lastDate.$W;
        dates.push(...Array.from({ length: $D }).map((whatever, i) => lastDate.add(i + 1 - $D, "day")));
        if ($W !== 0) {
            dates.push(...Array.from({ length: 7 - $W }).map((whatever, i) => lastDate.add(i + 1, "day")));
        }
        return dates;
    }, [month]);
    const handleDateClick = (date) => {
        if (disabledDate?.(date))
            return;
        onDateClick?.(date);
    };
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("div", { className: 'i-datepicker-weeks', children: weeks.map((week, i) => (jsxRuntime.jsx("span", { className: 'i-datepicker-week', children: week }, i))) }), jsxRuntime.jsx("div", { className: 'i-datepicker-dates', children: dates.map((date, i) => {
                    const active = date.isSame(value, "day");
                    const isSameMonth = date.isSame(month, "month");
                    const isToday = date.isSame(today, "day");
                    const disabled = disabledDate?.(date);
                    return (jsxRuntime.jsx("div", { className: classNames__default.default("i-datepicker-item", {
                            "i-datepicker-active": active,
                            "i-datepicker-same-month": isSameMonth,
                            "i-datepicker-today": isToday,
                            "i-datepicker-disabled": disabled,
                        }), onClick: () => handleDateClick(date), children: renderDate(date) }, i));
                }) })] }));
};

exports.default = Dates;
//# sourceMappingURL=dates.js.map
