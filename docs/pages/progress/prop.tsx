import { Icon, Input, Progress } from "@p";
import { DiscordRound } from "@ricons/material";
import { useState } from "react";

export const DBasic = {
	demo: () => {
		const [val, setVal] = useState(40);

		return (
			<>
				<Progress
					value={val}
					onChange={setVal}
					barClass='bg-blue-0'
					renderCursor={() => (
						<Icon
							icon={<DiscordRound />}
							className='bg-blue pd-4'
						/>
					)}
				/>

				<Input.Number
					value={val}
					onChange={setVal}
					className='mt-8'
					step={5}
					style={{ width: 120 }}
					min={0}
					max={100}
				/>
			</>
		);
	},
	code: `const [val, setVal] = useState(40);

return (
    <>
        <Progress
            value={val}
            onChange={setVal} 
            barClass='bg-blue-0'
            renderCursor={() => (
                <Icon
                    icon={<DiscordRound />}
                    className='bg-blue pd-4'
                />
            )}
        />

        <Input.Number
            value={val}
            onChange={setVal}
            className='mt-8'
            step={5}
            style={{ width: 120 }}
            min={0}
            max={100}
        />
    </>
);`,
	lang: "javascript",
};

export const DCircle = {
	demo: () => {
		const [val, setVal] = useState(40);

		return (
			<>
				<Progress type='circle' circleSize={120} value={val} />

				<Input.Number
					value={val}
					onChange={setVal}
					className='mt-8'
					step={10}
					style={{ width: 120 }}
					min={0}
					max={100}
				/>
			</>
		);
	},
	code: `const [val, setVal] = useState(40);

return (
    <>
        <Progress type='circle' circleSize={120} value={val} />

        <Input.Number
            value={val}
            onChange={setVal}
            className='mt-8'
            step={10}
            style={{ width: 120 }}
            min={0}
            max={100}
        />
    </>
);`,
	lang: "javascript",
};

export const PProgress = [
	{
		name: "value",
		desc: "值",
		type: ["number"],
	},
	{
		name: "precision",
		desc: "精度，保留小数点位数",
		type: ["number"],
		def: "0",
	},
	{
		name: "lineWidth",
		desc: "进度条宽度，单位px",
		type: ["number"],
		def: "8",
	},
	{
		name: "type",
		desc: "进度类型",
		type: ["'line'", "'circle'"],
		def: "'line'",
	},
	{
		name: "circleSize",
		desc: "当 type 为 circle 时生效，表现为环形高度，单位px",
		type: ["number"],
		def: "40",
	},
	{
		name: "draggable",
		desc: "是否可以拖拽改变值，目前仅对 type 为 line 时生效",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "vertical",
		desc: "垂直显示，当 type 为 line 时生效",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "barClass",
		desc: "进度条类名",
		type: ["string"],
	},
	{
		name: "renderCursor",
		desc: "渲染拖拽图标",
		type: ["(value: number) => ReactNode"],
	},
	{
		name: "onDraggingChange",
		desc: "拖拽行为发生改变时触发",
		type: ["(dragging: boolean) => void"],
		event: true,
	},
	{
		name: "onChange",
		desc: "值改变时触发",
		type: ["(value: number) => void"],
		event: true,
	},
];
