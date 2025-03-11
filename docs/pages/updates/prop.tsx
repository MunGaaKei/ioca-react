import { List } from "@/packages";
import { Link } from "react-router";
const { Item } = List;

const create = <b className='color-2'>新增</b>;
const addAttr = <span className='brown'>添加属性</span>;
const fix = <span>修复</span>;
const update = <span className='green'>更新</span>;
const remove = <b className='error-1'>移除</b>;
const perf = <b className='success'>优化</b>;

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
					{addAttr} <code>asList</code>
				</Item>
				<Item
					label={
						<Link to='/docs/loading' className='blue'>
							Loading
						</Link>
					}
				>
					{addAttr} <code>absolute</code>
				</Item>
				<Item
					label={
						<Link to='/docs/datagrid' className='blue'>
							Datagrid
						</Link>
					}
				>
					{addAttr} <code>cellEllipsis</code>
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
					{addAttr} <code>cover</code>
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
					{addAttr} <code>onEnter</code>
				</Item>
			</List>
		),
	},
	{
		title: "1.1.5",
		content: (
			<List>
				<Item>
					{create}组件
					<Link to='/docs/pickers' className='blue'>
						TimePicker、ColorPicker
					</Link>
				</Item>
				<Item>
					{create}组件
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
					{addAttr} <code>hideArrow</code>
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
					{perf}控制栏显示
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
					{addAttr}
					<code>keepDOM</code>
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
					{perf}显示位置控制
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
					{perf}移动端交互
				</Item>
				<Item>{perf}部分样式</Item>
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
					{addAttr}
					<code>wave</code>和
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
	{
		title: "1.1.9",
		content: (
			<List>
				<Item
					label={
						<Link to='/docs/form' className='blue'>
							Form
						</Link>
					}
				>
					{addAttr}
					<code>gap</code>，以及验证失败时反馈
				</Item>
				<Item
					label={
						<Link to='/docs/tabs' className='blue'>
							Tabs
						</Link>
					}
				>
					{addAttr}
					<code>navsJustify</code>
				</Item>
				<Item
					label={
						<Link to='/docs/preview' className='blue'>
							Preview
						</Link>
					}
				>
					{perf}控制栏显示
				</Item>
				<Item
					label={
						<Link to='/docs/helper' className='blue'>
							Helper ClassName
						</Link>
					}
				>
					添加了<code>roundless</code>
					<code>bg-transparent</code>
				</Item>
				<Item
					label={
						<Link to='/docs/card' className='blue'>
							Card
						</Link>
					}
				>
					{addAttr}
					<code>as</code>，继承了<code>HTMLDivElement</code>
					属性
				</Item>
				<Item
					label={
						<Link to='/docs/tag' className='blue'>
							Tag
						</Link>
					}
				>
					{perf}关闭样式，{addAttr}
					<code>hoverShowClose</code>
				</Item>
			</List>
		),
	},
	{
		title: "1.2.0 ~ 1.2.1",
		content: (
			<List>
				<Item>
					{create}组件{" "}
					<Link to='/docs/editor' className='blue'>
						Editor
					</Link>
				</Item>
				<Item
					label={
						<Link to='/docs/button' className='blue'>
							Button.Toggle
						</Link>
					}
				>
					修正样式
				</Item>
				<Item
					label={
						<Link to='/docs/button' className='blue'>
							Button.Group
						</Link>
					}
				>
					{addAttr}
					<code>buttonProps</code>
				</Item>
				<Item
					label={
						<Link to='/docs/modal' className='blue'>
							Modal
						</Link>
					}
				>
					修正层级关系
				</Item>
				<Item
					label={
						<Link to='/docs/pickers' className='blue'>
							ColorPicker
						</Link>
					}
				>
					现在需要确认才会出发<code>onChange</code>
				</Item>
				<Item
					label={
						<Link to='/docs/popup' className='blue'>
							Popup
						</Link>
					}
				>
					{perf}隐藏逻辑
				</Item>
				<Item>
					<Link to='/docs/modal' className='blue'>
						Modal
					</Link>
					优化<code>onOk</code>逻辑
				</Item>
				<Item>
					{remove}组件
					<b style={{ textDecoration: "line-through" }}>
						List.Virtual
					</b>
				</Item>
			</List>
		),
	},
	{
		title: "1.2.2",
		content: (
			<List>
				<Item>
					<Link to='/docs/modal' className='blue'>
						Modal
					</Link>
					<Link to='/docs/drawer' className='blue'>
						Drawer
					</Link>
					{addAttr} <code>disableEsc</code>
				</Item>
				<Item>{perf}部分样式显示</Item>
			</List>
		),
	},
	{
		title: "1.2.3",
		content: (
			<List>
				<Item>
					<Link to='/docs/modal' className='blue'>
						Modal
					</Link>
					{addAttr} <code>keepDOM</code>
					<br />
					{fix}
					<code>useModal</code>与<code>closable</code>冲突问题
					<br />
					{fix}与
					<Link to='/docs/popup' className='blue'>
						Popup
					</Link>
					冲突问题
				</Item>
				<Item>
					<Link to='/docs/editor' className='blue'>
						Editor
					</Link>
					{addAttr}
					<code>autosize</code>
				</Item>
				<Item>
					<Link to='/docs/upload' className='blue'>
						Upload
					</Link>
					{perf}上传行为
				</Item>
				<Item>
					<Link to='/docs/popup' className='blue'>
						Popup
					</Link>
					{fix}
					<code>touchable</code>问题
				</Item>
				<Item>
					<Link to='/docs/progress' className='blue'>
						Progress
					</Link>
					{addAttr}
					<code>vertical</code>
					<code>onDraggingChange</code>
					<code>lineWidth</code>
					<code>circleSize</code>，{remove}属性
					<code style={{ textDecoration: "line-through" }}>
						height
					</code>
					、
					<code style={{ textDecoration: "line-through" }}>size</code>
				</Item>
				<Item>
					{perf}
					<Link to='/docs/video' className='blue'>
						Video
					</Link>
					样式
				</Item>
			</List>
		),
	},
	{
		title: "1.2.4",
		content: (
			<List>
				<Item>{perf}部分组件渲染</Item>
			</List>
		),
	},
	{
		title: "1.2.5",
		content: (
			<List>
				<Item>
					<Link to='/docs/swiper' className='blue'>
						Swiper
					</Link>
					{addAttr}
					<code>onItemClick</code>
				</Item>
				<Item>{perf}部分样式</Item>
			</List>
		),
	},
	{
		title: "1.2.6",
		content: (
			<List>
				<Item>
					<Link to='/docs/button' className='blue'>
						Button.Toggle
					</Link>
					{addAttr}
					<code>toggable</code>
				</Item>
				<Item>
					{perf}
					<Link to='/docs/popup' className='blue'>
						Popup
					</Link>
					位置计算
				</Item>
				<Item>
					<Link to='/docs/swiper' className='blue'>
						Swiper
					</Link>
					{addAttr}
					<code>fixedIndicator</code>
				</Item>
				<Item>{perf}部分样式</Item>
			</List>
		),
	},
	{
		title: "1.2.7",
		content: (
			<List>
				<Item>
					{perf}
					<Link to='/docs/button' className='blue'>
						Button.Toggle
					</Link>
					受控模式
				</Item>
				<Item>
					{perf}
					<Link to='/docs/popup' className='blue'>
						Popup
					</Link>
					显示隐藏
				</Item>
				<Item>
					{perf}
					<Link to='/docs/message' className='blue'>
						Message
					</Link>
					，<span className='brown'>添加</span>
					<code>Message.one</code>方法
				</Item>
			</List>
		),
	},
	{
		title: "1.2.8",
		content: (
			<List>
				<Item>
					<Link to='/docs/editor' className='blue'>
						Editor
					</Link>
					{addAttr}
					<code>border</code>、<code>richPaste</code>，
					<span className='blue'>controls</span>添加可选值
					<code>"none"</code>
				</Item>
				<Item>
					<Link to='/docs/helper' className='blue'>
						Helper Class
					</Link>
					<span className='brown'>添加</span>
					<code>.flex-shrink</code>以及补充间距样式数值
				</Item>
				<Item>优化部分typescript提示</Item>
			</List>
		),
	},
	{
		title: "1.2.9",
		content: (
			<List>
				<Item>
					<Link to='/docs/editor' className='blue'>
						Editor
					</Link>
					{update}图标，添加更多事件绑定
				</Item>
				<Item>
					{perf}
					<Link to='/docs/button' className='blue'>
						Button
					</Link>
					加载和禁用状态
				</Item>
			</List>
		),
	},
];
