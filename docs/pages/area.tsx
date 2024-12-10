import { Icon, Popup } from "@p";
import { ErrorTwotone } from "@ricons/material";
import Api from "./components/api";
import Demo from "./components/demo";
import { DBasic, PArea } from "./components/props/area";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>
				Area{" "}
				<Popup
					content='组件仍需完善，暂时不推荐使用'
					className='pd-8 bg-error-0'
					offset={4}
				>
					<Icon
						icon={<ErrorTwotone />}
						size='20px'
						className='error'
					/>
				</Popup>
			</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<Api apis={PArea} />
		</>
	);
}
