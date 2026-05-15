import classNames from "classnames";
import "./index.css";
import { ILoading } from "./type";

const Loading = (props: ILoading) => {
    const { icon, text, size, absolute, style, className, ...restProps } =
        props;
    const iconSize = size != null
        ? { fontSize: typeof size === "number" ? `${size}px` : size }
        : undefined;

    return (
        <div
            className={classNames(
                "i-loading-container",
                {
                    absolute,
                },
                className,
            )}
            style={{
                ...style,
                inset: absolute ? 0 : "unset",
            }}
            {...restProps}
        >
            {icon ?? <span className="i-loading-icon" style={iconSize}></span>}

            {text}
        </div>
    );
};

export default Loading;
