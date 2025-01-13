import { CloseRound } from "@ricons/material";
import classNames from "classnames";
import { uid } from "radash";
import { createElement } from "react";
import Icon from "../../icon";
import "./index.css";
import { IHelperIcon } from "./type";

const Helpericon = (props: IHelperIcon) => {
	const {
		as = "a",
		active,
		className,
		icon = <CloseRound />,
		...restProps
	} = props;

	if (!active) return <></>;

	return createElement(
		as,
		{
			className: classNames("i-helpericon", className),
			...restProps,
		},
		[
			createElement(Icon, {
				key: uid(3),
				icon,
			}),
		]
	);
};

export default Helpericon;
