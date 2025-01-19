import Api from "../components/api";
import CodeView from "../components/code";
import Demo from "../components/demo";
import { DBasic, PEditor, PRef } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Editor</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 id='flex' className='mt-80 mb-20'>
				Api 参考
			</h3>
			<Api apis={PEditor} />

			<h4 id='ref-editor' className='mt-40 mb-12 blue'>
				RefEditor
			</h4>
			<CodeView lang='typescript'>{PRef}</CodeView>
		</>
	);
}
