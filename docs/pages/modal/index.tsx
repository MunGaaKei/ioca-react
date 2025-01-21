import Api from "../components/api";
import CodeView from "../components/code";
import Demo from "../components/demo";
import { DBasic, DCustom, DUseModal, PModal, PRefHookModal } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Modal</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-12'>自定义内容</h3>
			<Demo source={DCustom} />

			<h3 className='mt-80 mb-12'>useModal</h3>
			<p className='mb-12'>通过hook方式打开对话框</p>
			<Demo source={DUseModal} />

			<h3 id='i-modal' className='mt-80 mb-20'>
				Api 参考
			</h3>
			<Api apis={PModal} />

			<h4 id='refHookModal' className='mt-40 mb-12 blue'>
				RefHookModal
			</h4>
			<CodeView lang='typescript'>{PRefHookModal}</CodeView>
		</>
	);
}
