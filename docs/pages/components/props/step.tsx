import { Checkbox, Step } from "@p";
import { useReactive } from "ahooks";

export const DBasic = {
	demo: () => {
		const state = useReactive({
			active: 0,
			vertical: false,
		});

		return (
			<>
				<Checkbox.Item
					type='switch'
					label='vertical'
					value={state.vertical}
					onChange={(v) => (state.vertical = v)}
				/>

				<Step
					active={state.active}
					onClick={(n) => (state.active = n)}
					vertical={state.vertical}
					className='mt-20'
				>
					<Step.Item title={<h4>提交</h4>}>
						<p className='color-5'>已提交成功 ✌️</p>
					</Step.Item>
					<Step.Item title={<h4>审核中</h4>}>
						<p className='color-5'>还在审核中 😊</p>
					</Step.Item>
					<Step.Item title={<h4>通过</h4>}>
						<p className='color-5'>通过啦 👌</p>
					</Step.Item>
				</Step>
			</>
		);
	},
	code: `const state = useReactive({
	active: 0,
	vertical: false,
});

return (
	<>
		<Checkbox.Item
			type='switch'
			label='vertical'
			value={state.vertical}
			onChange={(v) => (state.vertical = v)}
		/>

		<Step
			active={state.active}
			onClick={(n) => (state.active = n)}
			vertical={state.vertical}
			className='mt-20'
		>
			<Step.Item title={<h4>提交</h4>}>
				<p className='color-5'>已提交成功 ✌️</p>
			</Step.Item>
			<Step.Item title={<h4>审核中</h4>}>
				<p className='color-5'>还在审核中 😊</p>
			</Step.Item>
			<Step.Item title={<h4>通过</h4>}>
				<p className='color-5'>通过啦 👌</p>
			</Step.Item>
		</Step>
	</>
);`,
	lang: "javascript",
};

export const PStep = [
	{
		name: "active",
		desc: "当前索引",
		type: ["number"],
	},
	{
		name: "vertical",
		desc: "垂直显示",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "divider",
		desc: "辅助线",
		type: ["ReactNode"],
	},
	{
		name: "renderIcon",
		desc: "渲染图标",
		type: [
			"(i: number, status: 'pending' | 'active' | 'finished' ) => ReactNode",
		],
	},
	{
		name: "onClick",
		desc: "点击时触发",
		type: ["(i: number) => void"],
		event: true,
	},
];

export const PStepItem = [
	{
		name: "index",
		desc: "索引",
		type: ["number"],
	},
	{
		name: "title",
		desc: "标题",
		type: ["ReactNode"],
	},
	{
		name: "children",
		desc: "内容",
		type: ["ReactNode"],
	},
];
