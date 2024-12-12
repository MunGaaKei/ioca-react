import Api from "../components/api";
import CodeView from "../components/code";
import Demo from "../components/demo";
import { DBasic, DUploadCard, PFile, PRefFile, PUpload } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Upload</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mb-12 mt-80'>卡片模式</h3>
			<Demo source={DUploadCard} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<Api apis={PUpload} />

			<h4 id='reffile' className='mt-40 mb-12 blue'>
				RefUpload
			</h4>
			<CodeView lang='typescript'>{PRefFile}</CodeView>

			<h4 id='ifile' className='mt-40 mb-12 blue'>
				IFile
			</h4>
			<CodeView lang='typescript'>{PFile}</CodeView>
		</>
	);
}
