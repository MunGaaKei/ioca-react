'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

const Text = (props) => {
    const { as: Tag = "span", size, weight, decoration, gradient, wave, style, className, children, } = props;
    const gradients = react.useMemo(() => {
        if (!gradient || !Array.isArray(gradient))
            return {};
        return {
            backgroundImage: `-webkit-linear-gradient(${gradient.join(",")})`,
            backgroundClip: "text",
        };
    }, [gradient]);
    return (jsxRuntime.jsx(Tag, { style: {
            fontSize: size,
            fontWeight: weight,
            textDecoration: decoration,
            ...gradients,
            ...style,
        }, className: classNames__default.default(className, {
            "i-text-gradient": gradient,
            "i-text-gradient-wave": wave,
        }), children: children }));
};

exports.default = Text;
//# sourceMappingURL=text.js.map
