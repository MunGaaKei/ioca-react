import Api from "./components/api";
import CodeView from "./components/code";
import Demo from "./components/demo";
import { DBasic, PRefVideo, PVideo } from "./components/props/video";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Video</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<Api apis={PVideo} />

			<h4 id='ref-video' className='mt-40 mb-12 blue'>
				RefVideo
			</h4>
			<CodeView lang='typescript'>{PRefVideo}</CodeView>
		</>
	);
}
