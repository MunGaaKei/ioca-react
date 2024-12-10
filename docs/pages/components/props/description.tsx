import { Description, Text } from "@p";
import { mock } from "mockjs";

export const DBasic = {
	demo: () => {
		const { list } = mock({
			"list|10": [
				{
					label: "@cname",
					value: "@county(true)",
				},
			],
		});
		const data = [
			{
				label: <span className='color-5'>未完成</span>,
				value: (
					<Text.Number
						to={5415}
						count={0}
						thousand=','
						size={28}
						weight={600}
					/>
				),
			},
			{
				label: <span className='color-5'>进行中</span>,
				value: (
					<Text.Number
						to={52}
						count={0}
						thousand=','
						size={28}
						className='blue'
						weight={600}
					/>
				),
			},
			{
				label: <span className='color-5'>失败</span>,
				value: (
					<Text.Number
						to={12}
						count={0}
						thousand=','
						size={28}
						className='red'
						weight={600}
					/>
				),
			},
			{
				label: <span className='color-5'>已完成</span>,
				value: (
					<Text.Number
						to={233}
						count={0}
						thousand=','
						size={28}
						className='green'
						weight={600}
					/>
				),
			},
		];

		return (
			<Description
				data={data}
				columns={4}
				vertical
				equally
				align='center'
			/>
		);
	},
	code: `const data = [
    {
        label: <span className='color-5'>未完成</span>,
        value: (
            <Text.Number to={5415} count={0} thousand=',' size={28} weight={600} />
        ),
    },
    {
        label: <span className='color-5'>进行中</span>,
        value: (
            <Text.Number
                to={52}
                count={0}
                thousand=','
                size={28}
                className='blue'
				weight={600}
            />
        ),
    },
    {
        label: <span className='color-5'>失败</span>,
        value: (
            <Text.Number
                to={12}
                count={0}
                thousand=','
                size={28}
                className='red'
				weight={600}
            />
        ),
    },
    {
        label: <span className='color-5'>已完成</span>,
        value: (
            <Text.Number
                to={233}
                count={0}
                thousand=','
                size={28}
                className='green'
				weight={600}
            />
        ),
    },
];

return (
    <Description
        data={data}
        columns={4}
        vertical
        equally
        align='center'
    />
);`,
	lang: "javascript",
};

export const PDescription = [
	{
		name: "data",
		desc: "显示内容",
		type: [
			<a className='blue' href='#i-data'>
				IData[]
			</a>,
		],
		required: true,
	},
	{
		name: "align",
		desc: "对齐方式，参考CSS text-align",
		type: ["string"],
	},
	{
		name: "colon",
		desc: "标签符号",
		type: ["ReactNode"],
	},
	{
		name: "gap",
		desc: "数据间隔",
		type: ["string", "number"],
		def: "0.5em",
	},
	{
		name: "equally",
		desc: "每列数据占据同等空间",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "columns",
		desc: "列数",
		type: ["number"],
		def: "1",
	},
	{
		name: "vertical",
		desc: "数据渲染方向",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "labelWidth",
		desc: "标签宽度",
		type: ["string", "number"],
	},
	{
		name: "labelAlign",
		desc: "标签对齐方式，参考CSS text-align",
		type: ["string"],
	},
];

export const PData = [
	{
		name: "label",
		desc: "标签",
		type: ["ReactNode"],
		required: true,
	},
	{
		name: "value",
		desc: "显示内容",
		type: ["ReactNode"],
		required: true,
	},
	{
		name: "colSpan",
		desc: "单元格列占据空间",
		type: ["number"],
		def: "1",
	},
	{
		name: "rowSpan",
		desc: "单元格行占据空间",
		type: ["number"],
		def: "1",
	},
	{
		name: "hidden",
		desc: "隐藏该项",
		type: ["boolean"],
	},
	{
		name: "style",
		desc: "项样式",
		type: ["CSSProperties"],
	},
];
