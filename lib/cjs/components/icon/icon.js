'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var classNames = require('classnames');
var react = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

const Icon = (props) => {
    const { ref, icon, size = "1.425em", rotate, style, className, ...restProps } = props;
    if (!react.isValidElement(icon))
        return icon;
    const iconProps = {
        ref,
        style: {
            transform: rotate ? `rotate(${rotate}deg)` : undefined,
            ...style,
            width: size,
            height: size,
        },
        className: classNames__default.default("i-icon", className),
        ...restProps,
    };
    return react.cloneElement(icon, iconProps);
};

exports.default = Icon;
//# sourceMappingURL=icon.js.map
