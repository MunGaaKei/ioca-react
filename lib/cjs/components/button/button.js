'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var index = require('../../js/useRipple/index.js');
var loading = require('../loading/loading.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

const formatClass = ({ outline, flat, loading, disabled, size = "normal", block, round, square, secondary, className, }) => classNames__default.default("i-btn", className, {
    "i-btn-outline": outline,
    "i-btn-flat": flat,
    "i-btn-block": block,
    "i-btn-loading": loading,
    "i-btn-square": square,
    "i-btn-secondary": secondary,
    [`i-btn-${size}`]: size !== "normal",
    round,
    disabled,
});
const Button = (props) => {
    const { as: As = "a", ref, children, className, loading: loading$1, flat, outline, square, secondary, size, round, href, ripple = true, onClick, ...restProps } = props;
    const handleClick = (e) => {
        if (loading$1 || restProps.disabled) {
            e.stopPropagation();
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };
    if (!children)
        return jsxRuntime.jsx(jsxRuntime.Fragment, {});
    const childNodes = [
        loading$1 && jsxRuntime.jsx(loading.default, {}, 'loading'),
        react.createElement("span", { key: "content", className: "i-btn-content" }, children),
    ];
    const attrs = {
        className: formatClass(props),
        ["data-ripple"]: ripple && !loading$1 && !restProps.disabled ? "" : undefined,
        onClick: handleClick,
    };
    react.useEffect(() => {
        ripple && index.default();
    }, [ripple]);
    if (typeof As === "string") {
        return react.createElement(As, {
            ref,
            href,
            ...attrs,
            ...restProps,
        }, childNodes);
    }
    return react.createElement(As, {
        to: href || "",
        ...attrs,
        ...restProps,
    }, childNodes);
};

exports.default = Button;
//# sourceMappingURL=button.js.map
