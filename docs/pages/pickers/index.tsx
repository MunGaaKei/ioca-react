import { Flex } from "@p";
import Api from "../components/api";
import Demo from "../components/demo";
import { DColors, DDates, DTime, PColor, PDates, PTime } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Pickers</h2>
			<h3 className='mb-12'>DatePicker</h3>
			<Demo source={DDates} />

			<h3 className='mb-12 mt-40'>TimePicker</h3>
			<Demo source={DTime} />

			<h3 className='mb-12 mt-40'>ColorPicker</h3>
			<Demo source={DColors} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 className='blue mb-12'>DatePicker</h4>
			<Api apis={PDates} />

			<h4 className='blue mt-40 mb-12'>TimePicker</h4>
			<Api apis={PTime} />

			<h4 className='blue mt-40 mb-12'>
				<Flex gap={12} wrap>
					<span className='blue'>ColorPicker</span>

					<span className='color-5'>extends</span>
					<a
						href='https://github.com/react-component/color-picker'
						target='_blank'
						className='link mx-2'
					>
						@rc-component/color-picker
					</a>
				</Flex>
			</h4>
			<Api apis={PColor} />
		</>
	);
}
