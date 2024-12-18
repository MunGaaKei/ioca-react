import { List } from "@/packages";
import { Link } from "react-router-dom";
const { Item } = List;

export const updates = [
	{
		title: "1.1.0",
		content: "Hello World",
	},
	{
		title: "1.1.1",
		content: (
			<List>
				<Item
					label={
						<Link to='/docs/step' className='blue'>
							Step
						</Link>
					}
				>
					添加属性 <code className='color-0'>asList</code>
				</Item>
				<Item
					label={
						<Link to='/docs/loading' className='blue'>
							Loading
						</Link>
					}
				>
					添加属性 <code className='color-0'>absolute</code>
				</Item>
				<Item
					label={
						<Link to='/docs/datagrid' className='blue'>
							Datagrid
						</Link>
					}
				>
					添加属性 <code className='color-0'>cellEllipsis</code>
				</Item>
				<Item>修复了颜色样式显示错误</Item>
				<Item>调整了部分样式</Item>
			</List>
		),
	},
	{
		title: "1.1.2",
		content: (
			<List>
				<Item
					label={
						<Link to='/docs/tabs' className='blue'>
							Tabs
						</Link>
					}
				>
					修复外部样式影响
				</Item>
				<Item>修正文档错误文案</Item>
			</List>
		),
	},
	{
		title: "1.1.3",
		content: (
			<List>
				<Item
					label={
						<Link to='/docs/form' className='blue'>
							Form
						</Link>
					}
				>
					🐞 修复组件状态重置
				</Item>
			</List>
		),
	},
];
