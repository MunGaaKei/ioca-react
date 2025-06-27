import { version } from "@/package.json";
import { Button, Flex, Icon, Image, Text, useTheme } from "@p";
import { LightModeTwotone, NightlightTwotone } from "@ricons/material";
import { useEffect } from "react";
import { Link } from "react-router";
import "./index.css";
import logoReverse from "/logo-reverse.png";
import logo from "/logo.png";

export default function Home() {
	const { theme, setTheme } = useTheme({ listenStorageChange: true });
	const themeDark = theme === "theme-dark";
	const gradient = [
		"30deg",
		"var(--color-1)",
		"var(--color-2)",
		"var(--color-6)",
	];

	useEffect(() => {
		const ico = document.getElementById("ico");

		if (ico && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			ico.setAttribute("href", logoReverse);
		}
	}, [themeDark]);

	return (
		<Flex className='h-100vh justify-evenly'>
			<Button.Toggle
				square
				flat
				className='absolute'
				style={{ right: 12, top: 12 }}
				after={<Icon icon={<NightlightTwotone />} />}
				active={themeDark}
				onToggle={(v) => setTheme(v ? "theme-dark" : "theme-none")}
			>
				<Icon icon={<LightModeTwotone />} />
			</Button.Toggle>

			<div className='self-center'>
				<Image
					src={themeDark ? logoReverse : logo}
					size={100}
					className='home-logo'
				/>
			</div>
			<Flex
				direction='column'
				justify='center'
				align='flex-start'
				className='w-30'
			>
				<h1 className='home-title'>
					<Text gradient={gradient}>IOCA</Text>/
					<Text gradient={gradient}>REACT</Text>
				</h1>
				<p>
					<span className='opacity-5'>ver</span>{" "}
					<b className='font-lg'>{version}</b>
				</p>
				<h2 className='mt-40 hover-text-shadow'>
					<Link to='/docs/install' className='home-start'>
						开始
					</Link>
				</h2>
			</Flex>
		</Flex>
	);
}
