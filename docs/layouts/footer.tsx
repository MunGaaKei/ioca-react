import { version } from "@/package.json";
import { Flex, Text } from "@p";

export default function Footer() {
	return (
		<footer className='mt-80 bg-9 pd-20 round-0 color-5'>
			<Flex justify='space-between' align='end'>
				<Text
					gradient={[
						"30deg",
						"var(--color-1)",
						"var(--color-2)",
						"var(--color-6)",
					]}
					as='h3'
					style={{ fontFamily: "jaini", display: "inline-block" }}
				>
					IOCA
				</Text>
				<Text size='.7em'>
					<i className='opacity-5'>ver.</i> {version}
				</Text>
			</Flex>
			<p>
				Design & Codes By{" "}
				<a
					href='https://mungaakei.github.io/iann/'
					target='_blank'
					className='color-2'
					style={{
						fontFamily: "jaini",
						fontSize: 20,
						letterSpacing: 1,
					}}
				>
					Iann
				</a>
			</p>
		</footer>
	);
}
