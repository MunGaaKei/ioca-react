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
					onVisibleChange={setVisible}
				>
					<div
						className='px-12'
						style={{ width: 400, whiteSpace: "pre-wrap" }}
					>
						这故事一开始的镜头灰尘就已经遮蔽了阳光
						<br />
						ㄅㄧㄤˋ
						<br />
						恐惧刻在孩子们脸上
						<br />
						麦田已倒向战车经过的方向
						<br />
						蒲公英的形状 在飘散
						<br />
						它绝望 的飞翔
						<br />
						她只唱 只想
						<br />
						这首止战 之殇
						<br />
						恶夜燃烛光 天破息战乱
						<br />
						殇歌传千里 家乡平饥荒
						<br />
						天真在这条路上
						<br />
						跌跌撞撞
						<br />
						她被芒草割伤
						<br />
						孩子们眼中的希望 是什么形状
						<br />
						是否醒来有面包当早餐 再喝碗热汤
						<br />
						农夫被烧毁土地跟村庄 终于拿起枪
						<br />
						她却慢慢习惯放弃了抵抗
						<br />
						孩子们眼中的希望 是什么形状
						<br />
						是否院子有秋千可以荡 口袋里有糖
						<br />
						刺刀的光被仇恨所擦亮 在远方野蛮
						<br />
						而她却微笑着不知道慌张
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
			onVisibleChange={setVisible}
		>
			<div
				className='px-12'
				style={{ width: 400, whiteSpace: "pre-line" }}
			>
				这故事一开始的镜头灰尘就已经遮蔽了阳光
				ㄅㄧㄤˋ
				恐惧刻在孩子们脸上
				麦田已倒向战车经过的方向
				蒲公英的形状 在飘散
				它绝望 的飞翔
				她只唱 只想
				这首止战 之殇
				恶夜燃烛光 天破息战乱
				殇歌传千里 家乡平饥荒
				天真在这条路上
				跌跌撞撞
				她被芒草割伤
				孩子们眼中的希望 是什么形状
				是否醒来有面包当早餐 再喝碗热汤
				农夫被烧毁土地跟村庄 终于拿起枪
				她却慢慢习惯放弃了抵抗
				孩子们眼中的希望 是什么形状
				是否院子有秋千可以荡 口袋里有糖
				刺刀的光被仇恨所擦亮 在远方野蛮
				而她却微笑着不知道慌张
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
