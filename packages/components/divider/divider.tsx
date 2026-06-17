import classNames from "classnames";
import { IDivider } from "./type";

const Divider = ({ className, children, color, width, style, ...restProps }: IDivider) => {
    return (
        <li
            role="separator"
            className={classNames("i-divider", className)}
            style={
                {
                    ...(color !== undefined ? { "--divider-color": color } : undefined),
                    ...(width !== undefined ? { "--divider-width": typeof width === "number" ? `${width}px` : width } : undefined),
                    ...style,
                } as React.CSSProperties
            }
            {...restProps}
        >
            {children && <div className="i-divider-content">{children}</div>}
        </li>
    );
};

export default Divider;
