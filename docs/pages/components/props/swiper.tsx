import { Button, Flex, Icon, Swiper } from "@p";
import { RefSwiper } from "@p/components/swiper/type";
import { KeyboardArrowDownRound, KeyboardArrowUpRound } from "@ricons/material";
import { CSSProperties, useRef } from "react";

const itemStyle = {
	backgroundImage:
		"linear-gradient(135deg, var(--color-5) 0%, var(--color-7) 100%)",
	fontSize: "4em",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: 110,
	width: "100%",
	textAlign: "center",
	borderRadius: "var(--radius)",
} as CSSProperties;

export const DBasic = {
	demo: () => {
		const ref = useRef<RefSwiper>(null);

		return (
			<>
				<Swiper
					ref={ref}
					display={2}
					style={{ width: 600 }}
					gap={10}
					indicator
				>
					{Array.from({ length: 7 }).map((_, i) => {
						return (
							<Swiper.Item key={i}>
								<div style={itemStyle}>{i + 1}</div>
							</Swiper.Item>
						);
					})}
				</Swiper>

				<Flex className='mt-12' gap={12}>
					<Button onClick={() => ref.current?.swipeTo(2)}>
						Swipe to 3
					</Button>
					<Button onClick={() => ref.current?.swipePrev()}>
						Swipe Prev
					</Button>
					<Button onClick={() => ref.current?.swipeNext()}>
						Swipe Next
					</Button>
				</Flex>
			</>
		);
	},
	code: `const ref = useRef<RefSwiper>(null);

return (
    <>
        <Swiper
            ref={ref}
            display={2}
            style={{ width: 600 }}
            gap={10}
            indicator
        >
            {Array.from({ length: 7 }).map((_, i) => {
                return (
                    <Swiper.Item key={i}>
                        <div style={itemStyle}>{i + 1}</div>
                    </Swiper.Item>
                );
            })}
        </Swiper>

        <Flex className='mt-12' gap={12}>
            <Button onClick={() => ref.current?.swipeTo(2)}>
                Swipe to 3
            </Button>
            <Button onClick={() => ref.current?.swipePrev()}>
                Swipe Prev
            </Button>
            <Button onClick={() => ref.current?.swipeNext()}>
                Swipe Next
            </Button>
        </Flex>
    </>
);`,
	lang: "javascript",
};

export const DVertical = {
	demo: () => {
		return (
			<Swiper
				vertical
				itemHeight={110}
				draggable
				style={{ width: 400 }}
				prev={<Icon icon={<KeyboardArrowUpRound />} size='2em' />}
				next={<Icon icon={<KeyboardArrowDownRound />} size='2em' />}
			>
				{Array.from({ length: 4 }).map((_, i) => {
					return (
						<Swiper.Item key={i}>
							<div style={itemStyle}>{i + 1}</div>
						</Swiper.Item>
					);
				})}
			</Swiper>
		);
	},
	code: `<Swiper
    vertical
    itemHeight={110}
    draggable
    style={{ width: 400 }}
    prev={<Icon icon={<KeyboardArrowUpRound />} size='2em' />}
    next={<Icon icon={<KeyboardArrowDownRound />} size='2em' />}
>
    {Array.from({ length: 4 }).map((_, i) => {
        return (
            <Swiper.Item key={i}>
                <div style={itemStyle}>{i + 1}</div>
            </Swiper.Item>
        );
    })}
</Swiper>`,
	lang: "xml",
};

export const PSwiper = [
	{
		name: "type",
		desc: "轮播类型",
		type: ["'normal'", "'fade'", "'flow'"],
		def: "'normal'",
	},
	{
		name: "initial",
		desc: "初始索引",
		type: ["number"],
		def: 0,
	},
	{
		name: "display",
		desc: "每屏显示多少个子项",
		type: ["number"],
		def: 1,
	},
	{
		name: "scroll",
		desc: "每次滚动多少个子项，不会超过 display",
		type: ["number"],
		def: 1,
	},
	{
		name: "loop",
		desc: "循环显示",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "gap",
		desc: "子项间间隔，单位px",
		type: ["number"],
		def: 0,
	},
	{
		name: "duration",
		desc: "滚动动画时长，单位ms",
		type: ["number"],
		def: 600,
	},
	{
		name: "autoplay",
		desc: "开启自动播放",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "interval",
		desc: "自动滚动时，时间间隔，单位ms",
		type: ["ReactNode"],
		def: 3000,
	},
	{
		name: "reverse",
		desc: "反向切换",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "pauseOnHover",
		desc: "鼠标移上去时暂停自动播放",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "draggable",
		desc: "可以拖拽切换",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "dragOffset",
		desc: "拖拽一定距离时触发切换，单位px",
		type: ["number"],
		def: 40,
	},
	{
		name: "vertical",
		desc: "垂直显示，设置后必须设置 itemHeight 属性",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "itemHeight",
		desc: "子项高度，当设置为垂直方向时必须设置该属性，单位px",
		type: ["number"],
	},
	{
		name: "indicator",
		desc: "显示索引导航指示器",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "arrow",
		desc: "显示箭头",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "prev",
		desc: "前一屏箭头",
		type: ["ReactNode"],
	},
	{
		name: "next",
		desc: "后一屏箭头",
		type: ["ReactNode"],
	},
	{
		name: "renderIndicator",
		desc: "渲染导航指示器内容",
		type: ["(i: number) => ReactNode"],
	},
	{
		name: "onBeforeSwipe",
		desc: "切换前触发",
		type: ["(before: number) => void"],
		event: true,
	},
	{
		name: "onAfterSwipe",
		desc: "切换后触发",
		type: ["(after: number) => void"],
		event: true,
	},
];

export const PRefSwiper = `
export interface RefSwiper {

	swipeTo: (i: number) => void;

	swipeNext: () => void;

	swipePrev: () => void;

}
`;
