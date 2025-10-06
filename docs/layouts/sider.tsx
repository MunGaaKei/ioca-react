import { Button, Drawer, Icon, Popup, Text, useTheme } from "@p";
import {
	BugReportTwotone,
	LightModeTwotone,
	MenuRound,
	NightlightTwotone,
} from "@ricons/material";
import { useReactive } from "ahooks";
import { Link } from "react-router";

export default function Sider(props) {
	const { useDrawer, menus } = props;
	const { theme, setTheme } = useTheme({ listenStorageChange: true });
	const state = useReactive({
		menuVisible: false,
	});

	return (
		<div
			className='sticky-top flex flex-column justify-center items-center pd-4 gap-4 mb-auto mr-8 bg-blur round-0'
			style={{
				position: useDrawer ? "fixed" : undefined,
				right: useDrawer ? 0 : undefined,
			}}
		>
			<Text
				gradient={["30deg", "var(--color-1)", "var(--color-7)"]}
				as='h2'
				style={{ fontFamily: "jaini" }}
			>
				<Link to='/'>I/R</Link>
			</Text>

			<Popup className='pd-8 bg-0' content='切换主题' position='left'>
				<Button.Toggle
					square
					flat
					after={<Icon icon={<NightlightTwotone />} />}
					active={theme === "theme-dark"}
					onToggle={(v) => setTheme(v ? "theme-dark" : "theme-none")}
				>
					<Icon icon={<LightModeTwotone />} />
				</Button.Toggle>
			</Popup>

			<Popup className='pd-8 bg-0' content='Github' position='left'>
				<Button
					square
					flat
					href='https://github.com/MunGaaKei/ioca-react'
					target='_blank'
				>
					<Icon
						icon={
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 32 32'
							>
								<path
									d='M16 2a14 14 0 0 0-4.43 27.28c.7.13 1-.3 1-.67v-2.38c-3.89.84-4.71-1.88-4.71-1.88a3.71 3.71 0 0 0-1.62-2.05c-1.27-.86.1-.85.1-.85a2.94 2.94 0 0 1 2.14 1.45a3 3 0 0 0 4.08 1.16a2.93 2.93 0 0 1 .88-1.87c-3.1-.36-6.37-1.56-6.37-6.92a5.4 5.4 0 0 1 1.44-3.76a5 5 0 0 1 .14-3.7s1.17-.38 3.85 1.43a13.3 13.3 0 0 1 7 0c2.67-1.81 3.84-1.43 3.84-1.43a5 5 0 0 1 .14 3.7a5.4 5.4 0 0 1 1.44 3.76c0 5.38-3.27 6.56-6.39 6.91a3.33 3.33 0 0 1 .95 2.59v3.84c0 .46.25.81 1 .67A14 14 0 0 0 16 2z'
									fillRule='evenodd'
									fill='currentColor'
								></path>
							</svg>
						}
					/>
				</Button>
			</Popup>

			{useDrawer && (
				<>
					<Button
						square
						flat
						onClick={() => {
							state.menuVisible = true;
						}}
					>
						<Icon icon={<MenuRound />} />
					</Button>

					<Drawer
						visible={state.menuVisible}
						hideCloseButton
						keepDOM
						onClose={() => (state.menuVisible = false)}
					>
						{menus}
					</Drawer>
				</>
			)}

			<Popup className='pd-8 bg-0' content='Report Bugs' position='left'>
				<Button
					square
					flat
					href='https://github.com/MunGaaKei/ioca-react/issues/new'
					target='_blank'
				>
					<Icon icon={<BugReportTwotone />} size='1.8em' />
				</Button>
			</Popup>

			{/* <Button square flat>
				<Icon icon={<SearchRound />} size='1.8em' />
			</Button> */}
		</div>
	);
}
