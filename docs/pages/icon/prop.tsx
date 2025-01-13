import { Icon } from "@p";
import { DownhillSkiingRound } from "@ricons/material";

export const DBasic = {
	demo: <Icon icon={<DownhillSkiingRound />} size='5em' rotate={-45} />,
	code: `<Icon icon={<DownhillSkiingRound />} size='5em' rotate={-45} />`,
	lang: "xml",
};

export const PIcon = [
	{
		name: "icon",
		desc: "建议传 SVG",
		type: ["ReactNode"],
		required: true,
	},
	{
		name: "size",
		desc: "实际是改变宽高度",
		type: ["string"],
		def: "'1.425em'",
	},
	{
		name: "rotate",
		desc: "旋转角度",
		type: ["number"],
	},
];
