import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useKeydown } from '../../js/hooks.js';
import '../button/index.js';
import Helpericon from '../utils/helpericon/helpericon.js';
import Button from '../button/button.js';

function DefaultContent(props) {
    const { title, footer, hideCloseButton, footerLeft, okButtonProps, cancelButtonProps, children, onOk, onClose, } = props;
    const showHeader = title || !hideCloseButton;
    const handleOk = async () => {
        const ret = await onOk?.();
        if (ret)
            return;
        onClose?.();
    };
    const renderFooter = useMemo(() => {
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
        return (jsxs(Fragment, { children: [footerLeft, jsx(Button, { ...propsOk }), jsx(Button, { ...propsCancel })] }));
    }, [footer, okButtonProps, cancelButtonProps]);
    return (jsxs(Fragment, { children: [showHeader && (jsxs("header", { className: 'i-modal-header', children: [title && jsx("b", { children: title }), jsx(Helpericon, { active: !hideCloseButton, className: 'i-modal-close', onClick: onClose })] })), jsx("div", { className: 'i-modal-content', children: children }), jsx("footer", { className: 'i-modal-footer', children: renderFooter })] }));
}
function Modal(props) {
    const { visible, title, footer, okButtonProps, cancelButtonProps, closable = true, hideBackdrop, backdropClosable = true, hideCloseButton, disableEsc, width, height, customized, fixed, hideShadow, children, style, className, keepDOM, footerLeft, onClick, onVisibleChange, onClose, onOk, ...restProps } = props;
    const [show, setShow] = useState(visible);
    const [active, setActive] = useState(false);
    const [bounced, setBounced] = useState(false);
    const toggable = useRef(true);
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
    useKeydown((e) => {
        if (e.code !== "Escape" || !visible)
            return;
        handleHide();
    }, { disabled: disableEsc });
    useEffect(() => {
        visible ? handleShow() : handleHide();
    }, [visible]);
    if (!show)
        return null;
    return createPortal(jsx("div", { className: classNames("i-modal-container", {
            "i-modal-backdrop": !hideBackdrop,
            "i-modal-customized": customized,
            "i-modal-active": active,
            fixed,
        }, className), style: style, onClick: handleBackdropClick, children: jsxs("div", { className: classNames("i-modal", {
                bounced,
                shadow: !hideShadow,
            }), style: {
                width,
                height,
            }, onClick: (e) => {
                e.stopPropagation();
                document.documentElement.click();
                onClick?.(e);
            }, ...restProps, children: [customized && children, !customized && (jsx(DefaultContent, { title: title, hideCloseButton: hideCloseButton, footer: footer, okButtonProps: okButtonProps, cancelButtonProps: cancelButtonProps, children: children, footerLeft: footerLeft, onOk: onOk, onClose: handleHide }))] }) }), document.body);
}

export { Modal as default };
//# sourceMappingURL=modal.js.map
