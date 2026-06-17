import classNames from "classnames";
import { Children, cloneElement, forwardRef } from "react";
import "./index.css";
import Item from "./item";
import { IList } from "./type";

const List = forwardRef<HTMLUListElement, IList>((props, ref) => {
    const { label, type, border, padding, className, style, children, ...restProps } = props;

    return (
        <ul
            ref={ref}
            className={classNames("i-list", className, {
                "i-list-option-type": type === "option",
            })}
            style={{
                ...(padding !== undefined
                    ? { "--option-gap": typeof padding === "number" ? `${padding}px` : padding }
                    : undefined),
                ...style,
            } as React.CSSProperties}
            {...restProps}
        >
            {Children.map(children, (node: any, i) => {
                const renderLabel = typeof label === "function" ? label(i) : label;

                const { type: elementType, props: nodeProps } = node;

                if (elementType === Item) {
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
