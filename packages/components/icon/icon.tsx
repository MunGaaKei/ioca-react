import classNames from "classnames";
import { cloneElement, forwardRef, isValidElement } from "react";
import "./index.css";
import { IIcon } from "./type";

const Icon = forwardRef<HTMLElement, IIcon>((props, ref) => {
	const {
		icon,
		size = "1.425em",
		rotate,
		style,
		className,
		...restProps
	} = props;

	if (!isValidElement(icon)) return icon;

	const elProps = {
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

	return cloneElement(icon, elProps);
});

export default Icon;
