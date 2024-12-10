import { Text } from "@p";

export default function Footer() {
	return (
		<footer className='mt-80 bg-9 pd-20 round-0'>
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
			<p className='color-5'>Designed & Codes By Iann</p>
		</footer>
	);
}
