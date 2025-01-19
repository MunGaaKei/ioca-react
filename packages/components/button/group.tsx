import classNames from "classnames";
import { Children, cloneElement, useMemo } from "react";
import Button from "./button";
import { IButtonGroup } from "./type";

export default function Group(props: IButtonGroup) {
	const { children, vertical, buttonProps, className, style } = props;

	const nodes = useMemo(() => {
		return Children.map(children, (node: any) => {
			const { type } = node;

			if (type === Button) {
				return cloneElement(
					node,
					Object.assign({}, node.props, buttonProps)
				);
			}

			return node;
		});
	}, [children]);

	return (
		<div
			className={classNames(
				className,
				vertical ? "i-btn-group-vertical" : "i-btn-group-horizonal"
			)}
			style={style}
		>
			{nodes}
		</div>
	);
}
