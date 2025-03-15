import { Icon, Radio } from "@p";
import { useState } from "react";

export const DBasic = {
	demo: <Radio options={["Cat", "Dog", "Kuma"]} />,
	code: `<Radio options={["Cat", "Dog", "Kuma"]} />`,
	lang: "xml",
};

export const AnimalSvg = {
	Cat: (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
			<g fill='none'>
				<path
					d='M3.64 15h8.043c.858 0 1.553-.696 1.553-1.554V6.914c1.407-.101 2.236-1.676 1.475-2.905l-.435-.702a1.904 1.904 0 0 0-1.619-.902h-1.176v-.483A.921.921 0 0 0 10.56 1a2.186 2.186 0 0 0-2.186 2.186v2.936c-1.096.123-1.93.652-2.542 1.388c-.688.826-1.09 1.899-1.33 2.924a14.837 14.837 0 0 0-.35 2.814c-.01.292-.01.548-.008.752h-.503a1.642 1.642 0 0 1-1.2-2.763l.797-.855a3.177 3.177 0 0 0-.076-4.412l-.782-.783a.5.5 0 1 0-.707.707l.783.783A2.176 2.176 0 0 1 2.508 9.7l-.798.855A2.643 2.643 0 0 0 3.64 15zm6.841-12.997v.902a.5.5 0 0 0 .5.5h1.676c.313 0 .604.162.77.429l.435.702a.905.905 0 0 1-.77 1.383h-.355a.5.5 0 0 0-.5.5v7.027a.554.554 0 0 1-.554.554h-.553v-.554a2.607 2.607 0 0 0-2.607-2.608h-.878a.5.5 0 0 0 0 1h.878c.887 0 1.607.72 1.607 1.608V14H5.144c-.003-.193-.002-.437.007-.719c.024-.722.105-1.675.325-2.62c.222-.952.577-1.855 1.124-2.511c.531-.638 1.25-1.055 2.274-1.055a.5.5 0 0 0 .5-.5V3.186c0-.628.489-1.143 1.107-1.183z'
					fill='currentColor'
				></path>
			</g>
		</svg>
	),
	Dog: (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
			<g fill='none'>
				<path
					d='M9.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 1 0a.5.5 0 0 1 1 0a1.5 1.5 0 0 1-2.08 1.384a8.055 8.055 0 0 1-.609 2.297C7.9 8.12 7.36 8.79 6.873 9.333c-.348.389-.573.947-.706 1.611C6.034 11.604 6 12.325 6 13c0 .303-.11.669-.31 1h4.225A1.505 1.505 0 0 0 8.5 13H8a.5.5 0 0 1 0-1h.5c.171 0 .338.017.5.05V10.5a.5.5 0 0 1 1 0v2c.48.36.826.89.95 1.5h1.965a1.5 1.5 0 0 0-1.415-1a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 0 .5-.5v-.934a.5.5 0 0 0-.243-.429L10.98 2.071A.5.5 0 0 0 10.723 2H9.5zM4 14c.314 0 .556-.152.735-.375c.19-.239.265-.507.265-.625c0-.7.035-1.497.186-2.253c.151-.75.427-1.505.941-2.08c.457-.51.918-1.09 1.27-1.889C7.746 5.981 8 4.938 8 3.5v-1A1.5 1.5 0 0 1 9.5 1h1.223a1.5 1.5 0 0 1 .772.214l1.777 1.066A1.5 1.5 0 0 1 14 3.566V4.5A1.5 1.5 0 0 1 12.5 6H12v6.05a2.5 2.5 0 0 1 2 2.45a.5.5 0 0 1-.5.5H3.75a2.75 2.75 0 0 1-1.528-5.037a.5.5 0 1 1 .556.831A1.75 1.75 0 0 0 3.75 14H4z'
					fill='currentColor'
				></path>
			</g>
		</svg>
	),
	Rabbit: (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'>
			<g fill='none'>
				<path
					d='M9.328 6.403l-.895-.887a1.25 1.25 0 0 1 0-1.763a1.243 1.243 0 0 1 1.761 0l3.095 3.09a2.445 2.445 0 0 1 0 3.45c-.5.501-1.163.739-1.817.713a1.687 1.687 0 0 1-1.54.998H4.69c-.935 0-1.69-.76-1.69-1.694V9.244c0-.298.048-.586.136-.855a1.75 1.75 0 1 1 2.348-1.878a2.75 2.75 0 0 1 .246-.01h3.163c.119 0 .235.008.347.023c.028-.04.058-.08.089-.121zm.158-1.944a.243.243 0 0 0-.345 0a.25.25 0 0 0 0 .35l1.596 1.583l-.465.446c-.172.182-.264.32-.318.446l-.172.404l-.423-.119a1.727 1.727 0 0 0-.467-.069H5.729C4.777 7.5 4 8.28 4 9.244v1.066c0 .385.311.694.69.694h2.316v-.444c0-.25-.255-.56-.69-.56h-.818a.5.5 0 0 1 0-1h.819c.88 0 1.689.656 1.689 1.56v.444h1.927a.69.69 0 0 0 .684-.609l.065-.56l.549.133c.47.114.984-.014 1.35-.381c.56-.562.56-1.475 0-2.037L9.488 4.46v-.001zM3.63 7.49c.238-.288.533-.526.868-.696L4.5 6.75a.75.75 0 1 0-.87.74z'
					fill='currentColor'
				></path>
			</g>
		</svg>
	),
};

