import fantasy from "@d/assets/fantasy.jpg";
import yehuimei from "@d/assets/yehuimei.jpg";
import { Button, Card, Flex, Icon, Image, Swiper, Text } from "@p";
import {
	CloseRound,
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
					<h4>叶惠美</h4>
					<Button size='small' square flat className='ml-auto'>
						<Icon icon={<MoreVertRound />} />
					</Button>
				</Card.Header>
			</Card>

			<Card>
				<Card.Header>
					<Flex gap={8} align='center'>
						<a>
							<Image className='bg-black' size={32} round />
						</a>
						<div>
							<h4>范特西</h4>
							<Text className='color-6' size={12}>
								DAWN
							</Text>
						</div>
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
					<Button size='small' square flat>
						<Icon icon={<CloseRound />} />
					</Button>
				</Card.Header>
				<Image src={fantasy} />
				<Card.Footer>
					<Button className='bg-red-0'>范特西</Button>
				</Card.Footer>
			</Card>

			<Card>
				<Card.Banner>
					<Swiper arrow={false} draggable indicator>
						<Swiper.Item>
							<Image className='bg-yellow' size={250} />
						</Swiper.Item>
						<Swiper.Item>
							<Image className='bg-green' size={250} />
						</Swiper.Item>
					</Swiper>
				</Card.Banner>
				<Card.Footer>Swiper Images</Card.Footer>
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
            <h4>叶惠美</h4>
            <Button size='small' square flat className='ml-auto'>
                <Icon icon={<MoreVertRound />} />
            </Button>
        </Card.Header>
    </Card>

    <Card>
        <Card.Header>
            <Flex gap={8} align='center'>
                <a>
                    <Image className='bg-black' size={32} round />
                </a>
                <div>
                    <h4>fantasy</h4>
                    <Text className='color-6' size={12}>
                        DAWN
                    </Text>
                </div>
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
            <Button size='small' square flat>
                <Icon icon={<CloseRound />} />
            </Button>
        </Card.Header>
        <Image src={fantasy} />
        <Card.Footer>
            <Button className='bg-red-0'>范特西</Button>
        </Card.Footer>
    </Card>

	
	<Card>
		<Card.Banner>
			<Swiper arrow={false} draggable indicator>
				<Swiper.Item>
					<Image className='bg-yellow' size={250} />
				</Swiper.Item>
				<Swiper.Item>
					<Image className='bg-green' size={250} />
				</Swiper.Item>
			</Swiper>
		</Card.Banner>
		<Card.Footer>Swiper Images</Card.Footer>
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
