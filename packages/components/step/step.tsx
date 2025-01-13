import classNames from "classnames";
import { Children, ReactNode, useMemo } from "react";
import "./index.css";
import Item from "./item";
import { IStep } from "./type";

const Step = (props: IStep) => {
	const {
		active = 0,
		vertical,
		renderIcon,
		line,
		style,
		asList,
		className,
		children,
		onClick,
	} = props;

	const steps = useMemo(() => {
		const nodes: ReactNode[] = [];
		let index = 0;

		Children.map(children, (el: any) => {
			if (!el || el.type !== Item) return;

			const { props: elProps } = el;

			nodes.push({
				...el,
				props: {
					renderIcon,
					line,
					onClick,
					...elProps,
					vertical,
					active,
					asList,
					index: index++,
				},
			});
		});

		return nodes;
	}, [active, children]);

	return (
		<div
			className={classNames(
				"i-step",
				{ "i-step-vertical": vertical },
				className
			)}
			style={style}
		>
			{steps}
		</div>
	);
};

Step.Item = Item;

export default Step;
