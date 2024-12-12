import { Flex } from "@p";
import { Link } from "react-router-dom";
import Api from "../components/api";
import Demo from "../components/demo";
import { DBasic, PPopconfirm } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Popconfirm</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-12'>Api 参考</h3>
			<h4 className='mb-12'>
				<Flex gap={12}>
					<span className='blue'>Popconfirm</span>

					<span className='color-5'>extends</span>
					<Link to='/docs/popup#api' className='blue'>
						Popup
					</Link>
				</Flex>
			</h4>
			<Api apis={PPopconfirm} />
		</>
	);
}
