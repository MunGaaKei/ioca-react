import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { debounce } from 'radash';
import { useState, useRef, useMemo, Children, cloneElement, useEffect } from 'react';
import ToTop from './totop.js';

const defaultGetContainer = () => {
    if (typeof window === "undefined")
        return null;
    return window;
};
const Affix = (props) => {
    const { position = "fixed", left, top, right, bottom, offset, style, className, children, getContainer = defaultGetContainer, } = props;
    const [hidden, setHidden] = useState(() => {
        if (!offset)
            return false;
        if (typeof window === "undefined")
            return false;
        return (window.scrollY ?? 0) < offset;
    });
    const getContainerRef = useRef(getContainer);
    getContainerRef.current = getContainer;
    const hijackChildren = useMemo(() => {
        return Children.map(children, (node) => {
            if (node.type !== ToTop)
                return node;
            const { onClick } = node.props;
            return cloneElement(node, {
                onClick: (e) => {
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
        if (!offset || !container)
            return;
        const getScrollTop = () => container instanceof Window
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
    return (jsx("div", { className: classNames("i-affix", className, {
            "i-affix-visible": !hidden,
        }), style: {
            ...style,
            position,
            left,
            top,
            right,
            bottom,
        }, children: hijackChildren }));
};
Affix.ToTop = ToTop;

export { Affix as default };
