import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, PData, PDescription } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Description</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 className='mb-20 blue'>Description</h4>
			<Api apis={PDescription} />

			<h4 id='i-data' className='mt-40 mb-20 blue'>
				IData
			</h4>
			<Api apis={PData} />
		</>
	);
}
