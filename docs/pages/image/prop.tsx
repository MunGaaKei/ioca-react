import dimensions from "@d/assets/dimensions.jpg";
import fantasy from "@d/assets/fantasy.jpg";
import jay from "@d/assets/jay.jpg";
import yehuimei from "@d/assets/yehuimei.jpg";
import { Flex, Image } from "@p";
import { Link } from "react-router";

export const DBasic = {
	demo: (
		<Flex gap={8}>
			<Image src={jay} size={80} />
			<Image
				src={jay}
				size={80}
				cover='周杰伦'
				coverClass='hover-opacity'
			/>
		</Flex>
	),
	code: `<Flex gap={8}>
	<Image src={jay} size={80} />
	<Image
		src={jay}
		size={80}
		cover='周杰伦'
		coverClass='hover-opacity'
	/>
</Flex>`,
	lang: "xml",
};

export const DImageList = {
	demo: (
		<Image.List items={[jay, fantasy, dimensions, yehuimei]} usePreview />
	),
	code: `<Image.List items={['jay.jpg', 'fantasy.jpg', 'dimensions.jpg', 'yehuimei.jpg']} usePreview />`,
	lang: "xml",
};

export const PImage = [
	{
		name: "src",
		desc: "图片地址",
		type: ["string"],
	},
	{
		name: "round",
		desc: "圆形",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "size",
		desc: "图片大小",
		type: ["number", "string"],
	},
	{
		name: "initSize",
		desc: "图片初始大小，图片未加载完时显示大小",
		type: ["number", "string"],
	},
	{
		name: "lazyload",
		desc: "图片懒加载",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "cover",
		desc: "图片封面",
		type: ["ReactNode"],
	},
	{
		name: "coverClass",
		desc: "图片封面类名",
		type: ["string"],
	},
	{
		name: "fallback",
		desc: "图片加载失败时显示",
		type: ["ReactNode"],
	},
	{
		name: "fit",
		desc: "图片CSS Object-fit",
		type: ["string"],
	},
	{
		name: "usePreview",
		desc: "开启图片预览功能",
		type: ["boolean"],
		def: "false",
	},
];

export const PImageList = [
	{
		name: "items",
		desc: "图片路径",
		type: [
			"string[]",
			<Link className='link' to='#image'>
				IImage[]
			</Link>,
		],
	},
];
