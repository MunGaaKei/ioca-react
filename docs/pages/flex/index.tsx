import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, DGrid, PFlex } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Flex</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-12'>Grid</h3>
			<p className='mb-12'>
				设置 columns 可以使布局转化为
				Grid。下面的例子会根据屏幕宽度变化自动适应宽度。
			</p>
			<Demo source={DGrid} />

			<h3 id='flex' className='mt-80 mb-20'>
				Api 参考
			</h3>
			<Api apis={PFlex} />
		</>
	);
}
