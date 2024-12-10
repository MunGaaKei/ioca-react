import { Select } from "@p";

export const DBasic = {
	demo: (
		<Select
			options={["Cat", "Dog", "Kuma"]}
			style={{ width: 200 }}
			placeholder='Select'
		/>
	),
	code: `<Select
    options={["Cat", "Dog", "Kuma"]}
    style={{ width: 200 }}
    placeholder='Select'
/>`,
	lang: "xml",
};

export const DMultiple = {
	demo: () => (
		<Select
			filter
			options={[
				{
					label: "Cat",
					value: "Cat",
				},
				{
					label: "Dog",
					value: "Dog",
				},
				{
					label: "Kuma",
					value: "Kuma",
				},
				{
					label: "Lion",
					value: "Lion",
					disabled: true,
				},
				{
					label: "Tiger",
					value: "Tiger",
				},
			]}
			style={{ width: 400 }}
			multiple
			placeholder='Select'
		/>
	),
	code: `<Select
	filter
	options={[
		{
			label: "Cat",
			value: "Cat",
		},
		{
			label: "Dog",
			value: "Dog",
		},
		{
			label: "Kuma",
			value: "Kuma",
		},
		{
			label: "Lion",
			value: "Lion",
			disabled: true,
		},
		{
			label: "Tiger",
			value: "Tiger",
		},
	]}
	style={{ width: 400 }}
	multiple
	placeholder='Select'
/>`,
	lang: "xml",
};

export const PSelect = [
	{
		name: "value",
		desc: "值",
		type: ["any"],
	},
	{
		name: "options",
		desc: "选项",
		type: [
			<a href='/docs/form#TOption' className='blue'>
				TOption
			</a>,
			"(number | string)[]",
		],
		required: true,
	},
	{
		name: "label",
		desc: "标签",
		type: ["ReactNode"],
	},
	{
		name: "multiple",
		desc: "多选模式",
		type: ["boolean"],
		def: "false",
	},
	// {
	// 	name: "max",
	// 	desc: "最多可以选多少个",
	// 	type: ["number"],
	// },
	{
		name: "maxDisplay",
		desc: "多选时，最多显示多少个值",
		type: ["number"],
		def: 3,
	},
	{
		name: "filter",
		desc: "过滤功能",
		type: [
			"boolean",
			<>
				(option:&nbsp;
				<a href='/docs/form#TOption' className='blue'>
					TOption
				</a>
				, i: number ) =&gt; boolean
			</>,
		],
	},
	{
		name: "filterPlaceholder",
		desc: "过滤输入框placeholder",
		type: ["string"],
		def: "'...'",
	},
	{
		name: "empty",
		desc: "过滤时无结果时显示内容",
		type: ["ReactNode"],
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
		name: "optionInline",
		desc: "选项显示为行内元素",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "labelInline",
		desc: "标签与选项显示在同一行",
		type: ["boolean"],
	},
	{
		name: "disabled",
		desc: "禁用状态",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "status",
		desc: "控件状态",
		type: ["normal", "warning", "error", "success"],
		def: "'normal'",
	},
	{
		name: "message",
		desc: "控件显示信息",
		type: ["ReactNode"],
	},
	{
		name: "onChange",
		desc: "值发生改变时触发",
		type: [
			<>
				(value: any[], option:&nbsp;
				<a href='/docs/form#TOption' className='blue'>
					TOption
				</a>
				, e: ChangeEvent&lt;HTMLInputElement&gt; ) =&gt; void
			</>,
		],
		event: true,
	},
	{
		name: "onSelect",
		desc: "选择选项时触发",
		type: ["(v: any, option?: TOption) => void"],
		event: true,
	},
];
