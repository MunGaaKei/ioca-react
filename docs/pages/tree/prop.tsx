import { Button, Flex, Tag, Tree } from "@p";
import { RefTree } from "@p/components/tree/type";
import { useRef, useState } from "react";

export const DBasic = {
	demo: () => {
		const [selected, setSelected] = useState("");
		const [checked, setChecked] = useState<string[]>([]);
		const treeRef = useRef<RefTree>(null);

		const getPartofs = () => {
			const res = treeRef.current?.getPartofs();
			console.log(res);
		};

		return (
			<>
				<p>
					selected: <span className='blue'>{selected}</span>
				</p>
				<div className='my-4'>
					<Flex gap={2} wrap>
						<span>checked:</span>
						{checked.map((k) => (
							<Tag key={k} className='bg-pink'>
								{k}
							</Tag>
						))}
					</Flex>
					<Button className='bg-brown mt-8' onClick={getPartofs}>
						获取半选状态节点
					</Button>
				</div>
				<Tree
					ref={treeRef}
					nodeProps={{
						key: "title",
					}}
					data={[
						{
							title: "A",
							children: [
								{
									title: "A-0",
									status: "done",
								},
								{
									title: "A-1",
									children: [
										{
											title: "A-1-0",
											status: "todo",
										},
										{
											title: "A-1-1",
											status: "done",
										},
										{
											title: "A-1-2",
											status: "todo",
											children: [
												{
													title: "A-1-2-0",
												},
												{
													title: "A-1-2-1",
												},
											],
										},
									],
								},
							],
							expanded: true,
						},
						{
							title: "B",
							children: [
								{
									title: "B-0",
									children: [
										{
											title: "B-0-0",
										},
										{
											title: "B-0-1",
										},
									],
								},
								{
									title: "B-1",
								},
								{
									title: "B-2",
								},
							],
						},
					]}
					checkable
					selectable
					renderExtra={(item) => {
						if (!item.status) return "";

						const done = item.status === "done";
						return (
							<Tag
								className={done ? "bg-success-0" : "bg-error-0"}
								size='small'
								dot
							>
								{item.status}
							</Tag>
						);
					}}
					onItemSelect={setSelected}
					onItemCheck={(item, checked, list) => {
						setChecked(list);
					}}
				/>
			</>
		);
	},
	code: `const [selected, setSelected] = useState("");
const [checked, setChecked] = useState<string[]>([]);
const treeRef = useRef<RefTree>(null);

const getPartofs = () => {
	const res = treeRef.current?.getPartofs();
	console.log(res);
};

return (
	<>
		<p>
			selected: <span className='blue'>{selected}</span>
		</p>
		<div className='my-4'>
			<Flex gap={2} wrap>
				<span>checked:</span>
				{checked.map((k) => (
					<Tag key={k} className='bg-pink'>
						{k}
					</Tag>
				))}
			</Flex>
			<Button className='bg-brown mt-8' onClick={getPartofs}>
				获取半选状态节点
			</Button>
		</div>
		<Tree
			ref={treeRef}
			nodeProps={{
				key: "title",
			}}
			data={[
				{
					title: "A",
					children: [
						{
							title: "A-0",
							status: "done",
						},
						{
							title: "A-1",
							children: [
								{
									title: "A-1-0",
									status: "todo",
								},
								{
									title: "A-1-1",
									status: "done",
								},
								{
									title: "A-1-2",
									status: "todo",
									children: [
										{
											title: "A-1-2-0",
										},
										{
											title: "A-1-2-1",
										},
									],
								},
							],
						},
					],
					expanded: true,
				},
				{
					title: "B",
					children: [
						{
							title: "B-0",
							children: [
								{
									title: "B-0-0",
								},
								{
									title: "B-0-1",
								},
							],
						},
						{
							title: "B-1",
						},
						{
							title: "B-2",
						},
					],
				},
			]}
			checkable
			selectable
			renderExtra={(item) => {
				if (!item.status) return "";

				const done = item.status === "done";
				return (
					<Tag
						className={done ? "bg-success-0" : "bg-error-0"}
						size='small'
						dot
					>
						{item.status}
					</Tag>
				);
			}}
			onItemSelect={setSelected}
			onItemCheck={(item, checked, list) => {
				setChecked(list);
			}}
		/>
	</>
);`,
	lang: "javascript",
};

export const PTree = [
	{
		name: "data",
		desc: "数据",
		type: [
			<a className='blue' href='/docs/tree#tree-item'>
				ITreeItem[]
			</a>,
		],
		required: true,
	},
	{
		name: "nodeProps",
		desc: "节点默认属性设置",
		type: ["{ key?: string; title?: string; children?: string }"],
		def: "{ key: 'key', title: 'title', children: 'children' }",
	},
	{
		name: "selected",
		desc: "当前选择的节点",
		type: ["string"],
	},
	{
		name: "selectable",
		desc: "节点可以选择",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "checked",
		desc: "勾选状态下的节点",
		type: ["string[]"],
	},
	{
		name: "checkable",
		desc: "节点可以被勾选",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "disabledRelated",
		desc: "勾选节点时，不影响其它节点的勾选状态",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "round",
		desc: "节点圆角",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "renderExtra",
		desc: "渲染额外内容",
		type: ["(item: ITreeItem) => ReactNode"],
	},
	{
		name: "onItemClick",
		desc: "点击节点时触发",
		type: ["(item: ITreeItem, e: MouseEvent) => void"],
		event: true,
	},
	{
		name: "onItemSelect",
		desc: "选择节点时触发",
		type: ["(key: string, item: ITreeItem) => void"],
		event: true,
	},
	{
		name: "onItemCheck",
		desc: "勾选节点时触发",
		type: [
			"(item: ITreeItem, checked: boolean, checkedKeys: string[]) => void",
		],
		event: true,
	},
];

export const PTreeItem = [
	{
		name: "as",
		desc: "节点渲染标签名",
		type: ["string"],
		def: "'A'",
	},
	{
		name: "key",
		desc: "默认节点主键，可通过nodeMap设置",
		type: ["string"],
	},
	{
		name: "type",
		desc: "节点类型，会有不同的渲染方式",
		type: ["'item'", "'title'", "string"],
		def: "'item'",
	},
	{
		name: "title",
		desc: "节点标题内容，默认属性，可通过nodeMap设置",
		type: ["ReactNode"],
		required: true,
	},
	{
		name: "icon",
		desc: "图标",
		type: ["ReactNode"],
	},
	{
		name: "href",
		desc: "你懂的",
		type: ["string"],
	},
	{
		name: "children",
		desc: "子节点列表。默认属性，可通过nodeMap设置",
		type: ["ITreeItem[]"],
	},
	{
		name: "expanded",
		desc: "当存在子节点时，展开状态",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "disabled",
		desc: "节点不可点击",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "checked",
		desc: "节点勾选状态",
		type: ["boolean"],
		def: "false",
	},
];

export const PRefTree = `interface RefTree {

	getChecked: () => [string[], ITreeItem[]];

	getSelected: () => [string?, ITreeItem?];

	getPartofs: () => [string[], ITreeItem[]];

}`;
