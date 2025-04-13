import { Button, Input, Message, Popconfirm } from "@p";
import { useState } from "react";
import { Link } from "react-router";

export const DBasic = {
	demo: () => {
		const [value, setValue] = useState("");

		return (
			<Popconfirm
				position='bottom'
				content={
					<>
						<h5>警告</h5>
						<p className='my-12 color-5 font-sm'>一段警告描述</p>
						<Input value={value} onChange={setValue} />
					</>
				}
				onOk={async () => {
					if (!value) {
						Message.error("你啥也没输入啊 😧");
						return Promise.reject();
					}
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							Message(`你输入了：${value}`);
							resolve();
						}, 1000);
					});
				}}
				okButtonProps={{ className: "bg-error" }}
			>
				<Button>Click Me</Button>
			</Popconfirm>
		);
	},
	code: `const [value, setValue] = useState("");

return (
	<Popconfirm
		position="bottom"
		content={
			<>
				<h5>警告</h5>
				<p className='my-12 color-5 font-sm'>一段警告描述</p>
				<Input
					value={value}
					onChange={setValue}
					autoFocus
				/>
			</>
		}
		onOk={async () => {
			if (!value) {
				Message.error("你啥也没输入啊 😧");
				return Promise.reject();
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					Message(\`你输入了：\${value}\`);
					resolve();
				}, 1000);
			});
		}}
		okButtonProps={{ className: "bg-error" }}
	>
		<Button>Click Me</Button>
	</Popconfirm>
);`,
	lang: "javascript",
};

export const PPopconfirm = [
	{
		name: "content",
		desc: "显示内容",
		type: ["ReactNode"],
	},
	{
		name: "icon",
		desc: "图标",
		type: ["ReactNode"],
	},
	{
		name: "okButtonProps",
		desc: "确定按钮属性",
		type: [
			<Link className='link' to='/docs/button#button'>
				IButton
			</Link>,
		],
	},
	{
		name: "cancelButtonProps",
		desc: "取消按钮属性",
		type: [
			<Link className='link' to='/docs/button#button'>
				IButton
			</Link>,
		],
	},
	{
		name: "extra",
		desc: "底部中间内容",
		type: ["ReactNode"],
	},
	{
		name: "onOk",
		desc: "点击确定按钮回调",
		type: ["() => Promise<void> | void"],
		event: true,
	},
	{
		name: "onClose",
		desc: "点击关闭按钮回调",
		type: ["() => void"],
		event: true,
	},
];
