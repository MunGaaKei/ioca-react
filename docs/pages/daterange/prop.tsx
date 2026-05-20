import { DateRange } from "@p";
import { useState } from "react";

export const DDateRange = {
    demo: () => {
        const [range, setRange] =
            useState<[string | undefined, string | undefined]>();

        return (
            <DateRange
                value={range}
                onChange={setRange}
                clear
                style={{ width: 240 }}
            />
        );
    },
    code: `const [range, setRange] = useState();

return (
    <DateRange
        value={range}
        onChange={setRange}
        style={{ width: 240 }}
        placeholder="选择日期范围"
    />
);`,
    lang: "javascript",
};

export const PDateRange = [
    {
        name: "value",
        desc: "值，[开始日期, 结束日期]",
        type: ["[string | undefined, string | undefined]"],
    },
    {
        name: "format",
        desc: "日期格式",
        type: ["string"],
        def: "YYYY-MM-DD",
    },
    {
        name: "placeholder",
        desc: "占位符",
        type: ["string"],
        def: '"选择日期范围"',
    },
    {
        name: "weeks",
        desc: "星期渲染数组",
        type: ["ReactNode[]"],
        def: '["一", "二", "三", "四", "五", "六", "日"]',
    },
    {
        name: "renderDate",
        desc: "日期渲染方式",
        type: ["(date: Dayjs) => ReactNode"],
        def: "(date) => date.date()",
    },
    {
        name: "renderMonth",
        desc: "月份渲染方式",
        type: ["(month: number) => ReactNode"],
        def: "m => m",
    },
    {
        name: "renderYear",
        desc: "年份渲染方式",
        type: ["(year: number) => ReactNode"],
        def: "y => y",
    },
    {
        name: "disabledDate",
        desc: "禁用的日期",
        type: ["(date: Dayjs) => boolean"],
    },
    {
        name: "clear",
        desc: "是否显示清除按钮",
        type: ["boolean"],
        def: "false",
    },
    {
        name: "onChange",
        desc: "值改变时触发",
        type: ["(value: [string | undefined, string | undefined]) => void"],
        event: true,
    },
    {
        name: "onClear",
        desc: "点击清除按钮时触发",
        type: ["() => void"],
        event: true,
    },
];
