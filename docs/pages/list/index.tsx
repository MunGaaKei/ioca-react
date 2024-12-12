import { Flex } from "@p";
import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, DVirtual, PList, PListItem, PListVirtual } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>List</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<Flex className='mt-80 mb-20' gap={8}>
				<h3>
					<span className='color-5'>List.</span>Virtual
				</h3>
			</Flex>
			<p className='mb-12'>
				虚拟列表，基于
				<a
					href='https://github.com/react-component/virtual-list'
					target='_blank'
					className='link mx-2'
				>
					rc-virtual-list
				</a>
				实现虚拟DOM列表滚动
			</p>
			<Demo source={DVirtual} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 id='list' className='mb-20 blue'>
				List
			</h4>
			<Api apis={PList} />

			<h4 id='list-item' className='mt-40 mb-20'>
				<span className='blue'>
					<span className='opacity-5'>List.</span>Item
				</span>
			</h4>
			<Api apis={PListItem} className='mb-40' />

			<h4 id='list-virtual' className='mb-20'>
				<Flex gap={12}>
					<span className='blue'>
						<span className='opacity-5'>List.</span>Virtual
					</span>

					<span className='color-5'>extends</span>
					<a
						href='https://github.com/react-component/virtual-list'
						target='_blank'
						className='link mx-2'
					>
						rc-virtual-list
					</a>
				</Flex>
			</h4>
			<Api apis={PListVirtual} className='mb-80' />
		</>
	);
}
