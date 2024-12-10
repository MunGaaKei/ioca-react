import Api from "./components/api";
import Demo from "./components/demo";
import { DBasic, DVariant, PPopup } from "./components/props/popup";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Popup</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mb-12 mt-80'>其它类型</h3>
			<Demo source={DVariant} defaultCollapse />

			<h3 id='#api' className='mt-80 mb-20'>
				Api 参考
			</h3>
			<Api apis={PPopup} />
		</>
	);
}
