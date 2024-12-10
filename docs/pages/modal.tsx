import Api from "./components/api";
import Demo from "./components/demo";
import { DBasic, DCustom, PModal } from "./components/props/modal";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Modal</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-12'>自定义内容</h3>
			<Demo source={DCustom} />

			<h3 id='i-modal' className='mt-80 mb-20'>
				Api 参考
			</h3>
			<Api apis={PModal} />
		</>
	);
}
