import { Flex, List } from "@p";
import { AudiotrackOutlined } from "@ricons/material";

export const DBasic = {
	demo: () => {
		return (
			<Flex justify='space-evenly'>
				<List label={(i) => i + 1}>
					<List.Item>鐘聲響起歸家的信號</List.Item>
					<List.Item>在他生命裡 彷彿帶點唏噓</List.Item>
					<List.Item>黑色肌膚給他的意義</List.Item>
					<List.Item>是一生奉獻 膚色鬥爭中</List.Item>
				</List>
				<List label={<AudiotrackOutlined height={16} />}>
					<List.Item>年月把擁有變做失去</List.Item>
					<List.Item>疲倦的雙眼帶著期望</List.Item>
				</List>
			</Flex>
		);
	},
	code: `<Flex justify='space-evenly'>
	<List label={(i) => i + 1}>
		<List.Item>鐘聲響起歸家的信號</List.Item>
		<List.Item>在他生命裡 彷彿帶點唏噓</List.Item>
		<List.Item>黑色肌膚給他的意義</List.Item>
		<List.Item>是一生奉獻 膚色鬥爭中</List.Item>
	</List>
	<List label={<AudiotrackOutlined height={16} />}>
		<List.Item>年月把擁有變做失去</List.Item>
		<List.Item>疲倦的雙眼帶著期望</List.Item>
	</List>
</Flex>`,
	lang: "xml",
};

export const PList = [
	{
		name: "label",
		desc: "标签",
		type: ["ReactNode", "(i: number) => ReactNode"],
	},
	{
		name: "type",
		desc: "类型",
		type: ["'default'", "'option'"],
		def: "'default'",
	},
];

export const PListItem = [
	{
		name: "active",
		desc: "活跃态，当 type 为 option 时有效",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "align",
		desc: "对齐方式，align-items",
		type: ["string"],
	},
	{
		name: "label",
		desc: "标签，优先级比 List 高",
		type: ["ReactNode"],
	},
	{
		name: "disabled",
		desc: "禁用态，当 type 为 option 时有效",
		type: ["boolean"],
		def: "false",
	},
];
