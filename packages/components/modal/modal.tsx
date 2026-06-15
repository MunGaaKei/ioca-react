import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useKeydown } from "../../js/hooks";
import Content from "./content";
import ModalContext from "./context";
import "./index.css";
import { getContainer, isTop, register, subscribe, updateVisible } from "./modalManager";
import { CompositionModal, IModal } from "./type";
import useModal from "./useModal";

let midCounter = 0;

function Modal(props: IModal) {
    const { visible, title, footer, okButtonProps, cancelButtonProps, closable = true, hideBackdrop, backdropClosable = true, hideCloseButton, disableEsc, width, height, customized, fixed, hideShadow, children, style, className, keepDOM, footerLeft, onClick, onVisibleChange, onClose, onOk, ...restProps } = props;

    const midRef = useRef(`modal-${++midCounter}`);
    const mid = midRef.current;

    const [show, setShow] = useState(visible);
    const [active, setActive] = useState(false);
    const [bounced, setBounced] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [top, setTop] = useState(false);
    const toggable = useRef(true);
    const layerRef = useRef(null);

    const handleShow = useCallback(() => {
        if (!toggable.current) return;

        if (!keepDOM || !show) setShow(true);
        toggable.current = false;

        updateVisible(mid, true);

        const raf = requestAnimationFrame(() => {
            if (!layerRef.current) {
                requestAnimationFrame(() => {
                    setActive(true);
                    onVisibleChange?.(true);
                    toggable.current = true;
                });
                return;
            }
            setActive(true);
            onVisibleChange?.(true);
            toggable.current = true;
        });

        return () => cancelAnimationFrame(raf);
    }, [keepDOM, show, onVisibleChange]);

    const handleHide = useCallback(() => {
        if (!toggable.current) return;
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
        updateVisible(mid, false);
        const timer = setTimeout(() => {
            if (!keepDOM) setShow(false);
            toggable.current = true;
            onVisibleChange?.(false);
            onClose?.();
        }, 240);

        return () => clearTimeout(timer);
    }, [closable, keepDOM, onClose, onVisibleChange]);

    const handleBackdropClick = () => {
        backdropClosable && handleHide();
    };

    useEffect(() => {
        const unsub = subscribe(() => {
            setTop(isTop(mid));
        });
        return unsub;
    }, []);

    useEffect(() => {
        const unregister = register({
            mid,
            visible: !!visible,
            hideBackdrop: !!hideBackdrop,
            closable: !!closable,
        });
        return unregister;
    }, []);

    useEffect(() => {
        visible ? handleShow() : handleHide();
    }, [visible]);

    useEffect(() => {
        if (!show) return;
        const raf = requestAnimationFrame(() => {
            setActive(top);
        });
        return () => cancelAnimationFrame(raf);
    }, [top]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useKeydown(
        (e) => {
            if (e.code !== "Escape" || !visible || !top) return;
            handleHide();
        },
        { disabled: disableEsc },
    );

    const handleClick = () => {
        if (typeof document === "undefined") return;
        document.documentElement.click();
    };

    if (!show || !mounted) return null;

    return createPortal(
        <div
            ref={layerRef}
            className={classNames(
                "i-modal-layer",
                {
                    "i-modal-active": active,
                    "i-modal-customized": customized,
                    "i-modal-hide-backdrop": hideBackdrop,
                    fixed,
                },
                className,
            )}
            style={style}
            onClick={handleBackdropClick}
        >
            <div
                className={classNames("i-modal", {
                    bounced,
                    shadow: !hideShadow,
                })}
                style={{
                    width,
                    height,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                    onClick?.(e);
                }}
                role="dialog"
                aria-modal={top}
                data-mid={mid}
                {...restProps}
            >
                <ModalContext.Provider value={true}>
                    {customized && children}

                    {!customized && <Content title={title} hideCloseButton={hideCloseButton} footer={footer} okButtonProps={okButtonProps} cancelButtonProps={cancelButtonProps} children={children} footerLeft={footerLeft} onOk={onOk} onClose={handleHide} />}
                </ModalContext.Provider>
            </div>
        </div>,
        getContainer(),
    );
}

Modal.useModal = useModal;

export default Modal as CompositionModal;
