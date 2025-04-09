import fantasy from "@d/assets/fantasy.jpg";
import yehuimei from "@d/assets/yehuimei.jpg";
import { Button, Card, Flex, Icon, Image, Tag } from "@p";
import {
	FavoriteRound,
	FavoriteTwotone,
	MoreVertRound,
} from "@ricons/material";

export const DBasic = {
	demo: (
		<Flex
			columns='repeat(auto-fill, minmax(180px, 1fr))'
			gap='20px'
			align='start'
		>
			<Card
				footer={
					<>
						<h5>叶惠美</h5>
						<Button size='small' square flat className='ml-auto'>
							<Icon icon={<MoreVertRound />} />
						</Button>
					</>
				}
			>
				<Image src={yehuimei} className='roundless' />
			</Card>

			<Card
				header={
					<>
						<Flex gap={8} align='center'>
							<a>
								<Image className='bg-red' size={24} />
							</a>
							<h5>范特西</h5>
						</Flex>
						<Button.Toggle
							size='small'
							square
							flat
							className='ml-auto'
							after={
								<Icon
									icon={<FavoriteRound />}
									className='red'
								/>
							}
						>
							<Icon icon={<FavoriteTwotone />} />
						</Button.Toggle>
					</>
				}
				footer={<Tag className='bg-red-0'>范特西</Tag>}
			>
				<Image src={fantasy} className='mx-12' />
			</Card>
		</Flex>
	),
	code: `<Flex
	columns='repeat(auto-fill, minmax(180px, 1fr))'
	gap='20px'
	align='start'
>
	<Card
		footer={
			<>
				<h5>叶惠美</h5>
				<Button size='small' square flat className='ml-auto'>
					<Icon icon={<MoreVertRound />} />
				</Button>
			</>
		}
	>
		<Image src={yehuimei} className='roundless' />
	</Card>

	<Card
		header={
			<>
				<Flex gap={8} align='center'>
					<a>
						<Image className='bg-red' size={24} />
					</a>
					<h5>范特西</h5>
				</Flex>
				<Button.Toggle
					size='small'
					square
					flat
					className='ml-auto'
					after={
						<Icon
							icon={<FavoriteRound />}
							className='red'
						/>
					}
				>
					<Icon icon={<FavoriteTwotone />} />
				</Button.Toggle>
			</>
		}
		footer={<Tag className='bg-red-0'>范特西</Tag>}
	>
		<Image src={fantasy} className='mx-12' />
	</Card>
</Flex>`,
	lang: "xml",
};

export const PCard = [
	{
		name: "header",
		desc: "顶部插槽",
		type: ["ReactNode"],
	},
	{
		name: "children",
		desc: "内容",
		type: ["ReactNode"],
	},
	{
		name: "footer",
		desc: "底部插槽",
		type: ["ReactNode"],
	},
	{
		name: "hideShadow",
		desc: "隐藏卡片阴影",
		type: ["boolean"],
	},
	{
		name: "border",
		desc: "卡片边框",
		type: ["boolean"],
		def: "false",
	},
];
