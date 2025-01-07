import demo from "@d/assets/video.mp4";
import { Video } from "@p";
import { Link } from "react-router";

export const DBasic = {
	demo: () => {
		return <Video src={demo} />;
	},
	code: `<Video src='your-video-src.mp4' />`,
	lang: "xml",
};

export const PVideo = [
	{
		name: "src",
		desc: "媒体文件路径",
		type: ["string"],
	},
	{
		name: "hideControls",
		desc: "隐藏控制组件",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "autoplay",
		desc: "自动播放",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "muted",
		desc: "默认静音",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "volume",
		desc: "初始音量大小，取值范围 0 ~ 100",
		type: ["number"],
		def: "50",
	},
	{
		name: "height",
		desc: "高度",
		type: ["string", "number"],
	},
	{
		name: "width",
		desc: "宽度",
		type: ["string", "number"],
	},
	{
		name: "useOriginControls",
		desc: "使用原生控制组件",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "timeProgressProps",
		desc: "进度条属性",
		type: [
			<Link className='link' to='/docs/progress#progress'>
				IProgress
			</Link>,
		],
	},
	{
		name: "volumeProgressProps",
		desc: "音量条属性",
		type: [
			<Link className='link' to='/docs/progress#progress'>
				IProgress
			</Link>,
		],
	},
	{
		name: "onFullScreenChange",
		desc: "全屏切换时触发",
		type: ["(fullscreen: boolean) => void"],
		event: true,
	},
];

export const PRefVideo = `interface RefVideo {

	play: () => void;

	pause: () => void;

	stop: () => void;

	fullscreen: (full?: boolean) => void;

	getVideo: () => HTMLVideoElement | null;
    
}
`;
