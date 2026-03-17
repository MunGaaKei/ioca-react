import { Button, Flex, Icon, Message } from "@p";
import {
	CodeRound,
	CopyAllTwotone,
	UnfoldLessRound,
	UnfoldMoreRound,
} from "@ricons/material";
import classNames from "classnames";
import { useState } from "react";
import CodeView from "../code";
import "./index.css";

interface IDemo {
	source: any;
	defaultCollapse?: boolean;
	className?: string;
	inline?: boolean;
}

export default function Demo(props: IDemo) {
	const { source, defaultCollapse = true, className, inline } = props;
	const { demo, code, lang } = source;
	const [collapsed, setCollapsed] = useState<boolean>(defaultCollapse);

	const handleCopy = async (e) => {
		e.stopPropagation();
		Message({
			content: "复制成功 👌",
			className: "bg-blue",
		});
		await navigator.clipboard.writeText(code);
	};

	return (
		<Flex
			className={className}
			direction={inline ? "row" : "column"}
			gap={12}
		>
			<div className='demo-component'>
				{typeof demo === "function" ? demo() : demo}
			</div>
			<div
				className={classNames("demo-code", {
					"demo-code-collapsed": collapsed,
				})}
			>
				<div
					className='demo-code-actions'
					onClick={() => setCollapsed(false)}
				>
					{collapsed && (
						<Icon
							icon={<CodeRound />}
							className='color-5 mr-auto ml-4 opacity-2'
							size='20px'
						/>
					)}
					<Button.Toggle
						secondary
						square
						flat
						size='small'
						active={collapsed}
						after={<Icon icon={<UnfoldMoreRound />} />}
						onToggle={setCollapsed}
						onClick={(e) => e.stopPropagation()}
					>
						<Icon icon={<UnfoldLessRound />} />
					</Button.Toggle>
					<Button
						secondary
						square
						flat
						size='small'
						onClick={handleCopy}
					>
						<Icon icon={<CopyAllTwotone />} />
					</Button>
				</div>
				{collapsed ? (
					<></>
				) : (
					<div className='demo-code-scroll flex-1'>
						<CodeView lang={lang}>{code}</CodeView>
					</div>
				)}
			</div>
		</Flex>
	);
}
