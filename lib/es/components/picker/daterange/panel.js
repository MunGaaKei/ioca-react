import { jsxs, jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { useState, useMemo, useEffect } from 'react';
import Panel from '../dates/panel.js';

const DoublePanel = (props) => {
    const { value, weeks, unitYear, unitMonth, renderDate, renderMonth, renderYear, disabledDate, onSelected, } = props;
    const [baseMonth, setBaseMonth] = useState(value?.[0] || dayjs());
    const [startDate, setStartDate] = useState(value?.[0] || null);
    const [endDate, setEndDate] = useState(value?.[1] || null);
    const [selecting, setSelecting] = useState("start");
    const [hoverDate, setHoverDate] = useState(null);
    const nextMonth = useMemo(() => baseMonth.add(1, "month"), [baseMonth]);
    useEffect(() => {
        setStartDate(value?.[0] || null);
        setEndDate(value?.[1] || null);
        setBaseMonth(value?.[0] || dayjs());
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
    return (jsxs("div", { className: 'i-daterange-panel i-daterange-grids', children: [jsx("div", { className: 'i-daterange-col', children: jsx(Panel, { value: startDate, month: baseMonth, rangeEnd: endDate, hoverDate: hoverDate, onDateHover: handleDateHover, weeks: weeks, unitYear: unitYear, unitMonth: unitMonth, renderDate: renderDate, renderMonth: renderMonth, renderYear: renderYear, disabledDate: disabledDate, onDateClick: handleDateClick, onOperateMonth: handleOperateMonth }) }), jsx("div", { className: 'i-daterange-col', children: jsx(Panel, { value: startDate, month: nextMonth, rangeEnd: endDate, hoverDate: hoverDate, onDateHover: handleDateHover, weeks: weeks, unitYear: unitYear, unitMonth: unitMonth, renderDate: renderDate, renderMonth: renderMonth, renderYear: renderYear, disabledDate: disabledDate, onDateClick: handleDateClick, onOperateMonth: handleOperateMonth }) })] }));
};

export { DoublePanel as default };
