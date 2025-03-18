'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var classNames = require('classnames');
var react = require('react');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

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
        className: classNames__default("i-icon", className),
        ...restProps,
    };
    return react.cloneElement(icon, iconProps);
};

exports.default = Icon;
//# sourceMappingURL=icon.js.map
