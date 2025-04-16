import { Button, Dropdown, Flex, Icon } from "@p";
import {
	AllInclusiveRound,
	KeyboardArrowDownRound,
	LightModeTwotone,
	NightlightTwotone,
} from "@ricons/material";
import { sleep } from "radash";
import { useRef } from "react";

export const DBasic = {
	demo: (
		<Flex gap={8} wrap>
			<Button>Button</Button>
			<Button secondary>Secondary</Button>
			<Button outline>Outline</Button>
			<Button round>Round</Button>
			<Button flat>Flat</Button>
			<Button square>
				<Icon icon={<AllInclusiveRound />} />
			</Button>
			<Button loading>Loading</Button>
			<Button disabled>Disabled</Button>
		</Flex>
	),
	code: `<Button>Button</Button>
<Button secondary>Secondary</Button>
<Button outline>Outline</Button>
<Button round>Round</Button>
<Button flat>Flat</Button>
<Button square>
    <Icon icon={<AllInclusiveRound />} />
</Button>
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>`,
	lang: "xml",
};

export const DColor = {
	demo: (
		<Flex gap={8} wrap>
			<Button className='bg-blue'>Blue</Button>
			<Button className='pink' outline>
				Outline Pink
			</Button>
			<Button className='brown' flat>
				Flat Brown
			</Button>
			<Button className='red bg-yellow'>Mixed Red Yellow</Button>
		</Flex>
	),
	code: `<Button className='bg-blue'>Blue</Button>
<Button className='pink' outline>
    Outline Pink
</Button>
<Button className='brown' flat>
    Flat Brown
</Button>
<Button className='red bg-yellow'>Mixed Red Yellow</Button>`,
	lang: "xml",
};

export const DToggle = {
	demo: () => {
		const ref = useRef<HTMLElement>(null);

		return (
			<Flex gap={8} direction='column' align='flex-start'>
				<Button.Toggle
					ref={ref}
					secondary
					after={<Icon icon={<NightlightTwotone />} />}
				>
					<Icon icon={<LightModeTwotone />} />
				</Button.Toggle>
				<Button.Toggle
					after='Active'
					activeClass='bg-blue'
					onToggle={(v) => {
						console.log(v);
					}}
				>
					Deactive
				</Button.Toggle>
				<Button.Toggle
					className='bg-red'
					activeClass='bg-blue'
					after='Blue'
					toggable={() =>
						new Promise((resolve) => {
							setTimeout(() => {
								resolve(true);
							}, 1000);
						})
					}
				>
					Red
				</Button.Toggle>
			</Flex>
		);
	},
	code: `<Flex gap={12} direction='column' align='flex-start'>
	<Button.Toggle
		secondary
		after={<Icon icon={<NightlightTwotone />} />}
	>
		<Icon icon={<LightModeTwotone />} />
	</Button.Toggle>
	<Button.Toggle
		after='Active'
		activeClass='bg-blue'
		onToggle={(v) => {
			console.log(v);
		}}
	>
		Deactive
	</Button.Toggle>
	<Button.Toggle
		className='bg-red'
		activeClass='bg-blue'
		after='Blue'
		toggable={() =>
			new Promise((resolve) => {
				setTimeout(() => {
					resolve(true);
				}, 1000);
			})
		}
	>
		Red
	</Button.Toggle>
</Flex>`,
	lang: "xml",
};

export const DConfirm = {
	demo: () => {
		const handleDelete = async () => {
			await sleep(1000);
			return true;
		};

		return (
			<Button.Confirm className='bg-error' onOk={handleDelete}>
				删除
			</Button.Confirm>
		);
	},
	code: `const handleDelete = async () => {
	await sleep(1000);
	return true;
};

return (
	<Button.Confirm className='bg-error' onOk={handleDelete}>
		删除
	</Button.Confirm>
);`,
	lang: "javascript",
};

export const DGroup = {
	demo: () => {
		return (
			<Flex gap={4}>
				<Button.Group>
					<Button>按钮</Button>
					<Button className='bg-blue'>蓝色</Button>
					<Button className='bg-yellow'>黄色</Button>
				</Button.Group>
				<Button.Group>
					<Button className='bg-grey'>你好</Button>
					<Dropdown content={<>HELLO</>} align='end'>
						<Button className='bg-grey px-0'>
							<Icon icon={<KeyboardArrowDownRound />} />
						</Button>
					</Dropdown>
				</Button.Group>
			</Flex>
		);
	},
	code: `<Flex gap={4}>
	<Button.Group>
		<Button>按钮</Button>
		<Button className='bg-blue'>蓝色</Button>
		<Button className='bg-yellow'>黄色</Button>
	</Button.Group>
	<Button.Group>
		<Button className='bg-grey'>你好</Button>
		<Dropdown content={<>HELLO</>} align='end'>
			<Button className='bg-grey px-0'>
				<Icon icon={<KeyboardArrowDownRound />} />
			</Button>
		</Dropdown>
	</Button.Group>
</Flex>`,
	lang: "html",
};

export const PButton = [
	{
		name: "as",
		def: "'a'",
		desc: "标签名",
		type: [
			"string",
			<a
				className='blue'
				href='https://reactrouter.com/en/main/components/link#link'
				target='_blank'
			>
				Link
			</a>,
		],
	},
	{
		name: "secondary",
		desc: "次级按钮",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "flat",
		desc: "无背景色按钮",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "outline",
		desc: "边框类型按钮",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "round",
		desc: "圆角",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "block",
		desc: "块级按钮",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "loading",
		desc: "加载状态",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "disabled",
		desc: "禁用状态",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "size",
		desc: "按钮尺寸",
		type: ["mini", "small", "normal", "large", "extreme"],
		def: "'normal'",
	},
	{
		name: "square",
		desc: "等宽高按钮",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "ripple",
		desc: "按钮点击触发波纹效果",
		type: ["boolean"],
		def: "true",
	},
];

export const PButtonToggle = [
	{
		name: "active",
		desc: "激活状态",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "activeClass",
		desc: "激活时添加的className",
		type: ["string"],
	},
	{
		name: "after",
		desc: "激活状态时显示的内容",
		type: ["ReactNode"],
	},
	{
		name: "disabled",
		desc: "禁用状态",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "toggable",
		desc: "是否可切换",
		type: ["() => boolean | Promise<boolean>"],
	},
	{
		name: "onToggle",
		desc: "状态切换时触发",
		type: ["(active: boolean) => void"],
		event: true,
	},
];

export const PButtonConfirm = [
	{
		name: "okButtonProps",
		desc: "确定按钮属性",
		type: [
			<a className='link' href='#button'>
				IButton
			</a>,
		],
	},
	{
		name: "cancelButtonProps",
		desc: "取消按钮属性",
		type: [
			<a className='link' href='#button'>
				IButton
			</a>,
		],
	},
	{
		name: "onOk",
		desc: "确定按钮回调",
		type: ["() => void | boolean | Promise<void | boolean>"],
	},
	{
		name: "onCancel",
		desc: "取消按钮回调",
		type: ["() => void"],
	},
];

export const PButtonGroup = [
	{
		name: "children",
		desc: "按钮组",
		type: ["ReactNode"],
	},
	{
		name: "vertical",
		desc: "垂直方向显示",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "buttonProps",
		desc: "子按钮公用属性",
		type: [
			<a className='blue' href='#button'>
				IButton
			</a>,
		],
	},
];
