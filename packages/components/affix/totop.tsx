import { SkipPreviousRound } from "@ricons/material";
import classNames from "classnames";
import { CSSProperties, MouseEventHandler } from "react";
import Button from "../button";
import Icon from "../icon";

interface IToTopProps {
	style?: CSSProperties;
	className?: string;
	onClick?: MouseEventHandler<HTMLElement>;
}

function ToTop(props: IToTopProps) {
	const { style, className, onClick } = props;

	return (
		<Button
			square
			className={classNames("i-affix-totop", "i-affix-target", className)}
			style={{ ...style }}
			onClick={onClick}
		>
			<Icon icon={<SkipPreviousRound />} rotate={90} />
		</Button>
	);
}

export default ToTop;
