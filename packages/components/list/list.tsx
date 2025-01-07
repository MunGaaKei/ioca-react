import classNames from "classnames";
import { Children, cloneElement, Fragment } from "react";
import "./index.css";
import Item from "./item";
import { IList } from "./type";
import Virtual from "./virtual";

const List = (props: IList): JSX.Element => {
	const { label, type, className, children, ...restProps } = props;

	return (
		<ul className={classNames("i-list", className)} {...restProps}>
			{Children.map(children, (node: any, i) => {
				const renderLabel =
					typeof label === "function" ? label(i) : label;

				if (node.type === Fragment) return node;

				return cloneElement(node, {
					label: renderLabel,
					...node.props,
					type,
				});
			})}
		</ul>
	);
};

List.Virtual = Virtual;
List.Item = Item;

export default List;
