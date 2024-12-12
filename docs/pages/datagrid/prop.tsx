import { Button, Datagrid, Icon, Tag } from "@p";
import { IColumn } from "@p/components/datagrid/type";
import { FemaleRound, MaleRound, PhoneAndroidRound } from "@ricons/material";
import { mock } from "mockjs";
import { useMemo } from "react";

export const DBasic = {
	demo: () => {
		const columns = [
			{
				id: "id",
				width: 40,
			},
			{
				id: "name",
				fixed: "left",
			},
			{
				id: "email",
			},
			{
				id: "phone",
				title: (
					<>
						Phone
						<Icon icon={<PhoneAndroidRound />} size='1em' />
					</>
				),
			},
			{
				id: "gender",
				justify: "center",
				sorter: true,
				render: (value: number) => {
					return value > 0 ? (
						<Icon
							icon={<MaleRound />}
							className='blue'
							size='1.2em'
						/>
					) : (
						<Icon
							icon={<FemaleRound />}
							className='pink'
							size='1.2em'
						/>
					);
				},
			},
			{
				id: "birth",
				title: "Birth",
				sorter: (a, b) =>
					new Date(b.birth).getTime() - new Date(a.birth).getTime(),
			},
			{
				id: "address",
				title: "Address",
			},
			{
				id: "active",
				justify: "center",
				render: (value: boolean) => {
					return value ? (
						<Tag className='bg-blue'>是</Tag>
					) : (
						<Tag className='bg-black-0'>否</Tag>
					);
				},
			},
			{
				id: "action",
				fixed: "right",
				justify: "center",
				render: () => (
					<Button className='bg-grey' size='small'>
						操作
					</Button>
				),
			},
		] as IColumn[];

		const { list } = useMemo(
			() =>
				mock({
					"list|20": [
						{
							"id|+1": 1,
							name: "@cname",
							email: "@email",
							phone: /^1[385][1-9]\d{8}/,
							"gender|0-1": 0,
							birth: "@date",
							address: "@county(true)",
							active: "@boolean",
						},
					],
				}),
			[]
		);

		return (
			<Datagrid
				data={list}
				columns={columns}
				resizable
				border
				cellEllipsis
				height={400}
			/>
		);
	},
	code: `const columns = [...[], {
    id: "gender",
    justify: "center",
    sorter: true,
    render: (value: number) => {
        return value > 0 ? (
            <Icon
                icon={<MaleRound />}
                className='blue'
                size='1.2em'
            />
        ) : (
            <Icon
                icon={<FemaleRound />}
                className='pink'
                size='1.2em'
            />
        );
    },
}, ...[]];

const { list } = mock({
    "list|20": [
        {
            "id|+1": 1,
            name: "@cname",
            email: "@email",
            phone: /^1[385][1-9]\d{8}/,
            "gender|0-1": 0,
            birth: "@date",
            address: "@county(true)",
            active: "@boolean",
        },
    ],
});

return (
    <Datagrid
        data={list}
        columns={columns}
        resizable
        border
		cellEllipsis
        height={400}
    />
);
    `,
	lang: "javascript",
};

export const PDatagrid = [
	{
		name: "data",
		desc: "数据",
		type: ["Record<string, any>"],
		required: true,
	},
	{
		name: "columns",
		desc: "列设置",
		type: [
			<a className='blue' href='#i-column'>
				IColumn[]
			</a>,
		],
	},
	{
		name: "border",
		desc: "表格边框",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "striped",
		desc: "条纹类型",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "header",
		desc: "显示头部",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "resizable",
		desc: "列宽可改动",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "loading",
		desc: "表格加载状态",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "empty",
		desc: "数据为空时显示的内容",
		type: ["ReactNode"],
	},
	{
		name: "cellPadding",
		desc: "表格 padding",
		type: ["string"],
		def: "0.5em",
	},
	{
		name: "cellEllipsis",
		desc: "表格溢出显示省略号",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "height",
		desc: "表格最大高度，内容超出时显示滚动条",
		type: ["string", "number"],
		def: "'unset'",
	},
	{
		name: "renderLoading",
		desc: "渲染加载图标",
		type: ["() => ReactNode"],
	},
	{
		name: "onCellClick",
		desc: "单元格点击时触发",
		type: [
			<>
				(data?: Record&lt;string, any&gt;, column?:{" "}
				<a href='#i-column' className='blue'>
					IColumn
				</a>
				, row?: number, col?: number, e?: MouseEvent) =&gt; void
			</>,
		],
		event: true,
	},
	{
		name: "onCellDoubleClick",
		desc: "单元格双击时触发",
		type: [
			<>
				(data?: Record&lt;string, any&gt;, column?:{" "}
				<a href='#i-column' className='blue'>
					IColumn
				</a>
				, row?: number, col?: number, e?: MouseEvent) =&gt; void
			</>,
		],
		event: true,
	},
	{
		name: "onHeaderClick",
		desc: "表头单元格单击时触发",
		type: [
			<>
				(column?:{" "}
				<a href='#i-column' className='blue'>
					IColumn
				</a>
				, e?: MouseEvent) =&gt; void
			</>,
		],
		event: true,
	},
	{
		name: "onSort",
		desc: "排序时触发，如果传入了，则整个排序行为由开发者自己控制。否则使用默认的排序行为。",
		type: ["(sortBy: string, sortType: '' | 'desc' | 'asc') => void"],
		event: true,
	},
	{
		name: "onScroll",
		desc: "表格滚动时触发",
		type: ["(e?: MouseEvent) => void"],
		event: true,
	},
	{
		name: "onResize",
		desc: "列宽改变时触发",
		type: [
			<>
				(column?:{" "}
				<a href='#i-column' className='blue'>
					IColumn
				</a>
				, width?: number) =&gt; void
			</>,
		],
		event: true,
	},
];

export const PColumn = [
	{
		name: "id",
		desc: "数据主键",
		type: ["string"],
		required: true,
	},
	{
		name: "title",
		desc: "标题",
		type: ["ReactNode"],
	},
	{
		name: "sorter",
		desc: "允许排序",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "justify",
		desc: "表格内容对齐，参考CSS justify-content",
		type: [
			<a
				className='blue'
				href='https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content'
				target='_blank'
			>
				justify-content
			</a>,
		],
	},
	{
		name: "rowSpan",
		desc: "表格行占据空间",
		type: ["number"],
		def: "1",
	},
	{
		name: "colSpan",
		desc: "表格列占据空间",
		type: ["number"],
		def: "1",
	},
	{
		name: "width",
		desc: "表格默认宽度，除了默认CSS宽度，还支持 '1fr', 'auto' 等。",
		type: ["string"],
	},
	{
		name: "fixed",
		desc: "固定在两侧",
		type: ["'left'", "'right'"],
	},
	{
		name: "render",
		desc: "表格内容自定义渲染",
		type: [
			"(value?: any, data?: Record<string, any>, index?: number) => ReactNode",
		],
	},
	{
		name: "renderHeader",
		desc: "表格头部内容自定义渲染",
		type: [
			<>
				(column?:{" "}
				<a href='#i-column' className='blue'>
					IColumn
				</a>
				, index?: number) =&gt; ReactNode
			</>,
		],
	},
];
