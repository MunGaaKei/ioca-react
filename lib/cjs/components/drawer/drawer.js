'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ahooks = require('ahooks');
var classNames = require('classnames');
var react = require('react');
var reactDom = require('react-dom');
var hooks = require('../../js/hooks.js');
var helpericon = require('../utils/helpericon/helpericon.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function Drawer(props) {
    const { visible, position = "left", header, footer, backdropClosable = true, hideCloseButton, keepDOM, className, disabledEsc, children, onVisibleChange, onClose, ...restProps } = props;
    const toggable = react.useRef(true);
    const state = ahooks.useReactive({
        show: visible,
        active: visible,
        init: false,
    });
    react.useEffect(() => {
        visible ? handleShow() : handleHide();
    }, [visible]);
    const handleShow = () => {
        if (!toggable.current)
            return;
        state.show = true;
        onVisibleChange?.(true);
        toggable.current = false;
        setTimeout(() => {
            state.active = true;
            toggable.current = true;
            state.init = true;
        }, 24);
    };
    const handleHide = () => {
        if (!toggable.current)
            return;
        toggable.current = false;
        state.active = false;
        setTimeout(() => {
            if (!keepDOM) {
                state.show = false;
            }
            onVisibleChange?.(false);
            toggable.current = true;
            onClose?.();
        }, 240);
    };
    const handleBackdropClick = function () {
        backdropClosable && handleHide();
    };
    hooks.useKeydown((e) => {
        if (e.code !== "Escape" || !visible)
            return;
        handleHide();
    }, {
        disabled: disabledEsc,
    });
    return reactDom.createPortal(state.show && (jsxRuntime.jsx("div", { className: classNames__default("i-backdrop-drawer", className, {
            "i-active": state.active,
        }), onClick: handleBackdropClick, ...restProps, children: jsxRuntime.jsxs("div", { className: classNames__default("i-drawer", `i-drawer-${position}`), onClick: (e) => e.stopPropagation(), children: [jsxRuntime.jsxs("header", { className: 'i-drawer-header', children: [header, jsxRuntime.jsx(helpericon.default, { active: !hideCloseButton, className: 'i-drawer-close', onClick: handleHide })] }), jsxRuntime.jsx("div", { className: 'i-drawer-content', children: children }), jsxRuntime.jsx("div", { className: 'i-drawer-footer', children: footer })] }) })), document?.body ?? null);
}

exports.default = Drawer;
//# sourceMappingURL=drawer.js.map
