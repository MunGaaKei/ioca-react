import { Icon, Resizable } from "@p";
import { DragIndicatorRound } from "@ricons/material";

export const DBasic = {
	demo: () => {
		return (
			<Resizable
				height={200}
				className='bordered round-0'
				other={<div className='pd-4'>One</div>}
				line={<Icon icon={<DragIndicatorRound />} />}
			>
				<Resizable
					vertical
					height='100%'
					asPercent
					size='50%'
					other={<div className='pd-4'>Two</div>}
				>
					<div className='pd-4'>Three</div>
				</Resizable>
			</Resizable>
		);
	},
	code: `<Resizable
    height={200}
    className='bordered round-0'
    other={<div className='pd-4'>One</div>}
    line={<Icon icon={<DragIndicatorRound />} />}
>
    <Resizable
        vertical
        height='100%'
        asPercent
        size='50%'
        other={<div className='pd-4'>Two</div>}
    >
        <div className='pd-4'>Three</div>
    </Resizable>
</Resizable>`,
	lang: "xml",
};

export const PResizable = [
	{
		name: "children",
		desc: "内容区域",
		type: ["ReactNode"],
	},
	{
		name: "other",
		desc: "另一个内容区域",
		type: ["ReactNode"],
	},
	{
		name: "line",
		desc: "分割线中间节点显示",
		type: ["ReactNode"],
	},
	{
		name: "vertical",
		desc: "垂直方向",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "asPercent",
		desc: "尺寸是否百分比，否则为像素（此时不会因为容器大小改变而变化）",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "height",
		desc: "高度",
		type: ["string", "number"],
	},
	{
		name: "size",
		desc: "初始尺寸",
		type: ["ReactNode"],
		def: "auto",
	},
	{
		name: "minSize",
		desc: "其它区域最小尺寸",
		type: ["string", "number"],
		def: "0",
	},
	{
		name: "maxSize",
		desc: "其它区域最大尺寸",
		type: ["string", "number"],
		def: "100%",
	},
	{
		name: "style",
		desc: "样式",
		type: ["CSSProperties"],
	},
	{
		name: "className",
		desc: "类名",
		type: ["string"],
	},
	{
		name: "onResize",
		desc: "拖动时触发",
		type: ["(size: string | number) => void"],
		event: true,
	},
	{
		name: "onResizeComplete",
		desc: "拖动结束时触发",
		type: ["(size: string | number) => void"],
		event: true,
	},
];
