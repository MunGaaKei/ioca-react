import Api from "./components/api";
import Demo from "./components/demo";
import { DBasic, PPreiview, PPreviewItem } from "./components/props/preview";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Preview</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<Api apis={PPreiview} />

			<h4 className='mt-40 mb-20 blue'>IPreviewItem</h4>
			<Api apis={PPreviewItem} />
		</>
	);
}
