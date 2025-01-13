import { List } from "@/packages";
import { Link } from "react-router";
const { Item } = List;

export const updates = [
	{
		title: "1.1.0",
		content: <h5>Hello World</h5>,
	},
	{
		title: "1.1.1 ~ 1.1.3",
		content: (
			<List>
				<Item
					label={
						<Link to='/docs/step' className='blue'>
							Step
						</Link>
					}
				>
					添加属性 <code>asList</code>
				</Item>
				<Item
					label={
						<Link to='/docs/loading' className='blue'>
							Loading
						</Link>
					}
				>
					添加属性 <code>absolute</code>
				</Item>
				<Item
					label={
						<Link to='/docs/datagrid' className='blue'>
							Datagrid
						</Link>
					}
				>
					添加属性 <code>cellEllipsis</code>
				</Item>
				<Item>修复了颜色样式显示错误</Item>
				<Item>调整了部分样式</Item>
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
				<Item
					label={
						<Link to='/docs/form' className='blue'>
							Form
						</Link>
					}
				>
					修复组件状态重置
				</Item>
			</List>
		),
	},
	{
		title: "1.1.4",
		content: (
			<List>
				<Item
					label={
						<Link to='/docs/button' className='blue'>
							Button
						</Link>
					}
				>
					属性 <code>type</code> 添加可选值 <code>mini</code>
				</Item>
				<Item
					label={
						<Link to='/docs/helper' className='blue'>
							Helper ClassName
						</Link>
					}
				>
					添加了 <code>.font-lg</code>
					<code>.font-sm</code>
					<code>.font-italic</code>
					<code>.font-bold</code>
				</Item>
				<Item
					label={
						<Link to='/docs/image' className='blue'>
							Image
						</Link>
					}
				>
					添加了属性 <code>cover</code>
					<code>coverClass</code>
				</Item>
				<Item
					label={
						<Link to='/docs/message' className='blue'>
							Message
						</Link>
					}
				>
					添加了快捷使用状态消息
				</Item>
				<Item
					label={
						<Link to='/docs/form' className='blue'>
							Form
						</Link>
					}
				>
					添加了属性 <code>onEnter</code>
				</Item>
			</List>
		),
	},
	{
		title: "1.1.5",
		content: (
			<List>
				<Item>
					新增组件
					<Link to='/docs/pickers' className='blue'>
						TimePicker、ColorPicker
					</Link>
				</Item>
				<Item>
					新增组件
					<Link to='/docs/resizable' className='blue'>
						Resizable
					</Link>
				</Item>
				<Item
					label={
						<Link to='/docs/select' className='blue'>
							Select
						</Link>
					}
				>
					添加了属性 <code>hideArrow</code>
				</Item>
				<Item>修复小部分事件绑定</Item>
			</List>
		),
	},
	{
		title: "1.1.6",
		content: (
			<List>
				<Item
					label={
						<Link to='/docs/preview' className='blue'>
							Preview
						</Link>
					}
				>
					新增图片拖移功能
				</Item>
				<Item
					label={
						<Link to='/docs/datagrid' className='blue'>
							Datagrid
						</Link>
					}
				>
					修正单元格初始宽度适应
				</Item>
				<Item
					label={
						<Link to='/docs/collapse' className='blue'>
							Collapse
						</Link>
					}
				>
					修正headerClickable冲突
				</Item>
				<Item
					label={
						<Link to='/docs/loading' className='blue'>
							Loading
						</Link>
					}
				>
					优化<code>absolute</code>时的样式
				</Item>
				<Item
					label={
						<Link to='/docs/popconfirm' className='blue'>
							Popconfirm
						</Link>
					}
				>
					优化了<code>onOk</code>回调
				</Item>
				<Item
					label={
						<Link to='/docs/video' className='blue'>
							Video
						</Link>
					}
				>
					优化控制栏显示
				</Item>
			</List>
		),
	},
	{
		title: "1.1.7",
		content: (
			<List>
				<Item
					label={
						<Link to='/docs/drawer' className='blue'>
							Drawer
						</Link>
					}
				>
					新增<code>keepDOM</code>属性
				</Item>
				<Item
					label={
						<Link to='/docs/image' className='blue'>
							Image
						</Link>
					}
				>
					修复初始时<code>loading</code>状态问题
				</Item>
				<Item
					label={
						<Link to='/docs/popup' className='blue'>
							Popup
						</Link>
					}
				>
					优化显示位置控制
				</Item>
				<Item>
					<Link to='/docs/progress' className='blue'>
						Progress
					</Link>
					<Link to='/docs/resizable' className='blue'>
						Resizable
					</Link>
					<Link to='/docs/swiper' className='blue'>
						Swiper
					</Link>{" "}
					优化移动端交互
				</Item>
				<Item>优化部分样式</Item>
			</List>
		),
	},
	{
		title: "1.1.8",
		content: (
			<List>
				<Item
					label={
						<Link to='/docs/text' className='blue'>
							Text
						</Link>
					}
				>
					新增<code>wave</code>属性和
					<Link to='/docs/text#text-highlight' className='blue'>
						HighLight
					</Link>
					子组件
				</Item>
				<Item
					label={
						<Link to='/docs/card' className='blue'>
							Card
						</Link>
					}
				>
					修改插槽
				</Item>
				<Item
					label={
						<Link to='/docs/popup' className='blue'>
							Popup
						</Link>
					}
				>
					修复<code>contextmenu</code>时弹出位置计算错误
				</Item>
			</List>
		),
	},
];
