import classNames from "classnames";
import { Children, cloneElement, forwardRef } from "react";
import "./index.css";
import Item from "./item";
import { IList } from "./type";

const List = forwardRef<HTMLUListElement, IList>((props, ref) => {
    const { label, type, border, className, children, ...restProps } = props;

    return (
        <ul
            ref={ref}
            className={classNames("i-list", className)}
            {...restProps}
        >
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
}) as typeof List & { Item: typeof Item };

List.Item = Item;

export default List;
