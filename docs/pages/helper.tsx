import { Flex, List } from "@p";
const Item = List.Item;

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Helper ClassNames</h2>
			<p>提供一些方便的辅助类名使用。</p>
			<List className='my-12'>
				<Item label={<code>.relative</code>}>position: relative;</Item>
				<Item label={<code>.fixed</code>}>position: fixed;</Item>
				<Item label={<code>.flex</code>}>display: flex;</Item>
				<Item label={<code>.grid</code>}>display: grid;</Item>
				<Item label={<code>.flex-column</code>}>
					flex-direction: column;
				</Item>
				<Item label={<code>.flex-wrap</code>}>flex-wrap: wrap;</Item>
				<Item label={<code>.flex-1</code>}>flex: 1;</Item>
				<Item label={<code>.justify-center</code>}>
					justify-content: center;
					<Flex
						className='justify-center bordered'
						gap={1}
						style={{ width: 160 }}
					>
						<div className='pd-8 bg-blue'></div>
						<div className='pd-8 bg-blue'></div>
						<div className='pd-8 bg-blue'></div>
					</Flex>
				</Item>
				<Item label={<code>.justify-between</code>}>
					justify-content: space-between;
					<Flex
						className='justify-between bordered'
						gap={1}
						style={{ width: 160 }}
					>
						<div className='pd-8 bg-blue'></div>
						<div className='pd-8 bg-blue'></div>
						<div className='pd-8 bg-blue'></div>
					</Flex>
				</Item>
				<Item label={<code>.justify-evenly</code>}>
					justify-content: space-evenly;
					<Flex
						className='justify-evenly bordered'
						gap={1}
						style={{ width: 160 }}
					>
						<div className='pd-8 bg-blue'></div>
						<div className='pd-8 bg-blue'></div>
						<div className='pd-8 bg-blue'></div>
					</Flex>
				</Item>
				<Item label={<code>.justify-start</code>}>
					justify-content: flex-start;
					<Flex
						className='justify-start bordered'
						gap={1}
						style={{ width: 160 }}
					>
						<div className='pd-8 bg-blue'></div>
						<div className='pd-8 bg-blue'></div>
						<div className='pd-8 bg-blue'></div>
					</Flex>
				</Item>
				<Item label={<code>.justify-end</code>}>
					justify-content: flex-end;
					<Flex
						className='justify-end bordered'
						gap={1}
						style={{ width: 160 }}
					>
						<div className='pd-8 bg-blue'></div>
						<div className='pd-8 bg-blue'></div>
						<div className='pd-8 bg-blue'></div>
					</Flex>
				</Item>
				<Item label={<code>.items-start</code>}>
					align-items: start;
				</Item>
				<Item label={<code>.items-center</code>}>
					align-items: center;
				</Item>
				<Item label={<code>.items-end</code>}>align-items: end;</Item>
				<Item label={<code>.self-center</code>}>
					align-self: center;
				</Item>
				<Item label={<code>.sticky-top</code>}>贴顶</Item>
				<Item label={<code>.sticky-bottom</code>}>贴底</Item>
				<Item label={<code>.sticky-left</code>}>贴左</Item>
				<Item label={<code>.sticky-right</code>}>贴右</Item>
				<Item label={<code>.text-center</code>}>
					text-align: center;
				</Item>
				<Item label={<code>.text-right</code>}>text-align: right;</Item>
				<Item label={<code>.bordered</code>}>
					<div className='bordered px-4'>带边框</div>
				</Item>
				<Item label={<code>.ellipsis</code>}>
					文字溢出显示省略号...
				</Item>
				<Item label={<code>.overflow-auto</code>}>overflow: auto;</Item>
				<Item label={<code>.h-100vh</code>}>height: 100vh;</Item>
				<Item label={<code>.bg-blur</code>}>背景模糊</Item>
				<Item label={<code>.round</code>}>
					圆角, <div className='bg-blue round pd-10'></div>
				</Item>
				<Item label={<code>.round-0</code>}>
					略微的圆角，<div className='bg-blue round-0 pd-10'></div>
				</Item>
				<Item label={<code>.disabled</code>}>
					禁用样式，
					<span className='disabled'>not allow</span>
				</Item>
				<Item label={<code>.hidden</code>}>
					display: none !important;
				</Item>
				<Item label={<code>.shadow</code>}>
					<div className='px-10 round-0 shadow'>带阴影</div>
				</Item>
				<Item label={<code>.hover-shadow</code>}>
					<div className='px-10 round-0 hover-shadow'>
						鼠标移入时显示阴影
					</div>
				</Item>
				<Item label={<code>.no-transition</code>}>
					transition: none;
				</Item>
				<Item label={<code>.hover-opacity</code>}>
					鼠标移入时
					<span className='round-0 hover-opacity'>透明度</span>变1
				</Item>
				<Item label={<code>.kbd</code>}>
					<kbd>kbd键样式</kbd>
				</Item>
				<Item label={<code>.code</code>}>
					<code>code样式</code>
				</Item>
				<Item label={<code>.chip</code>}>
					<span className='chip'>胶囊样式</span>
				</Item>
				<Item label={<code>.link</code>}>
					<span className='link'>链接样式</span>
				</Item>
				<Item label={<code>.screen-sm</code>}>
					屏幕小于宽度880px才显示：
					<span className='screen-sm'>880px</span>
				</Item>
				<Item label={<code>.screen-lg</code>}>
					屏幕大于宽度880px才显示：
					<span className='screen-lg'>880px</span>
				</Item>
			</List>
			<h3 className='mt-40'>其它</h3>
			<p className='my-12'>
				可以设置一些宽度和边距等，<code>n</code> 可以为以下值：0, 1, 2,
				4, 6, 8, 10, 12, 16, 20, 24, 32, 36, 40, 60, 80, 100, 120, 160,
				200；margin类型的 n 可以多个 auto
			</p>
			<List>
				<Item label={<code>.mg-[n]</code>}>margin: [n]px</Item>
				<Item label={<code>.mx-[n]</code>}>margin-inline: [n]px</Item>
				<Item label={<code>.my-[n]</code>}>margin-block: [n]px</Item>
				<Item label={<code>.mt-[n]</code>}>margin-top: [n]px</Item>
				<Item label={<code>.mb-[n]</code>}>margin-bottom: [n]px</Item>
				<Item label={<code>.ml-[n]</code>}>margin-left: [n]px</Item>
				<Item label={<code>.mr-[n]</code>}>margin-right: [n]px</Item>

				<Item label={<code>.pd-[n]</code>}>padding: [n]px</Item>
				<Item label={<code>.px-[n]</code>}>padding-inline: [n]px</Item>
				<Item label={<code>.py-[n]</code>}>padding-block: [n]px</Item>
				<Item label={<code>.pt-[n]</code>}>padding-top: [n]px</Item>
				<Item label={<code>.pb-[n]</code>}>padding-bottom: [n]px</Item>
				<Item label={<code>.pl-[n]</code>}>padding-left: [n]px</Item>
				<Item label={<code>.pr-[n]</code>}>padding-right: [n]px</Item>

				<Item label={<code>.gap-[n]</code>}>gap: [n]px</Item>
			</List>
			<p className='my-12'>以及宽度和高度，</p> <code>p</code>{" "}
			可以为以下值：10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100
			<List>
				<Item label={<code>.w-[p]</code>}>width: [p]%</Item>
				<Item label={<code>.h-[p]</code>}>height: [p]%</Item>
			</List>
		</>
	);
}
