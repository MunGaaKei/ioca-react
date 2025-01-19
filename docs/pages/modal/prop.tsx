import { Button, Modal } from "@p";
import { useState } from "react";
import { Link } from "react-router";

export const DBasic = {
	demo: () => {
		const [visible, setVisible] = useState(false);

		return (
			<>
				<Button onClick={() => setVisible(true)}>打开</Button>

				<Modal
					visible={visible}
					title='标题'
					width={400}
					okButtonProps={{
						children: "知道了",
					}}
					onClose={() => setVisible(false)}
				>
					<div className='px-12'>
						Lorem ipsum dolor sit amet, consectetur adipisicing
						elit. Accusamus harum facilis deserunt. Ut molestiae
						nulla laborum doloribus ratione est perferendis
						laboriosam omnis nesciunt fuga sequi odio suscipit
						alias, modi ipsum.
					</div>
				</Modal>
			</>
		);
	},
	code: `const [visible, setVisible] = useState(false);

return (
	<>
		<Button onClick={() => setVisible(true)}>打开</Button>

		<Modal
			visible={visible}
			title='标题'
			width={400}
			okButtonProps={{
				children: "知道了",
			}}
			onClose={() => setVisible(false)}
		>
			<div className='px-12'>
				Lorem ipsum dolor sit amet, consectetur adipisicing
				elit. Accusamus harum facilis deserunt. Ut molestiae
				nulla laborum doloribus ratione est perferendis
				laboriosam omnis nesciunt fuga sequi odio suscipit
				alias, modi ipsum.
			</div>
		</Modal>
	</>
);`,
	lang: "javascript",
};

export const DCustom = {
	demo: () => {
		const [visible, setVisible] = useState(false);

		return (
			<>
				<Button onClick={() => setVisible(true)}>打开</Button>

				<Modal
					visible={visible}
					customized
					onClose={() => setVisible(false)}
				>
					<div
						style={{
							width: 250,
							height: 250,
							backgroundImage:
								"linear-gradient(-225deg, #2f72e7 0%, #a167f9 48%, #ff3bc1 100%)",
						}}
					></div>
				</Modal>
			</>
		);
	},
	code: `const [visible, setVisible] = useState(false);

return (
    <>
        <Button onClick={() => setVisible(true)}>打开</Button>

        <Modal
			visible={visible}
			customized
			onClose={() => setVisible(false)}
		>
			<div
				style={{
					width: 250,
					height: 250,
					backgroundImage:
						"linear-gradient(-225deg, #2f72e7 0%, #a167f9 48%, #ff3bc1 100%)",
				}}
			></div>
		</Modal>
    </>
);`,
	lang: "javascript",
};

export const PModal = [
	{
		name: "visible",
		desc: "你知道的",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "title",
		desc: "标题内容",
		type: ["ReactNode"],
	},
	{
		name: "children",
		desc: "对话框内容",
		type: ["ReactNode"],
	},
	{
		name: "footer",
		desc: "对话框底部内容，设置为 null 会隐藏底部",
		type: ["ReactNode", "null"],
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
		name: "footerLeft",
		desc: "底部左侧内容",
		type: ["ReactNode"],
	},
	{
		name: "closable",
		desc: "对话框是否可以关闭",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "hideCloseButton",
		desc: "隐藏右上角关闭按钮",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "hideBackdrop",
		desc: "隐藏背景层",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "backdropClosable",
		desc: "点击背景层可以关闭对话框",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "disableEsc",
		desc: (
			<>
				按下<kbd>Esc</kbd>可以关闭对话框
			</>
		),
		type: ["boolean"],
		def: "false",
	},
	{
		name: "width",
		desc: "对话框最大宽度",
		type: ["string", "number"],
	},

	{
		name: "height",
		desc: "对话框最大高度",
		type: ["string", "number"],
	},
	{
		name: "hideShadow",
		desc: "隐藏对话框阴影",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "customized",
		desc: "对话框内容完全自定义",
		type: ["boolean"],
		def: "false",
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
	{
		name: "onVisibleChange",
		desc: "打开关闭对话框回调",
		type: ["(visible: boolean) => void"],
		event: true,
	},
];
