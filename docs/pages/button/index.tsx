import { Flex } from "@p";
import { Link } from "react-router";
import Api from "../components/api";
import Demo from "../components/demo";
import {
	DBasic,
	DColor,
	DGroup,
	DToggle,
	PButton,
	PButtonGroup,
	PButtonToggle,
} from "./prop";

export default function button(): JSX.Element {
	return (
		<>
			<h2 className='mb-40'>Button</h2>
			<h3 className='mb-20'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-80 mb-4'>颜色</h3>
			<p className='color-5 mb-12'>
				颜色选择参考
				<Link to='/docs/colors' className='blue'>
					页面
				</Link>
			</p>
			<Demo source={DColor} />

			<h3 className='mt-80 mb-20'>
				<span className='color-5'>Button.</span>Toggle
			</h3>
			<Demo source={DToggle} inline />

			<h3 className='mt-80 mb-20'>
				<span className='color-5'>Button.</span>Group
			</h3>
			<Demo source={DGroup} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>

			<h4 id='button' className='mb-20 blue'>
				Button
			</h4>
			<Api apis={PButton} className='mb-40' />

			<h4 id='button-toggle' className='mb-20'>
				<Flex gap={12}>
					<span className='blue'>
						<span className='opacity-5'>Button.</span>Toggle
					</span>

					<span className='color-5'>extends</span>
					<a href='#button' className='blue'>
						Button
					</a>
				</Flex>
			</h4>
			<Api apis={PButtonToggle} className='mb-40' />

			<h4 id='button-group' className='mb-20'>
				<Flex gap={12}>
					<span className='blue'>
						<span className='opacity-5'>Button.</span>Group
					</span>
				</Flex>
			</h4>
			<Api apis={PButtonGroup} className='mb-80' />
		</>
	);
}
