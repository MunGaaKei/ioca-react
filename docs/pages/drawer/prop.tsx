import { Button, Drawer } from "@p";
import { useState } from "react";

export const DBasic = {
	demo: () => {
		const [visible, setVisible] = useState(false);

		return (
			<>
				<Button onClick={() => setVisible(true)}>打开</Button>
				<Drawer
					visible={visible}
					header={<h5>止战之殇</h5>}
					footer={<Button className='bg-red mx-auto'>播放</Button>}
					onVisibleChange={setVisible}
				>
					<div className='px-12'>
						恶夜燃烛光 天破息战乱 <br /> 殇歌传千里 家乡平饥荒
					</div>
				</Drawer>
			</>
		);
	},
	code: `const [visible, setVisible] = useState(false);

return (
	<>
		<Button onClick={() => setVisible(true)}>打开</Button>
		<Drawer
			visible={visible}
			header={<h5>止战之殇</h5>}
			footer={<Button className='bg-red mx-auto'>播放</Button>}
			onVisibleChange={setVisible}
		>
			<div className='px-12'>
				恶夜燃烛光 天破息战乱 <br /> 殇歌传千里 家乡平饥荒
			</div>
		</Drawer>
	</>
);`,
	lang: "javascript",
};

export const PDrawer = [
	{
		name: "visible",
		desc: "是否显示",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "position",
		desc: "打开位置",
		type: ["'top'", "'left'", "'bottom'", "'right'"],
		def: "'left'",
	},
	{
		name: "header",
		desc: "头部内容",
		type: ["ReactNode"],
	},
	{
		name: "footer",
		desc: "底部内容",
		type: ["ReactNode"],
	},
	{
		name: "keepDOM",
		desc: "初次打开后，关闭时不会移除页面DOM",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "hideCloseButton",
		desc: "隐藏关闭按钮",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "backdropClosable",
		desc: "可以通过点击背景层关闭",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "onVisibleChange",
		desc: "打开关闭时触发",
		type: ["(visible: boolean) => void"],
		event: true,
	},
	{
		name: "onClose",
		desc: "关闭时触发",
		type: ["() => void"],
		event: true,
	},
];
