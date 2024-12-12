import { Text } from "@p";

export const DBasic = {
	demo: () => {
		return (
			<Text weight={600} gradient={["45deg", "blue", "aqua"]}>
				GRADIENT TEXT
			</Text>
		);
	},
	code: `<Text weight={600} gradient={["45deg", "blue", "aqua"]}>
    GRADIENT TEXT
</Text>`,
	lang: "xml",
};

export const DHighLight = {
	demo: () => {
		return <></>;
	},
	code: ``,
	lang: "xml",
};

export const DNumber = {
	demo: () => {
		return (
			<>
				<Text.Number count={0} to={10000} size={40} weight='600' />
				<br />
				<Text.Number
					count={152323000.24444}
					decimal={3}
					className='opacity-5'
				/>
			</>
		);
	},
	code: `<Text.Number count={0} to={10000} size={40} weight='600' />
<br />
<Text.Number
    count={152323000.24444}
    decimal={3}
    className='opacity-5'
/>`,
	lang: "xml",
};

export const DTime = {
	demo: () => {
		return <Text.Time seconds={500} />;
	},
	code: `<Text.Time time={500} />`,
	lang: "xml",
};

export const PText = [
	{
		name: "as",
		desc: "标签类型",
		type: ["string"],
		def: "'span'",
	},
	{
		name: "size",
		desc: "字体大小，即 font-size",
		type: ["string", "number"],
	},
	{
		name: "decoration",
		desc: "文字装饰，即 text-decoration",
		type: ["string"],
	},
	{
		name: "weight",
		desc: "字体粗细，即 font-weight",
		type: ["string", "number"],
	},
	{
		name: "gradient",
		desc: "文字渐变，即 linear-gradient，第一个可为角度，后面依次为颜色",
		type: ["string[]"],
	},
];

export const PTextNumber = [
	{
		name: "count",
		desc: "数量，或初始数量",
		type: ["number"],
	},
	{
		name: "to",
		desc: "目标数量，当设置时会触发动画效果",
		type: ["number"],
	},
	{
		name: "decimal",
		desc: "精度，保留小数位",
		type: ["number"],
		def: "0",
	},
	{
		name: "thousand",
		desc: "千分位符号",
		type: ["string"],
		def: "','",
	},
	{
		name: "duration",
		desc: "触发动画时，动画持续时间，单位ms",
		type: ["number"],
		def: "2400",
	},
	{
		name: "easing",
		desc: "动画函数",
		type: ["(x: number) => number"],
	},
];

export const PTextTime = [
	{
		name: "seconds",
		desc: "多少秒",
		type: ["number"],
	},
	{
		name: "zero",
		desc: "小于十位数时补0",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "units",
		desc: "时分秒单位后缀",
		type: ["string[]"],
		def: '["", ":", ":"]',
	},
];
