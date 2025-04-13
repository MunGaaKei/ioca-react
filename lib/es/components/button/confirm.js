import { jsx, jsxs } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import Button from './button.js';

const defaultOk = {
    children: "确定",
    className: "bg-error",
};
const defaultCancel = {
    children: "取消",
    secondary: true,
};
function Confirm(props) {
    const { ref, okButtonProps, cancelButtonProps, onOk, onCancel, onClick, ...restProps } = props;
    const state = useReactive({
        active: false,
        loading: false,
    });
    const ok = okButtonProps
        ? Object.assign({}, defaultOk, okButtonProps)
        : defaultOk;
    const cancel = cancelButtonProps
        ? Object.assign({}, defaultCancel, cancelButtonProps)
        : defaultCancel;
    const handleClick = (e) => {
        onClick?.(e);
        state.active = true;
    };
    const hanldeOk = async () => {
        if (state.loading)
            return;
        state.loading = true;
        try {
            const res = await onOk?.();
            if (res !== false) {
                state.active = false;
            }
        }
        finally {
            state.loading = false;
        }
    };
    const handleCancel = () => {
        onCancel?.();
        state.active = false;
    };
    if (!state.active) {
        return jsx(Button, { ref: ref, ...restProps, onClick: handleClick });
    }
    return (jsxs(Button.Group, { children: [jsx(Button, { ...ok, loading: state.loading, onClick: hanldeOk }), jsx(Button, { ...cancel, disabled: state.loading, onClick: handleCancel })] }));
}

export { Confirm as default };
//# sourceMappingURL=confirm.js.map
