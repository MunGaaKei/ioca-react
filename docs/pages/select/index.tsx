import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, DMultiple, PSelect } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Select</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-12'>多选</h3>
			<Demo source={DMultiple} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<Api apis={PSelect} />
		</>
	);
}
