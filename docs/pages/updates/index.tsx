import { Icon, Step, Text } from "@/packages";
import { AutoAwesomeRound, AutoAwesomeTwotone } from "@ricons/material";
import { updates } from "./prop";

export default function Page() {
	return (
		<>
			<h2 className='mb-40'>
				<Icon icon={<AutoAwesomeRound />} size='1em' /> Updates
			</h2>

			<Step
				vertical
				asList
				renderIcon={(i) => {
					return <Icon icon={<AutoAwesomeTwotone />} />;
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
