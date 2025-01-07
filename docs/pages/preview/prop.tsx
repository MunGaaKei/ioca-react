import fantasy from "@d/assets/fantasy.jpg";
import jay from "@d/assets/jay.jpg";
import videoDemo from "@d/assets/video.mp4";
import { Button, usePreview } from "@p";
import { Link } from "react-router";

export const DBasic = {
	demo: () => {
		const preview = usePreview();
		const handlePreview = () =>
			preview({
				items: [
					{
						src: jay,
					},
					fantasy,
					videoDemo,
					"https://www.pwithe.com/Public/Upload/download/20170211/589ebf8e5bb13.pdf",
				],
			});

		return <Button onClick={handlePreview}>预览</Button>;
	},
	code: `const preview = usePreview();
const handlePreview = () =>
	preview({
		items: [
			{
				src: "/assets/jay.jpg",
			},
			"/assets/fantasy.jpg",
			"/assets/video.mp4",
			"https://www.pwithe.com/Public/Upload/download/20170211/589ebf8e5bb13.pdf",
		],
	});

return <Button onClick={handlePreview}>预览</Button>;`,
	lang: "javascript",
};

export const PPreiview = [
	{
		name: "items",
		desc: "内容数组",
		type: [
			"string[]",
			<a className='blue' href='#i-preview-item'>
				IPreviewItem[]
			</a>,
		],
		required: true,
	},
	{
		name: "initial",
		desc: "初始索引",
		type: ["number"],
	},
	{
		name: "controls",
		desc: "显示控制栏",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "loop",
		desc: "可以循环",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "modalProps",
		desc: "该组件使用了 Modal",
		type: [
			<Link className='link' to='/docs/modal#i-modal'>
				IModal
			</Link>,
		],
	},
	{
		name: "renderImage",
		desc: "渲染图片类型方式",
		type: [
			<>
				(file:{" "}
				<a className='blue' href='#i-preview-item'>
					IPreviewItem
				</a>
				) =&gt; ReactNode
			</>,
		],
	},
	{
		name: "renderFile",
		desc: "渲染文件方式",
		type: [
			<>
				(file:{" "}
				<a className='blue' href='#i-preview-item'>
					IPreviewItem
				</a>
				) =&gt; ReactNode
			</>,
		],
	},
	{
		name: "onClose",
		desc: "关闭时触发",
		type: ["() => void"],
		event: true,
	},
	{
		name: "onChange",
		desc: "切换时触发",
		type: ["(after: number, before: number) => void"],
		event: true,
	},
	{
		name: "onZoom",
		desc: "缩放时触发",
		type: ["(scale: number) => void"],
		event: true,
	},
	{
		name: "onRotate",
		desc: "旋转时触发",
		type: ["(deg: number) => void"],
		event: true,
	},
];

export const PPreviewItem = [
	{
		name: "src",
		desc: "文件路径",
		type: ["string"],
		required: true,
	},
	{
		name: "name",
		desc: "文件名",
		type: ["ReactNode"],
	},
	// {
	// 	name: "thumb",
	// 	desc: "缩略图路径",
	// 	type: ["string"],
	// },
];
