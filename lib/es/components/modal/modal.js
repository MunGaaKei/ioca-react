import { jsx, jsxs } from 'react/jsx-runtime';
import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useKeydown } from '../../js/hooks.js';
import Content from './content.js';
import useModal from './useModal.js';

function Modal(props) {
    const { visible, title, footer, okButtonProps, cancelButtonProps, closable = true, hideBackdrop, backdropClosable = true, hideCloseButton, disableEsc, width, height, customized, fixed, hideShadow, children, style, className, keepDOM, footerLeft, onClick, onVisibleChange, onClose, onOk, ...restProps } = props;
    const [show, setShow] = useState(visible);
    const [active, setActive] = useState(false);
    const [bounced, setBounced] = useState(false);
    const [client, setClient] = useState(false);
    const toggable = useRef(true);
    const handleShow = async () => {
        if (!toggable.current)
            return;
        (!keepDOM || !show) && setShow(true);
        toggable.current = false;
        const timer = setTimeout(() => {
            setActive(true);
            onVisibleChange?.(true);
            toggable.current = true;
        }, 24);
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
    useKeydown((e) => {
        if (e.code !== "Escape" || !visible)
            return;
        handleHide();
    }, { disabled: disableEsc });
    useEffect(() => {
        visible ? handleShow() : handleHide();
    }, [visible]);
    useEffect(() => {
        setClient(true);
    }, []);
    const handleClick = () => {
        if (typeof document === "undefined")
            return;
        document.documentElement.click();
    };
    if (!show || !client)
        return null;
    return createPortal(jsx("div", { className: classNames("i-modal-container", {
            "i-modal-backdrop": !hideBackdrop,
            "i-modal-customized": customized,
            "i-modal-active": active,
            fixed,
        }, className), style: style, onClick: handleBackdropClick, "aria-modal": 'true', "aria-hidden": !active, children: jsxs("div", { className: classNames("i-modal", {
                bounced,
                shadow: !hideShadow,
            }), style: {
                width,
                height,
            }, onClick: (e) => {
                e.stopPropagation();
                handleClick();
                onClick?.(e);
            }, role: 'dialog', "aria-labelledby": title ? "modal-title" : undefined, ...restProps, children: [customized && children, !customized && (jsx(Content, { title: title, hideCloseButton: hideCloseButton, footer: footer, okButtonProps: okButtonProps, cancelButtonProps: cancelButtonProps, children: children, footerLeft: footerLeft, onOk: onOk, onClose: handleHide }))] }) }), document?.body ?? null);
}
Modal.useModal = useModal;

export { Modal as default };
//# sourceMappingURL=modal.js.map
