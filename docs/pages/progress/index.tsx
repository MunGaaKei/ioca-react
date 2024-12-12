import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, DCircle, PProgress } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Progress</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mb-12 mt-80'>环形</h3>
			<Demo source={DCircle} />

			<h3 id='progress' className='mt-80 mb-12'>
				Api 参考
			</h3>
			<Api apis={PProgress} />
		</>
	);
}
