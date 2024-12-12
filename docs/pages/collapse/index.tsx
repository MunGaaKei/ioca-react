import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, PCollapse, PCollapseItem } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Collapse</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 className='mb-20 blue'>Collapse</h4>
			<Api apis={PCollapse} />

			<h4 id='collapse-item' className='mt-40 mb-20 blue'>
				<span className='opacity-5'>Collapse.</span>Item
			</h4>
			<Api apis={PCollapseItem} />
		</>
	);
}
