import Api from "../components/api";
import CodeView from "../components/code";
import Demo from "../components/demo";
import { DBasic, PField, PForm, PFormInstance } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Form</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 className='mb-12 blue'>Form</h4>
			<Api apis={PForm} />

			<h4 className='mt-40 mb-12 blue'>
				<span className='opacity-5'>Form.</span>Field
			</h4>
			<Api apis={PField} />

			<h4 id='formInstance' className='mt-40 mb-12 blue'>
				IFormInstance
			</h4>
			<CodeView lang='typescript'>{PFormInstance}</CodeView>
		</>
	);
}
