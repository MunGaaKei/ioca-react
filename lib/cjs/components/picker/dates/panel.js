'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var classNames = require('classnames');
var dayjs = require('dayjs');
var radash = require('radash');
var react = require('react');
var icon = require('../../icon/icon.js');
var helpericon = require('../../utils/helpericon/helpericon.js');
var dates = require('./dates.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);
var dayjs__default = /*#__PURE__*/_interopDefaultCompat(dayjs);

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const YearMonth = (props) => {
    const { value, unitMonth = "月", unitYear = "年", renderYear, renderMonth, onClick, } = props;
    return (jsxRuntime.jsxs("a", { className: 'i-datepicker-action', "data-ripple": true, onClick: onClick, children: [jsxRuntime.jsx("span", { children: renderYear?.(value.year()) }), unitYear, jsxRuntime.jsx("span", { children: renderMonth?.(value.month() + 1) }), unitMonth] }));
};
const Panel = (props) => {
    const { value, unitYear, unitMonth, renderDate, renderMonth = (m) => m, renderYear = (y) => y, disabledDate, onDateClick, } = props;
    const [today, setToday] = react.useState(value);
    const [month, setMonth] = react.useState(value || dayjs__default());
    const [selectedYear, setSelectedYear] = react.useState(dayjs__default());
    const [years, setYears] = react.useState([]);
    const [selectable, setSelectable] = react.useState(false);
    const $years = react.useRef(null);
    const handleOperateMonth = (next) => {
        setMonth((m) => m[next ? "add" : "subtract"](1, "month"));
    };
    const handleChangeDate = (date) => {
        if (date.isSame(today, "day"))
            return;
        if (!date.isSame(month, "month")) {
            setMonth(date);
        }
        setToday(date);
        onDateClick?.(date);
    };
    const handleChangeMonth = (month) => {
        setMonth((m) => m.year(selectedYear.year()).month(month - 1));
        setSelectable(false);
    };
    const getMoreYears = radash.throttle({ interval: 100 }, (e) => {
        const isUp = e.deltaY < 0;
        setYears((ys) => ys.map((y) => y + (isUp ? -1 : 1)));
    });
    react.useEffect(() => {
        if (!selectable)
            return;
        setSelectedYear(month);
        const y = month.year();
        const nextYears = Array.from({ length: 7 }).map((_, i) => y - 3 + i);
        setYears([...nextYears]);
    }, [selectable, month]);
    react.useEffect(() => {
        setToday(value);
        setMonth(value || dayjs__default());
    }, [value]);
    return (jsxRuntime.jsxs("div", { className: 'i-datepicker', children: [jsxRuntime.jsxs("div", { className: 'i-datepicker-units', children: [jsxRuntime.jsx(YearMonth, { value: month, unitYear: unitYear, unitMonth: unitMonth, renderMonth: renderMonth, renderYear: renderYear, onClick: () => setSelectable(true) }), jsxRuntime.jsx("a", { className: 'ml-auto i-datepicker-action', "data-ripple": true, onClick: () => handleOperateMonth(false), children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.KeyboardArrowLeftRound, {}) }) }), jsxRuntime.jsx("a", { className: 'i-datepicker-action', "data-ripple": true, onClick: () => handleOperateMonth(true), children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.KeyboardArrowRightRound, {}) }) })] }), jsxRuntime.jsxs("div", { className: classNames__default("i-datepicker-ym", {
                    "i-datepicker-active": selectable,
                }), children: [jsxRuntime.jsx(helpericon.default, { active: true, className: 'i-datepicker-close', onClick: (e) => {
                            e.stopPropagation();
                            setSelectable(false);
                        } }), jsxRuntime.jsx("div", { ref: $years, className: 'i-datepicker-years', onWheel: getMoreYears, children: years.map((y) => (jsxRuntime.jsx("a", { className: classNames__default("i-datepicker-year", {
                                "i-datepicker-active": y === selectedYear.year(),
                            }), onClick: () => setSelectedYear((sy) => sy.year(y)), children: renderYear(y) }, y))) }), jsxRuntime.jsx("div", { className: 'i-datepicker-months', children: MONTHS.map((m) => {
                            return (jsxRuntime.jsx("a", { className: classNames__default("i-datepicker-month", {
                                    "i-datepicker-active": m === month.month() + 1,
                                }), onClick: () => handleChangeMonth(m), children: renderMonth(m) }, m));
                        }) })] }), jsxRuntime.jsx(dates.default, { value: today, month: month, disabledDate: disabledDate, onDateClick: handleChangeDate, renderDate: renderDate })] }));
};

exports.default = Panel;
//# sourceMappingURL=panel.js.map
