'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var button = require('./button.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function Toggle(props) {
    const { ref, active, activeClass, after, disabled, children, className, toggable, onClick, onToggle, ...restProps } = props;
    const [isActive, setIsActive] = react.useState(active);
    const [done, setDone] = react.useState(true);
    const toggle = async () => {
        const hasAfter = !!after;
        const nextActive = !isActive;
        const canToggle = toggable ? await toggable() : true;
        if (!canToggle)
            return;
        setIsActive(nextActive);
        setDone(!hasAfter);
        onToggle?.(nextActive);
        if (!hasAfter)
            return;
        setTimeout(() => {
            setDone(true);
        }, 16);
    };
    const handleClick = (e) => {
        onClick?.(e);
        !disabled && toggle();
    };
    react.useEffect(() => {
        setIsActive(active);
        setDone(true);
    }, [active]);
    return (jsxRuntime.jsx(button.default, { ref: ref, className: classNames__default(className, { [activeClass || ""]: isActive }, "i-btn-toggle"), ...restProps, onClick: handleClick, children: jsxRuntime.jsx("div", { className: classNames__default("i-btn-toggle-content", {
                "i-btn-toggle-active": done,
            }), children: isActive ? (after ?? children) : children }) }));
}

exports.default = Toggle;
//# sourceMappingURL=toggle.js.map
