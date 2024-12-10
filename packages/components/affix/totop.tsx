import { SkipPreviousRound } from "@ricons/material";
import classNames from "classnames";
import Button from "../button";
import Icon from "../icon";
import { IAffix } from "./type";

function ToTop(props: IAffix) {
	const { style, className, onClick } = props;

	return (
		<Button
			square
			className={classNames("i-affix-totop", className)}
			style={{ ...style }}
			onClick={onClick}
		>
			<Icon icon={<SkipPreviousRound />} rotate={90} />
		</Button>
	);
}

export default ToTop;
