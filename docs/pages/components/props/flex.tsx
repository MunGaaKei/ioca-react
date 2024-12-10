import { Flex } from "@p";

export const DBasic = {
	demo: () => {
		return (
			<>
				<Flex gap={12}>
					<div className='pd-12 bg-blue round-0 w-25'>25%</div>
					<div className='pd-12 bg-yellow round-0 flex-1'>Rest</div>
				</Flex>
				<Flex gap={12} className='mt-12'>
					<div className='pd-12 bg-pink round-0 flex-1'></div>
					<div className='pd-12 bg-pink round-0 flex-1'></div>
					<div className='pd-12 bg-pink round-0 flex-1'></div>
				</Flex>
				<Flex gap={12} columns={4} className='mt-12'>
					<div className='pd-12 bg-green round-0'></div>
					<div className='pd-12 bg-green round-0'></div>
					<div className='pd-12 bg-green round-0'></div>
					<div className='pd-12 bg-green round-0'></div>
				</Flex>
				<Flex justify='center' className='mt-12'>
					<div className='pd-12 bg-brown round-0 w-40'></div>
				</Flex>
			</>
		);
	},
	code: `<Flex gap={12}>
    <div className='pd-12 bg-blue round-0 w-25'>25%</div>
    <div className='pd-12 bg-yellow round-0 flex-1'>Rest</div>
</Flex>
<Flex gap={12} className='mt-12'>
    <div className='pd-12 bg-pink round-0 flex-1'></div>
    <div className='pd-12 bg-pink round-0 flex-1'></div>
    <div className='pd-12 bg-pink round-0 flex-1'></div>
</Flex>
<Flex gap={12} columns={4} className='mt-12'>
    <div className='pd-12 bg-green round-0'></div>
    <div className='pd-12 bg-green round-0'></div>
    <div className='pd-12 bg-green round-0'></div>
    <div className='pd-12 bg-green round-0'></div>
</Flex>
<Flex justify='center' className='mt-12'>
    <div className='pd-12 bg-brown round-0 w-40'></div>
</Flex>`,
	lang: "xml",
};

export const DGrid = {
	demo: () => {
		return (
			<Flex columns='repeat(auto-fill, minmax(200px, 1fr))' gap={12}>
				<div className='bg-blue pd-12 round-0'></div>
				<div className='bg-blue pd-12 round-0'></div>
				<div className='bg-blue pd-12 round-0'></div>
				<div className='bg-blue pd-12 round-0'></div>
				<div className='bg-blue pd-12 round-0'></div>
				<div className='bg-blue pd-12 round-0'></div>
				<div className='bg-blue pd-12 round-0'></div>
				<div className='bg-blue pd-12 round-0'></div>
				<div className='bg-blue pd-12 round-0'></div>
				<div className='bg-blue pd-12 round-0'></div>
				<div className='bg-blue pd-12 round-0'></div>
				<div className='bg-blue pd-12 round-0'></div>
			</Flex>
		);
	},
	code: `<Flex columns='repeat(auto-fill, minmax(200px, 1fr))' gap={12}>
    <div className='bg-blue pd-12 round-0'></div>
    <div className='bg-blue pd-12 round-0'></div>
    <div className='bg-blue pd-12 round-0'></div>
    <div className='bg-blue pd-12 round-0'></div>
    <div className='bg-blue pd-12 round-0'></div>
    <div className='bg-blue pd-12 round-0'></div>
    <div className='bg-blue pd-12 round-0'></div>
    <div className='bg-blue pd-12 round-0'></div>
    <div className='bg-blue pd-12 round-0'></div>
    <div className='bg-blue pd-12 round-0'></div>
    <div className='bg-blue pd-12 round-0'></div>
    <div className='bg-blue pd-12 round-0'></div>
</Flex>`,
	lang: "xml",
};

export const PFlex = [
	{
		name: "as",
		desc: "表现为哪种标签",
		type: ["string"],
		def: "'div'",
	},
	{
		name: "align",
		desc: "即 align-items",
		type: ["string"],
	},
	{
		name: "justify",
		desc: "即 justify-content",
		type: ["string"],
	},
	{
		name: "gap",
		desc: "间隔",
		type: ["string", "number"],
	},
	{
		name: "direction",
		desc: "即 flex-direction",
		type: ["string"],
	},
	{
		name: "wrap",
		desc: "即 flex-wrap",
		type: ["boolean", "string"],
	},
	{
		name: "columns",
		desc: "内容显示为几列，即 grid-template-columns，同时表现为 grid 布局",
		type: ["string", "number"],
	},
];
