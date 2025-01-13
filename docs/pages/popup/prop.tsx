import { Button, Flex, Popup } from "@p";

export const DBasic = {
	demo: () => {
		return (
			<Popup
				content={
					<div className='pd-20' style={{ width: 360 }}>
						<h4>Lorem</h4>
						<p className='mt-12'>
							Lorem ipsum dolor sit amet consectetur adipisicing
							elit. Eveniet, dolorum praesentium. Iste praesentium
							unde ea facilis eos et sint. Vero, neque corrupti
							reprehenderit cum explicabo libero autem mollitia
							doloremque culpa?
						</p>
					</div>
				}
			>
				<Button className='bg-blue'>Hover Me</Button>
			</Popup>
		);
	},
	code: `<Popup
	content={
		<div className='pd-20' style={{ width: 360 }}>
			<h4>Lorem</h4>
			<p className='mt-12'>
				Lorem ipsum dolor sit amet consectetur adipisicing
				elit. Eveniet, dolorum praesentium. Iste praesentium
				unde ea facilis eos et sint. Vero, neque corrupti
				reprehenderit cum explicabo libero autem mollitia
				doloremque culpa?
			</p>
		</div>
	}
>
	<Button className='bg-blue'>Hover Me</Button>
</Popup>`,
	lang: "xml",
};

export const DVariant = {
	demo: () => {
		return (
			<Flex gap={20}>
				<Popup
					className='bg-blue'
					trigger='click'
					position='right'
					offset={8}
					watchResize
					content={
						<div className='pd-20' style={{ width: 400 }}>
							<h4>Lorem</h4>
							<p className='mt-12'>
								Lorem ipsum dolor sit amet consectetur
								adipisicing elit. Eveniet, dolorum praesentium.
								Iste praesentium unde ea facilis eos et sint.
								Vero, neque corrupti reprehenderit cum explicabo
								libero autem mollitia doloremque culpa?
							</p>
						</div>
					}
				>
					<Button>Click Me</Button>
				</Popup>

				<Popup
					content='content'
					trigger='contextmenu'
					className='pd-12'
				>
					<div className='pd-40 ml-40 bg-grey round-0'>
						contextmenu
					</div>
				</Popup>
			</Flex>
		);
	},
	code: `<Flex gap={20}>
	<Popup
		className='bg-blue'
		trigger='click'
		position='right'
		offset={8}
		watchResize
		content={
			<div className='pd-20' style={{ width: 400 }}>
				<h4>Lorem</h4>
				<p className='mt-12'>
					Lorem ipsum dolor sit amet consectetur
					adipisicing elit. Eveniet, dolorum praesentium.
					Iste praesentium unde ea facilis eos et sint.
					Vero, neque corrupti reprehenderit cum explicabo
					libero autem mollitia doloremque culpa?
				</p>
			</div>
		}
	>
		<Button>Click Me</Button>
	</Popup>

	<Popup
		content='content'
		trigger='contextmenu'
		className='pd-12'
	>
		<div className='pd-40 ml-40 bg-grey round-0'>
			contextmenu
		</div>
	</Popup>
</Flex>`,
	lang: "xml",
};

export const PPopup = [
	{
		name: "children",
		desc: "触发目标元素，需确保能获取真实的DOM元素。如果是自定义组件，应确认使用组件 ref 指向一个真实 DOM。",
		type: ["ReactNode"],
	},
	{
		name: "visible",
		desc: "是否显示",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "content",
		desc: "显示内容",
		type: ["ReactNode"],
	},
	{
		name: "trigger",
		desc: "触发方式",
		type: ["'hover'", "'click'", "'focus'", "'contextmenu'", "'none'"],
	},
	{
		name: "gap",
		desc: "离窗口边距距离，单位px",
		type: ["number"],
	},
	{
		name: "offset",
		desc: "离触发目标距离，单位px",
		type: ["number"],
	},
	{
		name: "position",
		desc: "展开位置偏好，设置后优先在该方向上显示。如果没有足够的空间，则从该反方向上显示（如果反方向仍然没有足够的空间，则遵循原方向上显示）。",
		type: ["'left'", "'top'", "'right'", "'bottom'"],
		def: "'top'",
	},
	{
		name: "arrow",
		desc: "显示小三角",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "align",
		desc: "相对触发目标元素对齐位置",
		type: ["'start'", "'center'", "'end'"],
		def: "'center'",
	},
	{
		name: "showDelay",
		desc: "显示内容前的延迟，单位ms",
		type: ["number"],
		def: "16",
	},
	{
		name: "hideDelay",
		desc: "隐藏内容前的延迟，单位ms",
		type: ["number"],
		def: "12",
	},
	{
		name: "touchable",
		desc: "是否可以与内容区域进行交互",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "fitSize",
		desc: "内容尺寸与触发目标元素尺寸大小一致（显示方向上）",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "watchResize",
		desc: "当触发目标元素位置变化时，内容区重新调整位置",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "clickOutside",
		desc: "点击内容区域外时隐藏内容",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "disabled",
		desc: "禁用状态",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "style",
		desc: "内容区域样式",
		type: ["CSSProperties"],
	},
	{
		name: "className",
		desc: "内容区域样式",
		type: ["string"],
	},
	{
		name: "fixed",
		desc: "CSS position 值为 fixed",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "getContainer",
		desc: "内容区域渲染位置，默认目标元素的相对父节点",
		type: ["() => HTMLElement"],
	},
	{
		name: "onVisibleChange",
		desc: "内容区显示隐藏时触发",
		type: ["(visible: boolean) => void"],
		event: true,
	},
];
