import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, DType, PRadio } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Radio</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-12'>更多类型</h3>
			<Demo source={DType} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<Api apis={PRadio} />
		</>
	);
}
