'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ahooks = require('ahooks');
var classNames = require('classnames');
var react = require('react');
var button = require('./button.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var classNames__default = /*#__PURE__*/_interopDefault(classNames);

function Toggle(props) {
    const { ref, active, activeClass, after, disabled, children, className, toggable, onClick, onToggle, ...restProps } = props;
    const state = ahooks.useReactive({
        active,
        done: true,
    });
    const toggle = async () => {
        const hasAfter = !!after;
        const nextActive = !state.active;
        const canToggle = toggable ? await toggable() : true;
        if (!canToggle)
            return;
        Object.assign(state, {
            active: nextActive,
            done: !hasAfter,
        });
        onToggle?.(nextActive);
        if (!hasAfter)
            return;
        setTimeout(() => {
            state.done = true;
        }, 16);
    };
    const handleClick = (e) => {
        onClick?.(e);
        !disabled && toggle();
    };
    react.useEffect(() => {
        Object.assign(state, {
            active,
            done: true,
        });
    }, [active]);
    return (jsxRuntime.jsx(button.default, { ref: ref, className: classNames__default.default(className, { [activeClass || ""]: state.active }, "i-btn-toggle"), ...restProps, onClick: handleClick, children: jsxRuntime.jsx("div", { className: classNames__default.default("i-btn-toggle-content", {
                "i-btn-toggle-active": state.done,
            }), children: state.active ? after ?? children : children }) }));
}

exports.default = Toggle;
//# sourceMappingURL=toggle.js.map
