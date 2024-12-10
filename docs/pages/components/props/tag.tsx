import { Button, Flex, Tag } from "@p";

export const DBasic = {
	demo: () => {
		return (
			<Flex gap={12}>
				<Button>
					<span>tag</span>
					<Tag>tag</Tag>
				</Button>
				<Tag dot dotClass='bg-red'>
					tag
				</Tag>
			</Flex>
		);
	},
	code: `<Flex gap={12}>
	<Button>
		<span>tag</span>
		<Tag>tag</Tag>
	</Button>
	<Tag dot dotClass='bg-red'>
		tag
	</Tag>
</Flex>`,
	lang: "xml",
};

export const DColors = {
	demo: () => {
		return (
			<>
				<div className='flex flex-wrap gap-12 mt-12 items-center'>
					<Tag className='bg-blue'>tag</Tag>
					<Tag className='bg-red'>tag</Tag>
					<Tag className='bg-pink'>tag</Tag>
					<Tag className='bg-green' dot>
						tag
					</Tag>
					<Tag className='bg-yellow' round>
						tag
					</Tag>
					<Tag className='bg-purple' onClose={() => null}>
						tag
					</Tag>
					<Tag className='brown' outline onClick={() => null}>
						tag
					</Tag>
					<Tag className='bg-aqua' onClick={() => null}>
						tag
					</Tag>
					<Tag className='orange'>tag</Tag>
					<Tag className='bg-black'>tag</Tag>
				</div>
				<div className='flex gap-12 mt-12 items-center flex-wrap'>
					<Tag className='bg-blue-0' size='small'>
						tag
					</Tag>
					<Tag className='bg-red-0' dotClass='red'>
						tag
					</Tag>
					<Tag className='bg-pink-0' size='large'>
						tag
					</Tag>
					<Tag className='bg-green-0' dot>
						tag
					</Tag>
					<Tag className='bg-purple-0' onClick={() => null}>
						tag
					</Tag>
					<Tag className='bg-orange-0'>tag</Tag>
					<Tag className='bg-black-0' size='extreme' round>
						tag
					</Tag>
				</div>
			</>
		);
	},
	code: `<div className='flex flex-wrap gap-12 mt-12 items-center'>
    <Tag className='bg-blue'>tag</Tag>
    <Tag className='bg-red'>tag</Tag>
    <Tag className='bg-pink'>tag</Tag>
    <Tag className='bg-green' dot>
        tag
    </Tag>
    <Tag className='bg-yellow' round>tag</Tag>
    <Tag className='bg-purple' onClose={() => null}>
        tag
    </Tag>
    <Tag className='brown' outline onClick={() => null}>
        tag
    </Tag>
    <Tag className='bg-aqua' onClick={() => null}>
        tag
    </Tag>
    <Tag className='orange'>tag</Tag>
    <Tag className='bg-black'>tag</Tag>
</div>
<div className='flex gap-12 mt-12 items-center flex-wrap'>
    <Tag className='bg-blue-0' size='small'>
        tag
    </Tag>
    <Tag className='bg-red-0' dotClass='red'>
        tag
    </Tag>
    <Tag className='bg-pink-0' size='large'>
        tag
    </Tag>
    <Tag className='bg-green-0' dot>
        tag
    </Tag>
    <Tag className='bg-purple-0' onClick={() => null}>
        tag
    </Tag>
    <Tag className='bg-orange-0'>tag</Tag>
    <Tag className='bg-black-0' size='extreme' round>
        tag
    </Tag>
</div>`,
	lang: "xml",
};

export const PTag = [
	{
		name: "dot",
		desc: "显示圆点",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "dotClass",
		desc: "圆点类名",
		type: ["string"],
	},
	{
		name: "outline",
		desc: "边框",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "round",
		desc: "圆角",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "size",
		desc: "尺寸大小",
		type: ["'small'", "'normal'", "'large'", "'extreme'"],
		def: "'normal'",
	},
	{
		name: "onClick",
		desc: "点击回调事件",
		type: ["(e: MouseEvent) => void"],
		event: true,
	},
	{
		name: "onClose",
		desc: "显示关闭按钮，并且点击时触发回调事件",
		type: ["(e: MouseEvent) => void"],
		event: true,
	},
];
