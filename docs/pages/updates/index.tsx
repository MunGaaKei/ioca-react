import { Icon, Step, Text } from "@/packages";
import { AutoAwesomeRound, TipsAndUpdatesTwotone } from "@ricons/material";
import "./index.css";
import { updates } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>
				<Icon
					icon={<TipsAndUpdatesTwotone />}
					size='1em'
					className='pink mr-8'
				/>
				<Text
					gradient={["0deg", "aqua", "blue", "aqua", "blue", "aqua"]}
					wave
				>
					Updates
				</Text>
			</h2>

			<Step
				vertical
				asList
				className='update-items'
				renderIcon={(i) => {
					return (
						<Icon icon={<AutoAwesomeRound />} className='pink' />
					);
				}}
			>
				{updates.toReversed().map((o) => {
					const { title, content } = o;

					return (
						<Step.Item
							key={title}
							title={<Text as='h4'>{title}</Text>}
							style={{ fontSize: ".8em" }}
						>
							<div className='pb-20 color-6'>{content}</div>
						</Step.Item>
					);
				})}
			</Step>
		</>
	);
}
