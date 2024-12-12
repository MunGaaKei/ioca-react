import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, DDynamic, PTabItem, PTabs } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Tabs</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-12'>动态增删</h3>
			<Demo source={DDynamic} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 className='blue mb-20'>Tabs</h4>
			<Api apis={PTabs} />

			<h4 id='tab-item' className='mt-40 mb-20'>
				<span className='blue'>
					<span className='opacity-5'>Tab.</span>Item
				</span>
			</h4>
			<Api apis={PTabItem} />
		</>
	);
}
