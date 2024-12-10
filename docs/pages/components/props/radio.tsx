import { Radio } from "@p";
import { useState } from "react";

export const DBasic = {
	demo: <Radio options={["Cat", "Dog", "Kuma"]} />,
	code: `<Radio options={["Cat", "Dog", "Kuma"]} />`,
	lang: "xml",
};

export const DType = {
	demo: () => {
		const [type, setType] = useState<any>("default");

		return (
			<>
				<Radio
					className='mb-12'
					label='type:'
					value={type}
					options={["default", "button"]}
					labelInline
					onChange={setType}
				/>

				<Radio
					type={type}
					options={["Cat", "Dog", "Kuma"]}
					labelInline
				/>
			</>
		);
	},
	code: `<Radio options={["Cat", "Dog", "Kuma"]} />`,
	lang: "xml",
};

export const PRadio = [
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
		name: "type",
		desc: "类型",
		type: ["default", "button"],
		def: "'default'",
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
];
