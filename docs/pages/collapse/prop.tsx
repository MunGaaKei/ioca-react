import { Collapse } from "@p";

export const DBasic = {
	demo: (
		<Collapse>
			<Collapse.Item title={<>窗外的麻雀</>} className='a'>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit.
				Ducimus doloremque, nulla eos et sapiente consequuntur aliquam
				ipsam architecto sit? Quia ducimus laboriosam atque distinctio
				voluptatibus sit et cum iste incidunt.
			</Collapse.Item>
			<Collapse.Item title='在电线杆上多嘴' disabled>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit.
				Quibusdam dicta quas minima quaerat, minus cupiditate sequi
				aliquam provident reiciendis odit, aliquid adipisci itaque ullam
				ab corrupti saepe veritatis nulla pariatur!
			</Collapse.Item>
			<Collapse.Item title='夏天的味道'>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et
				aspernatur, incidunt, sequi, ab cum quis voluptas dolorem vel
				dolor unde accusamus qui ratione nesciunt velit optio amet!
				Temporibus, nesciunt nihil!
			</Collapse.Item>
		</Collapse>
	),
	code: `<Collapse>
    <Collapse.Item title={<>窗外的麻雀</>}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        Ducimus doloremque, nulla eos et sapiente consequuntur aliquam
        ipsam architecto sit? Quia ducimus laboriosam atque distinctio
        voluptatibus sit et cum iste incidunt.
    </Collapse.Item>
    <Collapse.Item title='在电线杆上多嘴' disabled>disabled</Collapse.Item>
    <Collapse.Item title='夏天的味道'>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et
        aspernatur, incidunt, sequi, ab cum quis voluptas dolorem vel
        dolor unde accusamus qui ratione nesciunt velit optio amet!
        Temporibus, nesciunt nihil!
    </Collapse.Item>
</Collapse>`,
	lang: "xml",
};

export const PCollapse = [
	{
		name: "items",
		desc: "子项，也可以通过 Collapse.Item 传入。items 优先级更高",
		type: [
			<a className='blue' href='/docs/collapse#collapse-item'>
				ICollapseItem[]
			</a>,
		],
	},
	{
		name: "active",
		desc: "激活项，multiple 值是 true 的时候可为数组",
		type: ["string", "number", "(string | number)[]"],
	},
	{
		name: "multiple",
		desc: "是否可以同时展开多个",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "border",
		desc: "边框",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "headerClickable",
		desc: "点击 header 也可以展开",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "renderToggle",
		desc: "渲染展开按钮图标",
		type: ["(active?: boolean) => ReactNode"],
	},
	{
		name: "onCollapse",
		desc: "卡片边框",
		type: ["(key: string | number, active: boolean) => void"],
		event: true,
	},
];

export const PCollapseItem = [
	{
		name: "key",
		desc: "键",
		type: ["string", "number"],
	},
	{
		name: "title",
		desc: "标题",
		type: ["ReactNode"],
	},
	{
		name: "content",
		desc: "内容，和 children 一样",
		type: ["ReactNode"],
	},
	{
		name: "disabled",
		desc: "禁用状态",
		type: ["boolean"],
		def: "false",
	},
];
