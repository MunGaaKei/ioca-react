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
];
