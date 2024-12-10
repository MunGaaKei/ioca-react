import { Flex } from "@p";
import { Link } from "react-router-dom";
import Api from "./components/api";
import Demo from "./components/demo";
import {
	DBasic,
	DImageList,
	PImage,
	PImageList,
} from "./components/props/image";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Image</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-20'>
				<span className='color-5'>Image.</span>List
			</h3>
			<Demo source={DImageList} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 className='mb-12 blue'>Image</h4>
			<Api apis={PImage} />

			<h4 className='mb-12 mt-40'>
				<Flex gap={12}>
					<span className='blue'>
						<span className='opacity-5'>Image.</span>List
					</span>

					<span className='color-5'>extends</span>
					<Link to='/docs/flex#flex' className='blue'>
						Flex
					</Link>
				</Flex>
			</h4>
			<Api apis={PImageList} />
		</>
	);
}