export const DType = {
	demo: () => {
		const [type, setType] = useState<any>("default");

		return (
			<>
				<Radio
					className='mb-12'
					label='type:'
					value={type}
					options={["default", "button", "custom"]}
					labelInline
					onChange={setType}
				/>

				<Radio
					type={type}
					options={["Cat", "Dog", "Rabbit"]}
					labelInline
					renderItem={
						type === "custom"
							? (checked, value) => {
									return (
										<Icon
											icon={AnimalSvg[value]}
											className={checked ? "" : "color-8"}
										/>
									);
							  }
							: undefined
					}
				/>
			</>
		);
	},
	code: `<Radio
	className='mb-12'
	label='type:'
	value={type}
	options={["default", "button", "custom"]}
	labelInline
	onChange={setType}
/>

<Radio
	type={type}
	options={["Cat", "Dog", "Rabbit"]}
	labelInline
	renderItem={
		type === "custom"
			? (checked, value) => {
					return (
						<Icon
							icon={animalSvg[value]}
							className={checked ? "" : "color-8"}
						/>
					);
				}
			: undefined
	}
/>`,
	lang: "xml",
};

export const PRadio = [
	{
		name: "value",
		desc: "值",
		type: ["any"],
	},
	{
		name: "options",
		desc: "选项",
		type: [
			<a href='/docs/form#TOption' className='blue'>
				TOption
			</a>,
			"(number | string)[]",
		],
		required: true,
	},
	{
		name: "label",
		desc: "标签",
		type: ["ReactNode"],
	},
	{
		name: "type",
		desc: "类型",
		type: ["default", "button"],
		def: "'default'",
	},
	{
		name: "optionInline",
		desc: "选项显示为行内元素",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "labelInline",
		desc: "标签与选项显示在同一行",
		type: ["boolean"],
	},
	{
		name: "disabled",
		desc: "禁用状态",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "status",
		desc: "控件状态",
		type: ["normal", "warning", "error", "success"],
		def: "'normal'",
	},
	{
		name: "message",
		desc: "控件显示信息",
		type: ["ReactNode"],
	},
	{
		name: "renderItem",
		desc: (
			<>
				自定义 <span className='blue'>RadioItem</span> 渲染内容，
				<span className='blue'>RadioItem</span> 的<code>children</code>{" "}
				也可以传该函数
			</>
		),
		type: ["(checked: boolean, value: any) => ReactNode"],
	},
	{
		name: "onChange",
		desc: "值发生改变时触发",
		type: [
			<>
				(value: any[], option:&nbsp;
				<a href='/docs/form#TOption' className='blue'>
					TOption
				</a>
				, e: ChangeEvent&lt;HTMLInputElement&gt; ) =&gt; void
			</>,
		],
		event: true,
	},
];
