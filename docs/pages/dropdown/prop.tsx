import { Button, Dropdown, Icon, Tag } from "@p";
import {
	KeyboardArrowDownRound,
	KeyboardCommandKeyRound,
	MoreHorizRound,
} from "@ricons/material";

export const DBasic = {
	demo: () => {
		const Dropmenu = (close) => {
			return (
				<>
					<Dropdown.Item type='option'>
						<span>复制</span>
						<Tag size='small' className='bg-blue-0'>
							<Icon
								icon={<KeyboardCommandKeyRound />}
								size='1.125em'
							/>
							<span>C</span>
						</Tag>
					</Dropdown.Item>
					<Dropdown.Item type='option' disabled>
						<span>粘贴</span>
						<Tag size='small' className='bg-blue-0'>
							<Icon
								icon={<KeyboardCommandKeyRound />}
								size='1.125em'
							/>
							<span>V</span>
						</Tag>
					</Dropdown.Item>
					<Dropdown.Item
						type='option'
						more={
							<>
								<Dropdown.Item type='option' onClick={close}>
									<span>剪切</span>
									<Tag size='small' className='bg-yellow-0'>
										<Icon
											icon={<KeyboardCommandKeyRound />}
											size='1.125em'
										/>
										<span>X</span>
									</Tag>
								</Dropdown.Item>
								<Dropdown.Item type='option'>
									<span>删除</span>
									<Tag size='small' className='bg-red-0'>
										<Icon
											icon={<KeyboardCommandKeyRound />}
											size='1.125em'
										/>
										<span>D</span>
									</Tag>
								</Dropdown.Item>
							</>
						}
						moreProps={{ position: "right" }}
					>
						<span>更多</span>
						<Icon icon={<MoreHorizRound />} size='1.125em' />
					</Dropdown.Item>
					<Button
						className='bg-grey mt-12'
						size='small'
						onClick={close}
					>
						取消
					</Button>
				</>
			);
		};

		return (
			<Dropdown content={Dropmenu} width={160}>
				<Button>
					下拉菜单
					<Icon icon={<KeyboardArrowDownRound />} size='1.25em' />
				</Button>
			</Dropdown>
		);
	},
	code: `const Dropmenu = (close) => {
	return (
		<>
			<Dropdown.Item type='option'>
				<span>复制</span>
				<Tag size='small' className='bg-blue-0'>
					<Icon
						icon={<KeyboardCommandKeyRound />}
						size='1.125em'
					/>
					<span>C</span>
				</Tag>
			</Dropdown.Item>
			<Dropdown.Item type='option' disabled>
				<span>粘贴</span>
				<Tag size='small' className='bg-blue-0'>
					<Icon
						icon={<KeyboardCommandKeyRound />}
						size='1.125em'
					/>
					<span>V</span>
				</Tag>
			</Dropdown.Item>
			<Dropdown.Item
				type='option'
				more={
					<>
						<Dropdown.Item type='option' onClick={close}>
							<span>剪切</span>
							<Tag size='small' className='bg-yellow-0'>
								<Icon
									icon={<KeyboardCommandKeyRound />}
									size='1.125em'
								/>
								<span>X</span>
							</Tag>
						</Dropdown.Item>
						<Dropdown.Item type='option'>
							<span>删除</span>
							<Tag size='small' className='bg-red-0'>
								<Icon
									icon={<KeyboardCommandKeyRound />}
									size='1.125em'
								/>
								<span>D</span>
							</Tag>
						</Dropdown.Item>
					</>
				}
				moreProps={{ position: "right" }}
			>
				<span>更多</span>
				<Icon icon={<MoreHorizRound />} size='1.125em' />
			</Dropdown.Item>
			<Button
				className='bg-grey mt-12'
				size='small'
				onClick={close}
			>
				取消
			</Button>
		</>
	);
};

return (
	<Dropdown content={Dropmenu} width={160}>
		<Button>
			下拉菜单
			<Icon icon={<KeyboardArrowDownRound />} size='1.25em' />
		</Button>
	</Dropdown>
);`,
	lang: "javascript",
};

export const PDropdown = [
	{
		name: "width",
		desc: "弹出内容最小宽度",
		type: ["number", "string"],
	},
	{
		name: "content",
		desc: "内容",
		type: ["ReactNode", "(close: () => void) => ReactNode"],
	},
];

export const PDropdownItem = [
	{
		name: "more",
		desc: "次级菜单",
		type: ["ReactNode"],
	},
	{
		name: "moreProps",
		desc: "次级Dropdown",
		type: [<a className='blue'>IDropdown</a>],
	},
];
