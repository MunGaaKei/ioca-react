import classnames from "classnames";
import { MouseEvent, createElement, useEffect } from "react";
import useRipple from "../../js/useRipple";
import Loading from "../loading";
import Confirm from "./confirm";
import Group from "./group";
import "./index.css";
import Toggle from "./toggle";
import { CompositionButton, IButton } from "./type";

const formatClass = ({
	outline,
	flat,
	loading,
	disabled,
	size = "normal",
	block,
	round,
	square,
	secondary,
	className,
}: IButton) =>
	classnames("i-btn", className, {
		"i-btn-outline": outline,
		"i-btn-flat": flat,
		"i-btn-block": block,
		"i-btn-loading": loading,
		"i-btn-square": square,
		"i-btn-secondary": secondary,
		[`i-btn-${size}`]: size !== "normal",
		round,
		disabled,
	});

const Button = (props: IButton) => {
	const {
		as: As = "a",
		ref,
		children,
		className,
		loading,
		flat,
		outline,
		square,
		secondary,
		size,
		round,
		href,
		ripple = true,
		onClick,
		...restProps
	} = props;

	const handleClick = (e: MouseEvent<HTMLElement>) => {
		if (loading || restProps.disabled) {
			e.stopPropagation();
			e.preventDefault();
			return;
		}

		onClick?.(e);
	};

	if (!children) return <></>;

	const childNodes = [
		loading && <Loading key='loading' />,
		createElement(
			"span",
			{ key: "content", className: "i-btn-content" },
			children
		),
	];

	const attrs = {
		className: formatClass(props),
		["data-ripple"]:
			ripple && !loading && !restProps.disabled ? "" : undefined,
		onClick: handleClick,
	};

	useEffect(() => {
		ripple && useRipple();
	}, [ripple]);

	if (typeof As === "string") {
		return createElement(
			As,
			{
				ref,
				href,
				...attrs,
				...restProps,
			},
			childNodes
		);
	}

	return createElement(
		As,
		{
			to: href || "",
			...attrs,
			...restProps,
		},
		childNodes
	);
};

Button.Toggle = Toggle;
Button.Confirm = Confirm;
Button.Group = Group;

export default Button as CompositionButton;
