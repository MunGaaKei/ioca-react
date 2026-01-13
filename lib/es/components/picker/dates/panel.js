import { jsxs, jsx } from 'react/jsx-runtime';
import { KeyboardArrowLeftRound, KeyboardArrowRightRound } from '@ricons/material';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { throttle } from 'radash';
import { useRef, useEffect } from 'react';
import Icon from '../../icon/icon.js';
import Helpericon from '../../utils/helpericon/helpericon.js';
import Dates from './dates.js';

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const YearMonth = (props) => {
    const { value, unitMonth = "月", unitYear = "年", renderYear, renderMonth, onClick, } = props;
    return (jsxs("a", { className: 'i-datepicker-action', "data-ripple": true, onClick: onClick, children: [jsx("span", { children: renderYear?.(value.year()) }), unitYear, jsx("span", { children: renderMonth?.(value.month() + 1) }), unitMonth] }));
};
const Panel = (props) => {
    const { value, unitYear, unitMonth, renderDate, renderMonth = (m) => m, renderYear = (y) => y, disabledDate, onDateClick, } = props;
    const state = useReactive({
        today: value,
        month: value || dayjs(),
        selectedYear: dayjs(),
        years: [],
        selectable: false,
    });
    const $years = useRef(null);
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
    const getMoreYears = throttle({ interval: 100 }, (e) => {
        const isUp = e.deltaY < 0;
        state.years = state.years.map((y) => (y += isUp ? -1 : 1));
    });
    useEffect(() => {
        if (!state.selectable)
            return;
        state.selectedYear = state.month;
        const y = state.selectedYear.year();
        const years = Array.from({ length: 7 }).map((_, i) => y - 3 + i);
        state.years = [...years];
    }, [state.selectable]);
    useEffect(() => {
        state.today = value;
        state.month = value || dayjs();
    }, [value]);
    return (jsxs("div", { className: 'i-datepicker', children: [jsxs("div", { className: 'i-datepicker-units', children: [jsx(YearMonth, { value: state.month, unitYear: unitYear, unitMonth: unitMonth, renderMonth: renderMonth, renderYear: renderYear, onClick: () => (state.selectable = true) }), jsx("a", { className: 'ml-auto i-datepicker-action', "data-ripple": true, onClick: () => handleOperateMonth(false), children: jsx(Icon, { icon: jsx(KeyboardArrowLeftRound, {}) }) }), jsx("a", { className: 'i-datepicker-action', "data-ripple": true, onClick: () => handleOperateMonth(true), children: jsx(Icon, { icon: jsx(KeyboardArrowRightRound, {}) }) })] }), jsxs("div", { className: classNames("i-datepicker-ym", {
                    "i-datepicker-active": state.selectable,
                }), children: [jsx(Helpericon, { active: true, className: 'i-datepicker-close', onClick: (e) => {
                            e.stopPropagation();
                            state.selectable = false;
                        } }), jsx("div", { ref: $years, className: 'i-datepicker-years', onWheel: getMoreYears, children: state.years.map((y) => (jsx("a", { className: classNames("i-datepicker-year", {
                                "i-datepicker-active": y === state.selectedYear.year(),
                            }), onClick: () => (state.selectedYear =
                                state.selectedYear.year(y)), children: renderYear(y) }, y))) }), jsx("div", { className: 'i-datepicker-months', children: MONTHS.map((m) => {
                            return (jsx("a", { className: classNames("i-datepicker-month", {
                                    "i-datepicker-active": m === state.month.month() + 1,
                                }), onClick: () => handleChangeMonth(m), children: renderMonth(m) }, m));
                        }) })] }), jsx(Dates, { value: state.today, month: state.month, disabledDate: disabledDate, onDateClick: handleChangeDate, renderDate: renderDate })] }));
};

export { Panel as default };
//# sourceMappingURL=panel.js.map
