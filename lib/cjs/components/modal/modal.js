'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var reactDom = require('react-dom');
var hooks = require('../../js/hooks.js');
var button = require('../button/button.js');
var helpericon = require('../utils/helpericon/helpericon.js');
var useModal = require('./useModal.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

function DefaultContent(props) {
    const { title, footer, hideCloseButton, footerLeft, okButtonProps, cancelButtonProps, children, onOk, onClose, } = props;
    const showHeader = title || !hideCloseButton;
    const handleOk = async () => {
        const ret = await onOk?.();
        if (ret === false)
            return;
        onClose?.();
    };
    const renderFooter = react.useMemo(() => {
        if (footer || footer === null)
            return footer;
        const propsOk = Object.assign({
            children: "确定",
            onClick: handleOk,
        }, okButtonProps);
        const propsCancel = Object.assign({
            secondary: true,
            children: "关闭",
            onClick: onClose,
        }, cancelButtonProps);
        return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [footerLeft, jsxRuntime.jsx(button.default, { ...propsOk }), jsxRuntime.jsx(button.default, { ...propsCancel })] }));
    }, [footer, okButtonProps, cancelButtonProps]);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [showHeader && (jsxRuntime.jsxs("header", { className: 'i-modal-header', children: [title && jsxRuntime.jsx("b", { children: title }), jsxRuntime.jsx(helpericon.default, { active: !hideCloseButton, className: 'i-modal-close', onClick: onClose })] })), jsxRuntime.jsx("div", { className: 'i-modal-content', children: children }), jsxRuntime.jsx("footer", { className: 'i-modal-footer', children: renderFooter })] }));
}
function Modal(props) {
    const { visible, title, footer, okButtonProps, cancelButtonProps, closable = true, hideBackdrop, backdropClosable = true, hideCloseButton, disableEsc, width, height, customized, fixed, hideShadow, children, style, className, keepDOM, footerLeft, onClick, onVisibleChange, onClose, onOk, ...restProps } = props;
    const [show, setShow] = react.useState(visible);
    const [active, setActive] = react.useState(false);
    const [bounced, setBounced] = react.useState(false);
    const toggable = react.useRef(true);
    const handleShow = () => {
        if (!toggable.current)
            return;
        (!keepDOM || !show) && setShow(true);
        toggable.current = false;
        setTimeout(() => {
            setActive(true);
            onVisibleChange?.(true);
            toggable.current = true;
        }, 24);
    };
    const handleHide = () => {
        if (!toggable.current)
            return;
        toggable.current = false;
        if (!closable) {
            setBounced(true);
            setTimeout(() => {
                setBounced(false);
                toggable.current = true;
            }, 400);
            return;
        }
        setActive(false);
        setTimeout(() => {
            !keepDOM && setShow(false);
            toggable.current = true;
            onVisibleChange?.(false);
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
    }, { disabled: disableEsc });
    react.useEffect(() => {
        visible ? handleShow() : handleHide();
    }, [visible]);
    const handleClick = () => {
        if (typeof document === "undefined")
            return;
        document.documentElement.click();
    };
    if (!show)
        return null;
    return reactDom.createPortal(jsxRuntime.jsx("div", { className: classNames__default("i-modal-container", {
            "i-modal-backdrop": !hideBackdrop,
            "i-modal-customized": customized,
            "i-modal-active": active,
            fixed,
        }, className), style: style, onClick: handleBackdropClick, children: jsxRuntime.jsxs("div", { className: classNames__default("i-modal", {
                bounced,
                shadow: !hideShadow,
            }), style: {
                width,
                height,
            }, onClick: (e) => {
                e.stopPropagation();
                handleClick();
                onClick?.(e);
            }, ...restProps, children: [customized && children, !customized && (jsxRuntime.jsx(DefaultContent, { title: title, hideCloseButton: hideCloseButton, footer: footer, okButtonProps: okButtonProps, cancelButtonProps: cancelButtonProps, children: children, footerLeft: footerLeft, onOk: onOk, onClose: handleHide }))] }) }), document?.body ?? null);
}
Modal.useModal = useModal.default;

exports.default = Modal;
//# sourceMappingURL=modal.js.map
