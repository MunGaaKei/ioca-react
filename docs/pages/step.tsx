import Api from "./components/api";
import Demo from "./components/demo";
import { DBasic, PStep, PStepItem } from "./components/props/step";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Step</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 className='blue mb-20'>Step</h4>
			<Api apis={PStep} />

			<h4 id='step-item' className='mt-40 mb-20'>
				<span className='blue'>
					<span className='opacity-5'>Step.</span>Item
				</span>
			</h4>
			<Api apis={PStepItem} />
		</>
	);
}
