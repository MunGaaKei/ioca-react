import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, DType, PCheckbox, PCheckboxItem } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Checkbox</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-12'>更多类型</h3>
			<Demo source={DType} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 className='mb-12 blue'>Checkbox</h4>
			<Api apis={PCheckbox} />

			<h4 className='mt-80 mb-20 blue'>
				<span className='opacity-5'>Checkbox.</span>Item
			</h4>
			<Api apis={PCheckboxItem} />
		</>
	);
}
