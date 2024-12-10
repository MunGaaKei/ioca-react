import Api from "./components/api";
import Demo from "./components/demo";
import {
	DBasic,
	DNumber,
	DRange,
	DTextarea,
	PInput,
	PInputNumber,
	PInputRange,
	PTextarea,
} from "./components/props/input";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>Input</h2>
			<h3 className='mb-12'>示例</h3>
			<Demo source={DBasic} />

			<h3 className='mt-40 mb-20'>Input.Number</h3>
			<Demo source={DNumber} />

			<h3 className='mt-40 mb-20'>Input.Range</h3>
			<Demo source={DRange} />

			<h3 className='mt-40 mb-20'>Input.Textarea</h3>
			<Demo source={DTextarea} />

			<h3 className='mt-80 mb-20'>Api 参考</h3>
			<h4 id='input' className='blue mb-12'>
				Input
			</h4>
			<Api apis={PInput} />

			<h4 className='mt-40 mb-20 blue'>
				<span className='opacity-5'>Input.</span>Number
			</h4>
			<Api apis={PInputNumber} />

			<h4 className='mt-40 mb-20 blue'>
				<span className='opacity-5'>Input.</span>Range
			</h4>
			<Api apis={PInputRange} />

			<h4 className='mt-40 mb-20 blue'>
				<span className='opacity-5'>Input.</span>Textarea
			</h4>
			<Api apis={PTextarea} />
		</>
	);
}
