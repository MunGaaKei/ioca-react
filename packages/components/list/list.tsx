import classNames from "classnames";
import { Children, cloneElement } from "react";
import "./index.css";
import Item from "./item";
import { IList } from "./type";

const List = (props: IList) => {
	const { label, type, border, className, children, ...restProps } = props;

	return (
		<ul className={classNames("i-list", className)} {...restProps}>
			{Children.map(children, (node: any, i) => {
				const renderLabel =
					typeof label === "function" ? label(i) : label;

				const { type, props: nodeProps } = node;

				if (type === Item) {
					return cloneElement(node, {
						label: renderLabel,
						...nodeProps,
						type: props.type,
						border,
					});
				}

				return node;
			})}
		</ul>
	);
};

List.Item = Item;

export default List;
