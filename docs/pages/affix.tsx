import Api from "./components/api";
import Demo from "./components/demo";
import { DBasic, PAffix } from "./components/props/affix";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Affix</h2>
			<h3>示例</h3>
			<p className='color-5 mt-8'>页面滚动到一定位置会显示置顶按钮</p>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<Api apis={PAffix} />

			<div style={{ height: "40vh" }}></div>
		</>
	);
}
