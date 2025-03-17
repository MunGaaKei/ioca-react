'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var ahooks = require('ahooks');
var classNames = require('classnames');
var dayjs = require('dayjs');
var radash = require('radash');
var react = require('react');
var icon = require('../../icon/icon.js');
var helpericon = require('../../utils/helpericon/helpericon.js');
var dates = require('./dates.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);
var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const YearMonth = (props) => {
    const { value, unitMonth = "月", unitYear = "年", renderYear, renderMonth, onClick, } = props;
    return (jsxRuntime.jsxs("a", { className: 'i-datepicker-action', "data-ripple": true, onClick: onClick, children: [jsxRuntime.jsx("span", { children: renderYear?.(value.year()) }), unitYear, jsxRuntime.jsx("span", { children: renderMonth?.(value.month() + 1) }), unitMonth] }));
};
const Panel = (props) => {
    const { value, unitYear, unitMonth, renderDate, renderMonth = (m) => m, renderYear = (y) => y, disabledDate, onDateClick, } = props;
    const state = ahooks.useReactive({
        today: value,
        month: value || dayjs__default.default(),
        selectedYear: dayjs__default.default(),
        years: [],
        selectable: false,
    });
    const $years = react.useRef(null);
    const handleOperateMonth = (next) => {
        state.month = state.month[next ? "add" : "subtract"](1, "month");
    };
    const handleChangeDate = (date) => {
        if (date.isSame(state.today, "day"))
            return;
        if (!date.isSame(state.month, "month")) {
            state.month = date;
        }
        state.today = date;
        onDateClick?.(date);
    };
    const handleChangeMonth = (month) => {
        state.month = state.month
            .year(state.selectedYear.year())
            .month(month - 1);
        state.selectable = false;
    };
    const getMoreYears = radash.throttle({ interval: 100 }, (e) => {
        const isUp = e.deltaY < 0;
        state.years = state.years.map((y) => (y += isUp ? -1 : 1));
    });
    react.useEffect(() => {
        if (!state.selectable)
            return;
        state.selectedYear = state.month;
        const y = state.selectedYear.year();
        const years = Array.from({ length: 7 }).map((_, i) => y - 3 + i);
        state.years = [...years];
    }, [state.selectable]);
    react.useEffect(() => {
        state.today = value;
        state.month = value || dayjs__default.default();
    }, [value]);
    return (jsxRuntime.jsxs("div", { className: 'i-datepicker', children: [jsxRuntime.jsxs("div", { className: 'i-datepicker-units', children: [jsxRuntime.jsx(YearMonth, { value: state.month, unitYear: unitYear, unitMonth: unitMonth, renderMonth: renderMonth, renderYear: renderYear, onClick: () => (state.selectable = true) }), jsxRuntime.jsx("a", { className: 'ml-auto i-datepicker-action', "data-ripple": true, onClick: () => handleOperateMonth(false), children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.KeyboardArrowLeftRound, {}) }) }), jsxRuntime.jsx("a", { className: 'i-datepicker-action', "data-ripple": true, onClick: () => handleOperateMonth(true), children: jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.KeyboardArrowRightRound, {}) }) })] }), jsxRuntime.jsxs("div", { className: classNames__default.default("i-datepicker-ym", {
                    "i-datepicker-active": state.selectable,
                }), children: [jsxRuntime.jsx(helpericon.default, { active: true, className: 'i-datepicker-close', onClick: (e) => {
                            e.stopPropagation();
                            state.selectable = false;
                        } }), jsxRuntime.jsx("div", { ref: $years, className: 'i-datepicker-years', onWheel: getMoreYears, children: state.years.map((y) => (jsxRuntime.jsx("a", { className: classNames__default.default("i-datepicker-year", {
                                "i-datepicker-active": y === state.selectedYear.year(),
                            }), onClick: () => (state.selectedYear =
                                state.selectedYear.year(y)), children: renderYear(y) }, y))) }), jsxRuntime.jsx("div", { className: 'i-datepicker-months', children: MONTHS.map((m) => {
                            return (jsxRuntime.jsx("a", { className: classNames__default.default("i-datepicker-month", {
                                    "i-datepicker-active": m === state.month.month() + 1,
                                }), onClick: () => handleChangeMonth(m), children: renderMonth(m) }, m));
                        }) })] }), jsxRuntime.jsx(dates.default, { value: state.today, month: state.month, disabledDate: disabledDate, onDateClick: handleChangeDate, renderDate: renderDate })] }));
};

exports.default = Panel;
//# sourceMappingURL=panel.js.map
