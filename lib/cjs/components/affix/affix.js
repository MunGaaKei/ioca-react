'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var radash = require('radash');
var react = require('react');
var totop = require('./totop.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

const Affix = (props) => {
    const { position = "fixed", left, top, right, bottom, offset, style, className, children, getContainer = () => document.body, } = props;
    const [hidden, setHidden] = react.useState(false);
    const hijackChildren = react.useMemo(() => {
        return react.Children.map(children, (node) => {
            if (node.type === totop.default) {
                const { onClick } = node.props;
                return react.cloneElement(node, {
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
    react.useEffect(() => {
        const container = getContainer();
        if (!offset || !container)
            return;
        const listener = radash.debounce({ delay: 160 }, () => {
            const top = container.scrollTop;
            setHidden(top < offset);
        });
        listener();
        container.addEventListener("scroll", listener);
        return () => {
            container.removeEventListener("scroll", listener);
        };
    }, [offset, getContainer]);
    return (jsxRuntime.jsx("div", { className: classNames__default.default("i-affix", className, {
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
Affix.ToTop = totop.default;

exports.default = Affix;
//# sourceMappingURL=affix.js.map
