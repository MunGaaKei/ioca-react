import { Divider, Flex, List } from "@p";
import { AudiotrackOutlined } from "@ricons/material";

export const DBasic = {
    demo: () => {
        return (
            <Flex justify="space-evenly">
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
                <List border>
                    <List.Item>今天只有殘留的軀殼</List.Item>
                    <List.Item>迎接光輝歲月</List.Item>
                    <List.Item>風雨中抱緊自由</List.Item>
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
	<List border>
		<List.Item>今天只有殘留的軀殼</List.Item>
		<List.Item>迎接光輝歲月</List.Item>
		<List.Item>風雨中抱緊自由</List.Item>
	</List>
</Flex>`,
    lang: "xml",
};

export const DDividers = {
    demo: () => (
        <Flex justify="space-evenly">
            <List type="option">
                <List.Item>管理质量</List.Item>
                <List.Item>团队协作</List.Item>
                <Divider />
                <List.Item>发送反馈</List.Item>
                <List.Item>报告问题</List.Item>
                <Divider>其它</Divider>
                <List.Item className="error">我要举报</List.Item>
            </List>
        </Flex>
    ),
    code: `<Flex justify='space-evenly'>
	<List type='option'>
		<List.Item>管理质量</List.Item>
		<List.Item>团队协作</List.Item>
		<Divider />
		<List.Item>发送反馈</List.Item>
		<List.Item>报告问题</List.Item>
	</List>
	<List type='option'>
		<List.Item>账户设置</List.Item>
		<Divider />
		<List.Item>隐私政策</List.Item>
		<List.Item>服务条款</List.Item>
		<Divider>其他</Divider>
        <List.Item className="error">我要举报</List.Item>
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
    {
        name: "border",
        desc: "子项边框",
        type: ["boolean"],
        def: "false",
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

export const PListDivider = [
    {
        name: "children",
        desc: "自定义内容",
        type: ["ReactNode"],
    },
];
