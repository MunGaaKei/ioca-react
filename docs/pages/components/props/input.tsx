import { Input } from "@p";
import { PInputCommon, PValidateCommon } from "./common";

export const DBasic = {
	demo: () => {
		return (
			<Input
				placeholder='Input'
				style={{ width: 200 }}
				initValue='Hello'
			/>
		);
	},
	code: `<Input placeholder='Input' style={{ width: 200 }} initValue='Hello' />`,
	lang: "xml",
};

export const DNumber = {
	demo: () => {
		return (
			<Input.Number
				placeholder='Number'
				style={{ width: 160 }}
				thousand=','
			/>
		);
	},
	code: `<Input placeholder='Input' style={{ width: 160 }} thousand=',' />`,
	lang: "xml",
};

export const DRange = {
	demo: () => {
		return (
			<Input.Range placeholder={["min", "max"]} style={{ width: 240 }} />
		);
	},
	code: `<Input.Range placeholder={["min", "max"]} style={{ width: 240 }} />`,
	lang: "xml",
};

export const DTextarea = {
	demo: () => {
		return <Input.Textarea style={{ width: 400 }} autoSize />;
	},
	code: `<Input.Textarea  />`,
	lang: "xml",
};

export const PInput = [
	{
		name: "value",
		desc: "值",
		type: ["string"],
	},
	{
		name: "type",
		desc: "输入框类型",
		type: ["HTMLInputElement.type"],
	},
	{
		name: "initValue",
		desc: "初始值",
		type: ["string"],
	},
	...PInputCommon,
	{
		name: "clear",
		desc: "显示清除按钮",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "border",
		desc: "显示边框",
		type: ["boolean"],
		def: "true",
	},
	...PValidateCommon,
	{
		name: "append",
		desc: "在输入框后面加入节点",
		type: ["ReactNode"],
	},
	{
		name: "prepend",
		desc: "在输入框前面加入节点",
		type: ["ReactNode"],
	},
	{
		name: "hideVisible",
		desc: "隐藏可视按钮（在输入框类型 type = password 时有效）",
		type: ["false"],
	},
	{
		name: "onChange",
		desc: "输入框值改变时触发",
		type: ["(value: string, e?: ChangeEvent<HTMLInputElement>) => void"],
		event: true,
	},
	{
		name: "onEnter",
		desc: "按下回车键时触发",
		type: ["() => void"],
		event: true,
	},
];

export const PInputNumber = [
	{
		name: "value",
		desc: "值",
		type: ["number"],
	},
	{
		name: "step",
		desc: "数字变化基数",
		type: ["number"],
	},
	{
		name: "min",
		desc: "最小值",
		type: ["number"],
	},
	{
		name: "max",
		desc: "最大值",
		type: ["number"],
	},
	{
		name: "thousand",
		desc: "千分位符号，一般适用 ','",
		type: ["string"],
	},
	{
		name: "precision",
		desc: "精度",
		type: ["number"],
	},
];

export const PInputRange = [
	{
		name: "value",
		desc: "值",
		type: ["number[]"],
	},
	{
		name: "step",
		desc: "数字变化基数",
		type: ["number"],
	},
	{
		name: "min",
		desc: "最小值",
		type: ["number"],
	},
	{
		name: "max",
		desc: "最大值",
		type: ["number"],
	},
	{
		name: "thousand",
		desc: "千分位符号，一般适用 ','",
		type: ["string"],
	},
	{
		name: "precision",
		desc: "精度",
		type: ["number"],
	},
];

export const PTextarea = [
	{
		name: "value",
		desc: "值",
		type: ["string"],
	},
];
