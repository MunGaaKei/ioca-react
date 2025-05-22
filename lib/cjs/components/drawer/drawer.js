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
    });
    const [isPending, startTransition] = react.useTransition();
    const handleHide = () => {
        if (!toggable.current || isPending)
            return;
        toggable.current = false;
        startTransition(() => {
            state.active = false;
            setTimeout(() => {
                if (!keepDOM) {
                    state.show = false;
                }
                onVisibleChange?.(false);
                toggable.current = true;
                onClose?.();
            }, 240);
        });
    };
    const handleShow = () => {
        if (!toggable.current || isPending)
            return;
        state.show = true;
        onVisibleChange?.(true);
        toggable.current = false;
        startTransition(() => {
            // 确保 DOM 已经挂载
            requestAnimationFrame(() => {
                state.active = true;
                toggable.current = true;
            });
        });
    };
    react.useEffect(() => {
        visible ? handleShow() : handleHide();
    }, [visible]);
    const handleBackdropClick = () => {
        backdropClosable && handleHide();
    };
    hooks.useKeydown((e) => {
        if (e.code !== "Escape" || !visible)
            return;
        handleHide();
    }, {
        disabled: disabledEsc,
    });
    if (!state.show)
        return null;
    return reactDom.createPortal(jsxRuntime.jsx("div", { className: classNames__default("i-backdrop-drawer", className, {
            "i-active": state.active,
        }), onClick: handleBackdropClick, ...restProps, children: jsxRuntime.jsxs("div", { className: classNames__default("i-drawer", `i-drawer-${position}`), onClick: (e) => e.stopPropagation(), children: [header && (jsxRuntime.jsxs("header", { className: 'i-drawer-header', children: [header, !hideCloseButton && (jsxRuntime.jsx(helpericon.default, { className: 'i-drawer-close', onClick: handleHide }))] })), jsxRuntime.jsx("div", { className: 'i-drawer-content', children: children }), footer && jsxRuntime.jsx("div", { className: 'i-drawer-footer', children: footer })] }) }), document.body);
}

exports.default = Drawer;
//# sourceMappingURL=drawer.js.map
