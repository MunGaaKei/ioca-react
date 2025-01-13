import { Flex } from "@p";
import Api from "../components/api";
import Demo from "../components/demo";
import {
	DBasic,
	DHighLight,
	DNumber,
	DTime,
	PText,
	PTextHighLight,
	PTextNumber,
	PTextTime,
} from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Text</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-40 mb-20'>Text.Number</h3>
			<Demo source={DNumber} />

			<h3 className='mt-40 mb-20'>Text.Time</h3>
			<Demo source={DTime} />

			<h3 className='mt-40 mb-20'>Text.HighLight</h3>
			<Demo source={DHighLight} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 id='text' className='blue mb-12'>
				Text
			</h4>
			<Api apis={PText} />

			<h4 id='text-number' className='mb-20 mt-40'>
				<Flex gap={12}>
					<span className='blue'>
						<span className='opacity-5'>Text.</span>Number
					</span>

					<span className='color-5'>extends</span>
					<a href='#text' className='link mx-2'>
						Text
					</a>
				</Flex>
			</h4>
			<Api apis={PTextNumber} />

			<h4 id='text-time' className='mb-20 mt-40'>
				<Flex gap={12}>
					<span className='blue'>
						<span className='opacity-5'>Text.</span>Time
					</span>

					<span className='color-5'>extends</span>
					<a href='#text' className='link mx-2'>
						Text
					</a>
				</Flex>
			</h4>
			<Api apis={PTextTime} />

			<h4 id='text-highlight' className='mb-20 mt-40'>
				<Flex gap={12}>
					<span className='blue'>
						<span className='opacity-5'>Text.</span>HighLight
					</span>

					<span className='color-5'>extends</span>
					<a href='#text' className='link mx-2'>
						Text
					</a>
				</Flex>
			</h4>
			<Api apis={PTextHighLight} />
		</>
	);
}
