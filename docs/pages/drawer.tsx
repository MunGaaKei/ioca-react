import Api from "./components/api";
import Demo from "./components/demo";
import { DBasic, PDrawer } from "./components/props/drawer";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Drawer</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<Api apis={PDrawer} />
		</>
	);
}
