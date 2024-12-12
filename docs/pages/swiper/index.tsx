import Api from "../components/api";
import CodeView from "../components/code";
import Demo from "../components/demo";
import { DBasic, DVertical, PRefSwiper, PSwiper } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Swiper</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-12'>垂直方向</h3>
			<Demo source={DVertical} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 className='blue mb-20'>Swiper</h4>
			<Api apis={PSwiper} />

			<h4 id='ref-swiper' className='mt-40 mb-12 blue'>
				RefSwiper
			</h4>
			<CodeView lang='typescript'>{PRefSwiper}</CodeView>
		</>
	);
}
