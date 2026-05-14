'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var radash = require('radash');
var react = require('react');
var totop = require('./totop.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

const defaultGetContainer = () => {
    if (typeof window === "undefined")
        return null;
    return window;
};
const Affix = (props) => {
    const { position = "fixed", left, top, right, bottom, offset, style, className, children, getContainer = defaultGetContainer, } = props;
    const [hidden, setHidden] = react.useState(() => {
        if (!offset)
            return false;
        if (typeof window === "undefined")
            return false;
        return (window.scrollY ?? 0) < offset;
    });
    const getContainerRef = react.useRef(getContainer);
    getContainerRef.current = getContainer;
    const hijackChildren = react.useMemo(() => {
        return react.Children.map(children, (node) => {
            if (node.type !== totop.default)
                return node;
            const { onClick } = node.props;
            return react.cloneElement(node, {
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
    react.useEffect(() => {
        const container = getContainerRef.current();
        if (!offset || !container)
            return;
        const getScrollTop = () => container instanceof Window
            ? container.scrollY
            : container.scrollTop;
        const listener = radash.debounce({ delay: 160 }, () => {
            setHidden(getScrollTop() < offset);
        });
        listener();
        container.addEventListener("scroll", listener);
        return () => {
            listener.cancel();
            container.removeEventListener("scroll", listener);
        };
    }, [offset]);
    return (jsxRuntime.jsx("div", { className: classNames__default("i-affix", className, {
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
Affix.ToTop = totop.default;

exports.default = Affix;
//# sourceMappingURL=affix.js.map
