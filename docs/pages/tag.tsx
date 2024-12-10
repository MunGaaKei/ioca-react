import { Link } from "react-router-dom";
import Api from "./components/api";
import Demo from "./components/demo";
import { DBasic, DColors, PTag } from "./components/props/tag";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Tag</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-12'>多种颜色</h3>
			<p className='mb-12'>
				参考可使用的
				<Link to='/docs/colors' className='blue'>
					颜色
				</Link>
			</p>
			<Demo source={DColors} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<Api apis={PTag} />
		</>
	);
}
