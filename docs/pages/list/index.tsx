import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, PList, PListItem } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>List</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

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
		</>
	);
}
