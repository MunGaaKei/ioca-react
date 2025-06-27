'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var reactDom = require('react-dom');
var hooks = require('../../js/hooks.js');
var content = require('./content.js');
var context = require('./context.js');
var useModal = require('./useModal.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function Modal(props) {
    const { visible, title, footer, okButtonProps, cancelButtonProps, closable = true, hideBackdrop, backdropClosable = true, hideCloseButton, disableEsc, width, height, customized, fixed, hideShadow, children, style, className, keepDOM, footerLeft, onClick, onVisibleChange, onClose, onOk, ...restProps } = props;
    const [show, setShow] = react.useState(visible);
    const [active, setActive] = react.useState(false);
    const [bounced, setBounced] = react.useState(false);
    const [mounted, setMounted] = react.useState(false);
    const toggable = react.useRef(true);
    const handleShow = async () => {
        if (!toggable.current)
            return;
        (!keepDOM || !show) && setShow(true);
        toggable.current = false;
        const timer = setTimeout(() => {
            setActive(true);
            onVisibleChange?.(true);
            toggable.current = true;
        }, 64);
        return () => clearTimeout(timer);
    };
    const handleHide = () => {
        if (!toggable.current)
            return;
        toggable.current = false;
        if (!closable) {
            setBounced(true);
            const timer = setTimeout(() => {
                setBounced(false);
                toggable.current = true;
            }, 400);
            return () => clearTimeout(timer);
        }
        setActive(false);
        const timer = setTimeout(() => {
            !keepDOM && setShow(false);
            toggable.current = true;
            onVisibleChange?.(false);
            onClose?.();
        }, 240);
        return () => clearTimeout(timer);
    };
    const handleBackdropClick = () => {
        backdropClosable && handleHide();
    };
    hooks.useKeydown((e) => {
        if (e.code !== "Escape" || !visible)
            return;
        handleHide();
    }, { disabled: disableEsc });
    react.useEffect(() => {
        visible ? handleShow() : handleHide();
    }, [visible]);
    react.useEffect(() => {
        setMounted(true);
    }, []);
    const handleClick = () => {
        if (typeof document === "undefined")
            return;
        document.documentElement.click();
    };
    if (!show || !mounted)
        return null;
    return reactDom.createPortal(jsxRuntime.jsx("div", { className: classNames__default("i-modal-container", {
            "i-modal-backdrop": !hideBackdrop,
            "i-modal-customized": customized,
            "i-modal-active": active,
            fixed,
        }, className), style: style, onClick: handleBackdropClick, "aria-modal": 'true', "aria-hidden": !active, children: jsxRuntime.jsx("div", { className: classNames__default("i-modal", {
                bounced,
                shadow: !hideShadow,
            }), style: {
                width,
                height,
            }, onClick: (e) => {
                e.stopPropagation();
                handleClick();
                onClick?.(e);
            }, role: 'dialog', "aria-labelledby": title ? "modal-title" : undefined, ...restProps, children: jsxRuntime.jsxs(context.default.Provider, { value: true, children: [customized && children, !customized && (jsxRuntime.jsx(content.default, { title: title, hideCloseButton: hideCloseButton, footer: footer, okButtonProps: okButtonProps, cancelButtonProps: cancelButtonProps, children: children, footerLeft: footerLeft, onOk: onOk, onClose: handleHide }))] }) }) }), document?.body ?? null);
}
Modal.useModal = useModal.default;

exports.default = Modal;
//# sourceMappingURL=modal.js.map
