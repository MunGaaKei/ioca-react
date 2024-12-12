import Api from "../components/api";
import CodeView from "../components/code";
import Demo from "../components/demo";
import { DBasic, PRefTree, PTree, PTreeItem } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Tree</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 className='blue mb-12'>Tree</h4>
			<Api apis={PTree} />

			<h4 id='tree-item' className='mt-40 mb-20'>
				<span className='blue'>
					<span className='opacity-5'>Tree.</span>Item
				</span>
			</h4>
			<Api apis={PTreeItem} />

			<h4 id='ref-tree' className='mt-40 mb-12 blue'>
				RefTree
			</h4>
			<CodeView lang='typescript'>{PRefTree}</CodeView>
		</>
	);
}
