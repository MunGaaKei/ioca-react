import { jsx, jsxs } from 'react/jsx-runtime';
import { InfoOutlined } from '@ricons/material';
import { useReactive } from 'ahooks';
import '../button/index.js';
import Flex from '../flex/flex.js';
import Icon from '../icon/icon.js';
import Popup from '../popup/popup.js';
import Button from '../button/button.js';

const defaultOk = {
    children: "确定",
};
const defaultCancel = {
    children: "取消",
    secondary: true,
};
const Popconfirm = (props) => {
    const { trigger = "click", visible, icon = jsx(Icon, { icon: jsx(InfoOutlined, {}), className: 'error' }), content, okButtonProps, cancelButtonProps, children, align = "end", position = "top", offset = 12, extra, onOk, onClose, ...restProps } = props;
    const state = useReactive({
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
    const popconfirmContent = (jsxs("div", { className: 'i-popconfirm', children: [jsxs(Flex, { gap: 12, children: [icon, jsx("div", { className: 'i-popconfirm-content', children: content })] }), jsxs(Flex, { gap: 12, justify: 'flex-end', className: 'mt-8 i-popconfirm-footer', children: [cancelButtonProps !== null && (jsx(Button, { ...cancel, onClick: handleCancel })), extra, okButtonProps !== null && (jsx(Button, { loading: state.loading, ...ok, onClick: handleOk }))] })] }));
    return (jsx(Popup, { content: popconfirmContent, ...restProps, trigger: trigger, visible: state.visible, align: align, offset: offset, position: position, onVisibleChange: handleVisibleChange, children: children }));
};

export { Popconfirm as default };
//# sourceMappingURL=popconfirm.js.map
