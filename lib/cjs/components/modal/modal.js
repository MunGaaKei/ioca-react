'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var classNames = require('classnames');
var react = require('react');
var reactDom = require('react-dom');
var hooks = require('../../js/hooks.js');
var content = require('./content.js');
var context = require('./context.js');
var modalManager = require('./modalManager.js');
var useModal = require('./useModal.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

var classNames__default = /*#__PURE__*/_interopDefaultCompat(classNames);

let midCounter = 0;
function Modal(props) {
    const { visible, title, footer, okButtonProps, cancelButtonProps, closable = true, hideBackdrop, backdropClosable = true, hideCloseButton, disableEsc, width, height, customized, fixed, hideShadow, children, style, className, keepDOM, footerLeft, onClick, onVisibleChange, onClose, onOk, ...restProps } = props;
    const midRef = react.useRef(`modal-${++midCounter}`);
    const mid = midRef.current;
    const [show, setShow] = react.useState(visible);
    const [active, setActive] = react.useState(false);
    const [bounced, setBounced] = react.useState(false);
    const [mounted, setMounted] = react.useState(false);
    const [top, setTop] = react.useState(false);
    const toggable = react.useRef(true);
    const layerRef = react.useRef(null);
    const handleShow = react.useCallback(() => {
        if (!toggable.current)
            return;
        if (!keepDOM || !show)
            setShow(true);
        toggable.current = false;
        modalManager.updateVisible(mid, true);
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
    const handleHide = react.useCallback(() => {
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
        modalManager.updateVisible(mid, false);
        const timer = setTimeout(() => {
            if (!keepDOM)
                setShow(false);
            toggable.current = true;
            onVisibleChange?.(false);
            onClose?.();
        }, 240);
        return () => clearTimeout(timer);
    }, [closable, keepDOM, onClose, onVisibleChange]);
    const handleBackdropClick = () => {
        backdropClosable && handleHide();
    };
    react.useEffect(() => {
        const unsub = modalManager.subscribe(() => {
            setTop(modalManager.isTop(mid));
        });
        return unsub;
    }, []);
    react.useEffect(() => {
        const unregister = modalManager.register({
            mid,
            visible: !!visible,
            hideBackdrop: !!hideBackdrop,
            closable: !!closable,
        });
        return unregister;
    }, []);
    react.useEffect(() => {
        visible ? handleShow() : handleHide();
    }, [visible]);
    react.useEffect(() => {
        if (!show)
            return;
        const raf = requestAnimationFrame(() => {
            setActive(top);
        });
        return () => cancelAnimationFrame(raf);
    }, [top]);
    react.useEffect(() => {
        setMounted(true);
    }, []);
    hooks.useKeydown((e) => {
        if (e.code !== "Escape" || !visible || !top)
            return;
        handleHide();
    }, { disabled: disableEsc });
    const handleClick = () => {
        if (typeof document === "undefined")
            return;
        document.documentElement.click();
    };
    if (!show || !mounted)
        return null;
    return reactDom.createPortal(jsxRuntime.jsx("div", { ref: layerRef, className: classNames__default("i-modal-layer", {
            "i-modal-active": active,
            "i-modal-customized": customized,
            "i-modal-hide-backdrop": hideBackdrop,
            fixed,
        }, className), style: style, onClick: handleBackdropClick, children: jsxRuntime.jsx("div", { className: classNames__default("i-modal", {
                bounced,
                shadow: !hideShadow,
            }), style: {
                width,
                height,
            }, onClick: (e) => {
                e.stopPropagation();
                handleClick();
                onClick?.(e);
            }, role: "dialog", "aria-modal": top, "data-mid": mid, ...restProps, children: jsxRuntime.jsxs(context.default.Provider, { value: true, children: [customized && children, !customized && (jsxRuntime.jsx(content.default, { title: title, hideCloseButton: hideCloseButton, footer: footer, okButtonProps: okButtonProps, cancelButtonProps: cancelButtonProps, children: children, footerLeft: footerLeft, onOk: onOk, onClose: handleHide }))] }) }) }), modalManager.getContainer());
}
Modal.useModal = useModal.default;

exports.default = Modal;
//# sourceMappingURL=modal.js.map
