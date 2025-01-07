import { Flex, Loading } from "@p";

export const DBasic = {
	demo: () => {
		return (
			<Flex gap={20} justify='space-evenly'>
				<Loading size={40} />

				<Loading text='加载中' className='color-3 pd-8 round-0' />

				<div className='relative pd-20 round-0'>
					<div className='pd-12 opacity-5'>内容</div>
					<Loading absolute size={32} />
				</div>
			</Flex>
		);
	},
	code: `<Flex gap={20} justify='space-evenly'>
    <Loading size={40} />

    <Loading text='加载中' className='color-3 pd-8 round-0' />

	<div className='relative pd-20 round-0'>
		<div className='pd-12 opacity-5'>内容</div>
		<Loading absolute size={32} />
	</div>
</Flex>`,
	lang: "xml",
};

export const PLoading = [
	{
		name: "icon",
		desc: "加载图标",
		type: ["ReactNode"],
	},
	{
		name: "text",
		desc: "文案",
		type: ["ReactNode"],
	},
	{
		name: "size",
		desc: "内容大小",
		type: ["number", "string"],
		def: "'1em'",
	},
	{
		name: "absolute",
		desc: "容器定位",
		type: ["boolean"],
		def: "false",
	},
];
