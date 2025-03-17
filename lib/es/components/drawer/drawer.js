import { jsx, jsxs } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useKeydown } from '../../js/hooks.js';
import Helpericon from '../utils/helpericon/helpericon.js';

function Drawer(props) {
    const { visible, position = "left", header, footer, backdropClosable = true, hideCloseButton, keepDOM, className, disabledEsc, children, onVisibleChange, onClose, ...restProps } = props;
    const toggable = useRef(true);
    const state = useReactive({
        show: visible,
        active: visible,
        init: false,
    });
    useEffect(() => {
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
    useKeydown((e) => {
        if (e.code !== "Escape" || !visible)
            return;
        handleHide();
    }, {
        disabled: disabledEsc,
    });
    return createPortal(state.show && (jsx("div", { className: classNames("i-backdrop-drawer", className, {
            "i-active": state.active,
        }), onClick: handleBackdropClick, ...restProps, children: jsxs("div", { className: classNames("i-drawer", `i-drawer-${position}`), onClick: (e) => e.stopPropagation(), children: [jsxs("header", { className: 'i-drawer-header', children: [header, jsx(Helpericon, { active: !hideCloseButton, className: 'i-drawer-close', onClick: handleHide })] }), jsx("div", { className: 'i-drawer-content', children: children }), jsx("div", { className: 'i-drawer-footer', children: footer })] }) })), document.body);
}

export { Drawer as default };
//# sourceMappingURL=drawer.js.map
