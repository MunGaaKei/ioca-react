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
			<Card>
				<Card.Banner>
					<Image src={yehuimei} />
				</Card.Banner>
				<Card.Header className='items-center'>
					<h5>叶惠美</h5>
					<Button size='small' square flat className='ml-auto'>
						<Icon icon={<MoreVertRound />} />
					</Button>
				</Card.Header>
			</Card>

			<Card>
				<Card.Header>
					<Flex gap={8} align='center'>
						<a>
							<Image className='bg-red' size={24} round />
						</a>
						<h5>范特西</h5>
					</Flex>
					<Button.Toggle
						size='small'
						square
						flat
						className='ml-auto'
						after={
							<Icon icon={<FavoriteRound />} className='red' />
						}
					>
						<Icon icon={<FavoriteTwotone />} />
					</Button.Toggle>
				</Card.Header>
				<Image src={fantasy} className='mx-12' />
				<Card.Footer>
					<Tag className='bg-red-0'>范特西</Tag>
				</Card.Footer>
			</Card>
		</Flex>
	),
	code: `<Flex
	columns='repeat(auto-fill, minmax(180px, 1fr))'
	gap='20px'
	align='start'
>
	<Card>
		<Card.Banner>
			<Image src={yehuimei} />
		</Card.Banner>
		<Card.Header className='items-center'>
			<h5>叶惠美</h5>
			<Button size='small' square flat className='ml-auto'>
				<Icon icon={<MoreVertRound />} />
			</Button>
		</Card.Header>
	</Card>

	<Card>
		<Card.Header>
			<Flex gap={8} align='center'>
				<a>
					<Image className='bg-red' size={24} round />
				</a>
				<h5>范特西</h5>
			</Flex>
			<Button.Toggle
				size='small'
				square
				flat
				className='ml-auto'
				after={
					<Icon icon={<FavoriteRound />} className='red' />
				}
			>
				<Icon icon={<FavoriteTwotone />} />
			</Button.Toggle>
		</Card.Header>
		<Image src={fantasy} className='mx-12' />
		<Card.Footer>
			<Tag className='bg-red-0'>范特西</Tag>
		</Card.Footer>
	</Card>
</Flex>`,
	lang: "xml",
};

export const PCard = [
	{
		name: "shadow",
		desc: "卡片阴影",
		type: ["boolean"],
		def: "true",
	},
	{
		name: "border",
		desc: "卡片边框",
		type: ["boolean"],
		def: "false",
	},
];
