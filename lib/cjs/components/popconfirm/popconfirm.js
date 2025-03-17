'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var material = require('@ricons/material');
var ahooks = require('ahooks');
require('../button/index.js');
var flex = require('../flex/flex.js');
var icon = require('../icon/icon.js');
var popup = require('../popup/popup.js');
var button = require('../button/button.js');

const defaultOk = {
    children: "确定",
};
const defaultCancel = {
    children: "取消",
    secondary: true,
};
const Popconfirm = (props) => {
    const { trigger = "click", visible, icon: icon$1 = jsxRuntime.jsx(icon.default, { icon: jsxRuntime.jsx(material.InfoOutlined, {}), className: 'error' }), content, okButtonProps, cancelButtonProps, children, align = "end", position = "top", offset = 12, extra, onOk, onClose, ...restProps } = props;
    const state = ahooks.useReactive({
        loading: false,
        visible,
    });
    const ok = okButtonProps
        ? Object.assign({}, defaultOk, okButtonProps)
        : defaultOk;
    const cancel = cancelButtonProps
        ? Object.assign({}, defaultCancel, cancelButtonProps)
        : defaultCancel;
    const handleVisibleChange = (v) => {
        state.visible = v;
        restProps.onVisibleChange?.(v);
    };
    const handleOk = async (e) => {
        state.loading = true;
        ok.onClick?.(e);
        onOk?.()
            ?.then(() => {
            state.visible = false;
        })
            .finally(() => {
            state.loading = false;
        });
    };
    const handleCancel = async (e) => {
        cancel.onClick?.(e);
        await onClose?.();
        state.visible = false;
    };
    const popconfirmContent = (jsxRuntime.jsxs("div", { className: 'i-popconfirm', children: [jsxRuntime.jsxs(flex.default, { gap: 12, children: [icon$1, jsxRuntime.jsx("div", { className: 'i-popconfirm-content', children: content })] }), jsxRuntime.jsxs(flex.default, { gap: 12, justify: 'flex-end', className: 'mt-8 i-popconfirm-footer', children: [cancelButtonProps !== null && (jsxRuntime.jsx(button.default, { ...cancel, onClick: handleCancel })), extra, okButtonProps !== null && (jsxRuntime.jsx(button.default, { loading: state.loading, ...ok, onClick: handleOk }))] })] }));
    return (jsxRuntime.jsx(popup.default, { content: popconfirmContent, ...restProps, trigger: trigger, visible: state.visible, align: align, offset: offset, position: position, onVisibleChange: handleVisibleChange, children: children }));
};

exports.default = Popconfirm;
//# sourceMappingURL=popconfirm.js.map
