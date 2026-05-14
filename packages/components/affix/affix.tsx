import classNames from "classnames";
import { debounce } from "radash";
import {
    Children,
    cloneElement,
    MouseEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import "./index.css";
import ToTop from "./totop";
import { IAffix } from "./type";

const defaultGetContainer = () => {
    if (typeof window === "undefined") return null;
    return window;
};

const Affix = (props: IAffix) => {
    const {
        position = "fixed",
        left,
        top,
        right,
        bottom,
        offset,
        style,
        className,
        children,
        getContainer = defaultGetContainer,
    } = props;

    const [hidden, setHidden] = useState<boolean>(() => {
        if (!offset) return false;
        if (typeof window === "undefined") return false;
        return (window.scrollY ?? 0) < offset;
    });
    const getContainerRef = useRef(getContainer);
    getContainerRef.current = getContainer;

    const hijackChildren = useMemo(() => {
        return Children.map(children, (node: any) => {
            if (node.type !== ToTop) return node;

            const { onClick } = node.props;

            return cloneElement(node, {
                onClick: (e: MouseEvent) => {
                    const container = getContainerRef.current();

                    onClick?.(e);
                    container?.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
                    });
                },
            });
        });
    }, [children]);

    useEffect(() => {
        const container = getContainerRef.current();
        if (!offset || !container) return;

        const getScrollTop = () =>
            container instanceof Window
                ? container.scrollY
                : container.scrollTop;

        const listener = debounce({ delay: 160 }, () => {
            setHidden(getScrollTop() < offset);
        });

        listener();
        container.addEventListener("scroll", listener);

        return () => {
            listener.cancel();
            container.removeEventListener("scroll", listener);
        };
    }, [offset]);

    return (
        <div
            className={classNames("i-affix", className, {
                "i-affix-visible": !hidden,
            })}
            style={{
                ...style,
                position,
                left,
                top,
                right,
                bottom,
            }}
        >
            {hijackChildren}
        </div>
    );
};

Affix.ToTop = ToTop;

export default Affix;
