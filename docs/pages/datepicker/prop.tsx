import { Datepicker } from "@p";

export const DBasic = {
	demo: () => {
		return <Datepicker placeholder='Date' style={{ width: 240 }} />;
	},
	code: `<Datepicker placeholder='Date' style={{ width: 240 }} />`,
	lang: "xml",
};

export const PDatepicker = [
	{
		name: "value",
		desc: "值",
		type: ["string"],
	},
	{
		name: "format",
		desc: "日期格式",
		type: ["string"],
		def: "YYYY-MM-DD",
	},
	{
		name: "weeks",
		desc: "星期渲染数组",
		type: ["ReactNode[]"],
		def: '["一", "二", "三", "四", "五", "六", "日"]',
	},
	{
		name: "unitYear",
		desc: "年单位",
		type: ["ReactNode"],
		def: '"年"',
	},
	{
		name: "unitMonth",
		desc: "月单位",
		type: ["ReactNode"],
		def: '"月"',
	},
	{
		name: "renderDate",
		desc: "日期渲染方式",
		type: [
			<>
				(date:{" "}
				<a
					className='blue'
					href='https://day.js.org/docs/zh-CN/parse/now'
					target='_blank'
				>
					Dayjs
				</a>
				) =&gt; ReactNode
			</>,
		],
		def: "(date) => date.date()",
	},
	{
		name: "renderMonth",
		desc: "月份渲染方式",
		type: ["(month: number) => month"],
		def: "m => m",
	},
	{
		name: "renderYear",
		desc: "年份渲染方式",
		type: ["(year: number) => year"],
		def: "y => y",
	},
	{
		name: "disabledDate",
		desc: "禁用的日期",
		type: [
			<>
				(date:{" "}
				<a
					className='blue'
					href='https://day.js.org/docs/zh-CN/parse/now'
					target='_blank'
				>
					Dayjs
				</a>
				) =&gt; boolean
			</>,
		],
	},
	{
		name: "onDateClick",
		desc: "日期点击事件",
		type: [
			<>
				(date:{" "}
				<a
					className='blue'
					href='https://day.js.org/docs/zh-CN/parse/now'
					target='_blank'
				>
					Dayjs
				</a>
				) =&gt; void
			</>,
		],
		event: true,
	},
];
