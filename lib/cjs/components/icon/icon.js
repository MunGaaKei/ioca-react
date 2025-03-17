'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var classNames = require('classnames');
var react = require('react');

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
        className: classNames("i-icon", className),
        ...restProps,
    };
    return react.cloneElement(icon, iconProps);
};

exports.default = Icon;
//# sourceMappingURL=icon.js.map
