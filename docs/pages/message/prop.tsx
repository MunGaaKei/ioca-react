import { Button, Message } from "@p";
import { draw } from "radash";

export const DBasic = {
	demo: <Button onClick={() => Message(Math.random())}>Click Me</Button>,
	code: `<Button onClick={() => Message(Math.random())}>Click Me</Button>`,
	lang: "xml",
};

export const DTypes = {
	demo: () => {
		const handleClick = () => {
			const color =
				draw([
					"bg-pink",
					"bg-blue",
					"bg-black",
					"bg-green",
					"bg-red",
					"bg-aqua",
				]) ?? "";

			Message({
				content: "从右边打开一条信息",
				align: "right",
				className: color,
				unshift: true,
			});
		};

		return (
			<Button className='bg-pink' onClick={handleClick}>
				Click Me
			</Button>
		);
	},
	code: `const handleClick = () => {
	const color =
		draw([
			"bg-pink",
			"bg-blue",
			"bg-black",
			"bg-green",
			"bg-red",
			"bg-aqua",
		]) ?? "";

	Message({
		content: "从右边打开一条信息",
		align: "right",
		className: color,
		unshift: true,
	});
};

return (
	<Button className='bg-pink' onClick={handleClick}>
		Click Me
	</Button>
);`,
	lang: "javascript",
};

export const DFast = {
	demo: () => {
		const handleClick = () => {
			Message.error("错误信息");
		};

		return (
			<Button className='bg-error' onClick={handleClick}>
				Click Me
			</Button>
		);
	},
	code: `const handleClick = () => {
	Message.error('错误信息')
};

return (
	<Button className='bg-error' onClick={handleClick}>
		Click Me
	</Button>
);`,
	lang: "javascript",
};

export const PMessage = [
	{
		name: "content",
		desc: "显示内容",
		type: ["ReactNode"],
	},
	{
		name: "duration",
		desc: "持续时间，当为 0 时只能通过手动控制消失，单位ms",
		type: ["number"],
		def: 3000,
	},
	{
		name: "gap",
		desc: "消息之间的间隔，单位px",
		type: ["number"],
		def: 12,
	},
	{
		name: "offset",
		desc: "与视窗边距的间隔，可为CSS单位",
		type: ["string"],
		def: "12px",
	},
	// {
	// 	name: "max",
	// 	desc: "最多同时允许多少条消息存在，",
	// 	type: ["number"],
	// 	def: 'Infinity'
	// },
	{
		name: "align",
		desc: "偏向方向",
		type: ["'left'", "'center'", "'right'"],
		def: "'center'",
	},
	{
		name: "unshift",
		desc: "从顶部插入新消息",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "closable",
		desc: "可以通过点击让消息消失",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "className",
		desc: "消息类名",
		type: ["string"],
	},
	{
		name: "onShow",
		desc: "消息显示时触发",
		type: ["() => void"],
		event: true,
	},
	{
		name: "onHide",
		desc: "消息隐藏时触发",
		type: ["() => void"],
		event: true,
	},
];
