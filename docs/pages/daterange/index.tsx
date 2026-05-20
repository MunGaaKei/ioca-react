import { Flex } from "@p";
import { Link } from "react-router";
import Api from "../components/api";
import Demo from "../components/demo";
import { DDateRange, PDateRange } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>DateRange</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DDateRange} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 className='blue mb-12'>
				<Flex gap={12} wrap>
					<span>DateRange</span>
					<span className='color-5'>extends</span>
					<Link to='/docs/input#api' className='blue'>
						Input
					</Link>
				</Flex>
			</h4>
			<Api apis={PDateRange} />
		</>
	);
}
