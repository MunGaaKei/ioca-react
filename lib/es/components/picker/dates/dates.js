import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const Dates = (props) => {
    const { value, month, rangeEnd, hoverDate, weeks = ["一", "二", "三", "四", "五", "六", "日"], renderDate = (date) => date.date(), disabledDate, onDateClick, onDateHover, } = props;
    const today = dayjs();
    const dates = useMemo(() => {
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
    const handleMouseEnter = (date) => {
        if (disabledDate?.(date))
            return;
        onDateHover?.(date);
    };
    return (jsxs(Fragment, { children: [jsx("div", { className: 'i-datepicker-weeks', children: weeks.map((week, i) => (jsx("span", { className: 'i-datepicker-week', children: week }, i))) }), jsx("div", { className: 'i-datepicker-dates', onMouseLeave: () => onDateHover?.(null), children: dates.map((date, i) => {
                    const active = date.isSame(value, "day") || (rangeEnd && date.isSame(rangeEnd, "day"));
                    const isSameMonth = date.isSame(month, "month");
                    const isToday = date.isSame(today, "day");
                    const disabled = disabledDate?.(date);
                    const isBetween = hoverDate && value && ((date.isAfter(value, "day") && date.isBefore(hoverDate, "day")) ||
                        (date.isAfter(hoverDate, "day") && date.isBefore(value, "day")));
                    return (jsx("div", { className: classNames("i-datepicker-item", {
                            "i-datepicker-active": active,
                            "i-datepicker-same-month": isSameMonth,
                            "i-datepicker-today": isToday,
                            "i-datepicker-disabled": disabled,
                            "i-daterange-between": isBetween,
                        }), onMouseEnter: () => handleMouseEnter(date), onClick: () => handleDateClick(date), children: renderDate(date) }, i));
                }) })] }));
};

export { Dates as default };
