import { Button, Flex } from "@p";

export default function Page() {
	const colors = [
		"black",
		"white",
		"red",
		"blue",
		"green",
		"yellow",
		"pink",
		"purple",
		"orange",
		"aqua",
		"grey",
		"brown",
	];
	const statusColors = ["warning", "success", "error"];

	return (
		<>
			<h2 className='mb-40'>Colors</h2>
			<p>以下为基础颜色。</p>
			<Flex className='my-12' gap={4} wrap>
				{colors.map((c) => {
					return (
						<div key={c} className={`bg-${c} pd-12 round-0`}>
							{c}
						</div>
					);
				})}

				{statusColors.map((c) => {
					return (
						<div key={c} className={`bg-${c} pd-12 round-0`}>
							{c}
						</div>
					);
				})}
                
			</Flex>

			<h3 className='mt-80'>使用方法</h3>
			<p className='my-12'>每个颜色都有 4 种类名提供使用：</p>
			<Flex
				gap={4}
				columns={"repeat(4, auto)"}
				className='text-center'
				style={{ fontSize: ".9em" }}
			>
				<Button className='yellow-0'>.yellow-0</Button>
				<Button className='yellow'>.yellow</Button>
				<Button className='bg-yellow-0 color-1'>.bg-yellow-0 .color-1</Button>
				<Button className='bg-yellow'>.bg-yellow</Button>

				<div className='blue-0 pd-8 round-0'>.blue-0</div>
				<div className='blue pd-8 round-0'>.blue</div>
				<div className='bg-blue-0 pd-8 round-0'>.bg-blue-0</div>
				<div className='bg-blue pd-8 round-0'>.bg-blue</div>

				<div className='error-0 pd-8 round-0'>.error-0</div>
				<div className='error pd-8 round-0'>.error</div>
				<div className='bg-error-0 pd-8 round-0'>.bg-error-0</div>
				<div className='bg-error pd-8 round-0'>.bg-error</div>


			</Flex>

			<h3 className='mt-80'>黑白</h3>
			<p className='my-12'>
				从 0 ～ 9，都有对应字体色类名<code className="code">.color-[i]</code>
				和背景色类名<code className="code">.bg-[i]</code>。
			</p>
			<Flex columns={10} style={{ textAlign: "center" }} gap={4}>
				{Array.from({ length: 10 }).map((_, i) => {
					return (
						<div key={i} className={`color-${i}`}>
							{i}
						</div>
					);
				})}
				{Array.from({ length: 10 }).map((_, i) => {
					return (
						<div key={i} className={`bg-${i} round-0 pd-4`}>
							{i}
						</div>
					);
				})}
			</Flex>
		</>
	);
}
