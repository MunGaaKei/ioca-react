import { ColorPicker, DatePicker, Flex, TimePicker } from "@p";
import { useState } from "react";

export const DDates = {
	demo: () => {
		return <DatePicker style={{ width: 240 }} />;
	},
	code: `<DatePicker style={{ width: 240 }} />`,
	lang: "xml",
};

export const DTime = {
	demo: () => {
		return (
			<Flex gap={12}>
				<TimePicker style={{ width: 240 }} format='mm:ss' />
				<TimePicker style={{ width: 240 }} periods={["Am", "Pm"]} />
			</Flex>
		);
	},
	code: `<Flex gap={12}>
	<TimePicker style={{ width: 240 }} format='mm:ss' />
	<TimePicker style={{ width: 240 }} periods={["Am", "Pm"]} />
</Flex>`,
	lang: "xml",
};

export const DColors = {
	demo: () => {
		const [color, setColor] = useState();

		return <ColorPicker value={color} onChange={setColor} />;
	},
	code: `const [color, setColor] = useState();

return <ColorPicker value={color} onChange={setColor} />;`,
	lang: "javascript",
};

export const PDates = [
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
		name: "popupProps",
		desc: "弹出组件属性",
		type: [
			<a href='/docs/popup#api' className='blue'>
				IPopup
			</a>,
		],
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
	{
		name: "onChange",
		desc: "输入框值改变时触发",
		type: ["(value: string, e: ChangeEvent<HTMLInputElement>) => void"],
		event: true,
	},
];

export const PTime = [
	{
		name: "value",
		desc: "值",
		type: ["string"],
	},
	{
		name: "format",
		desc: "时间格式，也支持 h、m、s，区别是小于10时是否补0。同时也根据这个设置显示可选时间单位。",
		type: ["string"],
		def: "hh:mm:ss",
	},
	{
		name: "periods",
		desc: "是否显示上下午时区，比如：['Am', 'Pm']",
		type: ["[string, string]"],
	},
	{
		name: "renderItem",
		desc: "渲染数字方式",
		type: [
			"(n: number, active: boolean, unit: 'hour' | 'minute' | 'second') => ReactNode",
		],
	},
	{
		name: "popupProps",
		desc: "弹出组件属性",
		type: [
			<a href='/docs/popup#api' className='blue'>
				IPopup
			</a>,
		],
	},
	{
		name: "onChange",
		desc: "输入框值改变时触发",
		type: ["(value: string, e: ChangeEvent<HTMLInputElement>) => void"],
		event: true,
	},
];

export const PColor = [
	{
		name: "value",
		desc: "值",
		type: ["string"],
	},
	{
		name: "type",
		desc: "颜色类型",
		type: ["'HEX'", "'RGB'", "'HSB'"],
		def: "'HEX'",
	},
	{
		name: "usePanel",
		desc: "仅显示色板",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "handle",
		desc: "显示方式",
		type: ["'text'", "'square'", "'both'"],
		def: "'square'",
	},
	{
		name: "placeholder",
		desc: "显示文本时的占位符",
		type: ["ReactNode"],
		def: "'Colors'",
	},
	{
		name: "popupProps",
		desc: "弹出组件属性",
		type: [
			<a href='/docs/popup#api' className='blue'>
				IPopup
			</a>,
		],
	},
	{
		name: "onChange",
		desc: "输入框值改变时触发",
		type: ["(value: string, e: ChangeEvent<HTMLInputElement>) => void"],
		event: true,
	},
];
