import { Pagination } from "@p";
import { sleep } from "radash";
import { useState } from "react";

export const DBasic = {
	demo: <Pagination page={1} total={81} />,
	code: `<Pagination page={1} total={81} />`,
	lang: "xml",
};

export const DEnhanced = {
	demo: () => {
		const [page, setPage] = useState<number>(1);

		const handleChange = async (p: number) => {
			await sleep(1000);
			setPage(p);
		};

		return (
			<Pagination
				page={page}
				total={81}
				size={6}
				prev='Prev'
				next='Next'
				simple
				onChange={handleChange}
			/>
		);
	},
	code: `const [page, setPage] = useState<number>(1);

const handleChange = async (p: number) => {
    await sleep(1000);
    setPage(p);
};

return (
    <Pagination
        page={page}
        total={81}
        size={6}
        prev='Prev'
        next='Next'
        simple
        onChange={handleChange}
    />
);`,
	lang: "javascript",
};

export const PPagination = [
	{
		name: "page",
		desc: "当前页码",
		type: ["number"],
		def: 1,
	},
	{
		name: "total",
		desc: "内容数量",
		type: ["number"],
		def: 0,
	},
	{
		name: "sibling",
		desc: "相邻页码数",
		type: ["number"],
		def: 2,
	},
	{
		name: "size",
		desc: "每页显示内容数量",
		type: ["number"],
		def: 10,
	},
	{
		name: "prev",
		desc: "上一页按钮",
		type: ["ReactNode"],
	},
	{
		name: "next",
		desc: "下一页按钮",
		type: ["ReactNode"],
	},
	{
		name: "renderPage",
		desc: "页码渲染方式",
		type: ["(page: number) => ReactNode"],
		def: "i => i",
	},
	{
		name: "renderEllipsis",
		desc: "省略号渲染方式",
		type: ["() => ReactNode"],
	},
	{
		name: "onChange",
		desc: "页码改变时触发回调",
		type: ["(page: number) => Promise<void> | void"],
		event: true,
	},
];
