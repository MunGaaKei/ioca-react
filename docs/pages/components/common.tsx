export const PInputCommon = [
	{
		name: "label",
		desc: "标签",
		type: ["ReactNode"],
	},
	{
		name: "labelInline",
		desc: "标签与输入框同一行",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "disabled",
		desc: "禁用状态",
		type: ["boolean"],
		def: "false",
	},
];

export const PValidateCommon = [
	{
		name: "status",
		desc: "控件状态",
		type: ["normal", "warning", "error", "success"],
		def: "'normal'",
	},
	{
		name: "message",
		desc: "控件校验信息提示，优先级高于tip，为校验信息保留位",
		type: ["ReactNode"],
	},
	{
		name: "tip",
		desc: "控件正常信息提示",
		type: ["ReactNode"],
	},
];
