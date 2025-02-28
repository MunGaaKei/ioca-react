import { useReactive } from "ahooks";
import classNames from "classnames";
import { MouseEvent, useEffect } from "react";
import Button from "./button";
import { IButtonToggle } from "./type";

export default function Toggle(props: IButtonToggle) {
	const {
		ref,
		active,
		activeClass,
		after,
		disabled,
		children,
		className,
		toggable,
		onClick,
		onToggle,
		...restProps
	} = props;

	const state = useReactive({
		active,
		done: true,
	});

	const toggle = async () => {
		const hasAfter = after !== undefined;
		const nextActive = !state.active;

		const canToggle = toggable ? await toggable() : true;
		if (!canToggle) return;

		Object.assign(state, {
			active: nextActive,
			done: !hasAfter,
		});
		onToggle?.(nextActive);

		hasAfter &&
			setTimeout(() => {
				state.done = true;
			}, 16);
	};

	const handleClick = (e: MouseEvent<HTMLElement>) => {
		onClick?.(e);

		!disabled && toggle();
	};

	useEffect(() => {
		state.active !== active && toggle();
	}, [active]);

	return (
		<Button
			ref={ref}
			className={classNames(
				className,
				{ [activeClass || ""]: state.active },
				"i-btn-toggle"
			)}
			{...restProps}
			onClick={handleClick}
		>
			<div
				className={classNames("i-btn-toggle-content", {
					"i-btn-toggle-active": state.done,
				})}
			>
				{state.active ? after ?? children : children}
			</div>
		</Button>
	);
}
