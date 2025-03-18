import { jsx } from 'react/jsx-runtime';
import classNames from 'classnames';
import { debounce } from 'radash';
import { useState, useMemo, Children, cloneElement, useEffect } from 'react';
import ToTop from './totop.js';

const Affix = (props) => {
    const { position = "fixed", left, top, right, bottom, offset, style, className, children, getContainer = () => {
        if (typeof document === "undefined")
            return null;
        return document.body;
    }, } = props;
    const [hidden, setHidden] = useState(false);
    const hijackChildren = useMemo(() => {
        return Children.map(children, (node) => {
            if (node.type === ToTop) {
                const { onClick } = node.props;
                return cloneElement(node, {
                    key: node.key,
                    ...node.props,
                    onClick: (e) => {
                        const container = getContainer();
                        onClick?.(e);
                        container?.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: "smooth",
                        });
                    },
                });
            }
            return node;
        });
    }, [children, getContainer]);
    useEffect(() => {
        const container = getContainer();
        if (!offset || !container)
            return;
        const listener = debounce({ delay: 160 }, () => {
            const top = container.scrollTop;
            setHidden(top < offset);
        });
        listener();
        container.addEventListener("scroll", listener);
        return () => {
            container.removeEventListener("scroll", listener);
        };
    }, [offset, getContainer]);
    return (jsx("div", { className: classNames("i-affix", className, {
            "i-affix-hidden": hidden,
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
//# sourceMappingURL=affix.js.map
