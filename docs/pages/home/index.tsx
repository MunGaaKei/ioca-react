import { version } from "@/package.json";
import { Flex, Image, Text } from "@p";
import { Link } from "react-router-dom";
import "./index.css";
import logo from "/logo.jpg";

export default function Home() {
	const gradient = [
		"30deg",
		"var(--color-1)",
		"var(--color-2)",
		"var(--color-6)",
	];

	return (
		<Flex className='h-100vh justify-evenly'>
			<div className='self-center'>
				<Image src={logo} size={100} />
			</div>
			<Flex
				direction='column'
				justify='center'
				align='flex-start'
				className='w-30'
			>
				<h1 className='home-title'>
					<Text gradient={gradient}>IOCA</Text>{" "}
					<Text gradient={gradient}>REACT</Text>
				</h1>
				<p>version {version}</p>
				<h2 className='mt-40 hover-text-shadow'>
					<Link to='/docs/install'>开始</Link>
				</h2>
			</Flex>
		</Flex>
	);
}
