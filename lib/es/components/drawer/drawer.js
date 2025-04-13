import { jsx, jsxs } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useRef, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useKeydown } from '../../js/hooks.js';
import Helpericon from '../utils/helpericon/helpericon.js';

function Drawer(props) {
    const { visible, position = "left", header, footer, backdropClosable = true, hideCloseButton, keepDOM, className, disabledEsc, children, onVisibleChange, onClose, ...restProps } = props;
    const toggable = useRef(true);
    const state = useReactive({
        show: visible,
        active: visible,
    });
    const [isPending, startTransition] = useTransition();
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
    useEffect(() => {
        visible ? handleShow() : handleHide();
    }, [visible]);
    const handleBackdropClick = () => {
        backdropClosable && handleHide();
    };
    useKeydown((e) => {
        if (e.code !== "Escape" || !visible)
            return;
        handleHide();
    }, {
        disabled: disabledEsc,
    });
    if (!state.show)
        return null;
    return createPortal(jsx("div", { className: classNames("i-backdrop-drawer", className, {
            "i-active": state.active,
        }), onClick: handleBackdropClick, ...restProps, children: jsxs("div", { className: classNames("i-drawer", `i-drawer-${position}`), onClick: (e) => e.stopPropagation(), children: [header && (jsxs("header", { className: 'i-drawer-header', children: [header, !hideCloseButton && (jsx(Helpericon, { className: 'i-drawer-close', onClick: handleHide }))] })), jsx("div", { className: 'i-drawer-content', children: children }), footer && jsx("div", { className: 'i-drawer-footer', children: footer })] }) }), document.body);
}

export { Drawer as default };
//# sourceMappingURL=drawer.js.map
