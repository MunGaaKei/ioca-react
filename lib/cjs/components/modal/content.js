'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var button = require('../button/button.js');
var helpericon = require('../utils/helpericon/helpericon.js');

function Content(props) {
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

exports.default = Content;
//# sourceMappingURL=content.js.map
