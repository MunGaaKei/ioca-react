import classNames from "classnames";
import { cloneElement, isValidElement } from "react";
import "./index.css";
import { IIcon } from "./type";

const Icon = (props: IIcon) => {
	const {
		ref,
		icon,
		size = "1.425em",
		rotate,
		style,
		className,
		...restProps
	} = props;

	if (!isValidElement(icon)) return icon;

	const iconProps = {
		ref,
		style: {
			transform: rotate ? `rotate(${rotate}deg)` : undefined,
			...style,
			width: size,
			height: size,
		},
		className: classNames("i-icon", className),
		...restProps,
	};

	return cloneElement(icon, iconProps);
};

export default Icon;
