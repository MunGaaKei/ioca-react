import { Button, Icon, Image, Tabs } from "@p";
import { RefTabs } from "@p/components/tabs/type";
import { WindowTwotone } from "@ricons/material";
import { draw, uid } from "radash";
import { useRef } from "react";

export const DBasic = {
	demo: () => {
		return (
			<Tabs active='0' toggable>
				{[...new Array(13).keys()].map((i) => (
					<Tabs.Item key={i} title={`title ${i + 1}`}>
						<div className='pd-8'>{`content ${i + 1}`}</div>
					</Tabs.Item>
				))}
				<Tabs.Item title='keepDOM' keepDOM>
					<Image
						src='https://via.placeholder.com/150'
						initSize={40}
					/>
				</Tabs.Item>
			</Tabs>
		);
	},
	code: `<Tabs active='0'>
    {[...new Array(13).keys()].map((i) => (
        <Tabs.Item key={i} title={\`title \${i + 1}\`}>
            <div className='pd-8'>{\`content \${i + 1}\`}</div>
        </Tabs.Item>
    ))}
    <Tabs.Item title='keepDOM' keepDOM>
        <Image
			src='https://via.placeholder.com/150'
			initSize={40}
		/>
    </Tabs.Item>
</Tabs>`,
	lang: "xml",
};

export const DDynamic = {
	demo: () => {
		const tabs = ["标签页", "你好"];
		const tabRef = useRef<RefTabs>(null);

		const handleCreate = () => {
			const key = uid(4);
			const emoji = ["✌️", "🫠", "👻", "💀", "🐶", "🐤", "🐞", "🐧"];

			tabRef.current?.add({
				key,
				title: `${draw(emoji)} ${key}`,
				closable: true,
			});
		};

		return (
			<>
				<Button className='bg-blue mb-12' onClick={handleCreate}>
					新增
				</Button>

				<Tabs
					ref={tabRef}
					tabs={tabs}
					active='标签页'
					type='pane'
					prepend={<Icon icon={<WindowTwotone />} />}
					style={{ maxHeight: 120 }}
				/>
			</>
		);
	},
	code: `const tabs = ["标签页", "你好"];
const tabRef = useRef<RefTabs>(null);

const handleCreate = () => {
	const key = uid(4);
	const emoji = ["✌️", "🫠", "👻", "💀", "🐶", "🐤", "🐞", "🐧"];

	tabRef.current?.add({
		key,
		title: \`\${draw(emoji)} \${key}\`,
		closable: true,
	});
};

return (
	<>
		<Button className='bg-blue mb-12' onClick={handleCreate}>
			新增
		</Button>

		<Tabs
			ref={tabRef}
			tabs={tabs}
			active='标签页'
			type='pane'
			prepend={<Icon icon={<WindowTwotone />} />}
			style={{ maxHeight: 120 }}
		/>
	</>
);`,
	lang: "javascript",
};

export const PTabs = [
	{
		name: "tabs",
		desc: "项目数组，也可以使用 children",
		type: [
			<a href='#tab-item' className='blue'>
				ITabItem[]
			</a>,
		],
	},
	{
		name: "active",
		desc: "当前项",
		type: ["string", "number"],
	},
	{
		name: "type",
		desc: "样式类型",
		type: ["'default'", "'line'", "'pane'"],
		def: '"default"',
	},
	{
		name: "prepend",
		desc: "标签页前显示内容",
		type: ["ReactNode"],
	},
	{
		name: "append",
		desc: "标签页尾显示内容",
		type: ["ReactNode"],
	},
	{
		name: "vertical",
		desc: "标签页显示方向",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "hideMore",
		desc: "隐藏更多按钮",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "bar",
		desc: "当 type 为 'default' 时，显示动画块",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "barClass",
		desc: "动画块样式类",
		type: ["string"],
	},
	{
		name: "navsJustify",
		desc: "标签对齐方式",
		type: ["'start'", "'center'", "'end'"],
		def: "'start'",
	},
	{
		name: "toggable",
		desc: "点击当前项时可以隐藏",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "renderMore",
		desc: "渲染更多显示方式",
		type: [
			<>
				(moreTabs:{" "}
				<a href='#tab-item' className='blue'>
					ITabItem[]
				</a>
				) =&gt; ReactNode
			</>,
		],
	},
	{
		name: "onTabChange",
		desc: "标签页切换时触发",
		type: ["(to?: number | string, from?: number | string) => void"],
		event: true,
	},
];

export const PTabItem = [
	{
		name: "key",
		desc: "标签页索引",
		type: ["string", "number"],
	},
	{
		name: "title",
		desc: "标签页标题",
		type: ["ReactNode"],
	},
	{
		name: "closable",
		desc: "标签页可关闭",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "content",
		desc: "标签页内容",
		type: ["ReactNode"],
	},
	{
		name: "keepDOM",
		desc: "隐藏后保持DOM存在",
		type: ["boolean"],
		def: "false",
	},
];
