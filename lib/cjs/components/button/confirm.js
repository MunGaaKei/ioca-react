'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ahooks = require('ahooks');
var button = require('./button.js');

const defaultOk = {
    children: "确定",
    className: "bg-error",
};
const defaultCancel = {
    children: "取消",
    secondary: true,
};
function Confirm(props) {
    const { ref, size, okButtonProps, cancelButtonProps, onOk, onCancel, onClick, ...restProps } = props;
    const state = ahooks.useReactive({
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
        return (jsxRuntime.jsx(button.default, { ref: ref, size: size, ...restProps, onClick: handleClick }));
    }
    return (jsxRuntime.jsxs(button.default.Group, { children: [jsxRuntime.jsx(button.default, { size: size, ...ok, loading: state.loading, onClick: hanldeOk }), jsxRuntime.jsx(button.default, { size: size, ...cancel, disabled: state.loading, onClick: handleCancel })] }));
}

exports.default = Confirm;
//# sourceMappingURL=confirm.js.map
