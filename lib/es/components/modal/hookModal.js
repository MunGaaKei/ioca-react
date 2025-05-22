import { jsx } from 'react/jsx-runtime';
import { useReactive } from 'ahooks';
import { useImperativeHandle } from 'react';
import Modal from './modal.js';

const HookModal = (props) => {
    const { ref, ...restProps } = props;
    const state = useReactive({});
    const mergedProps = Object.assign({}, restProps, state);
    useImperativeHandle(ref, () => ({
        update: (config = {}) => {
            Object.assign(state, config);
        },
        close: () => {
            state.visible = false;
            if (mergedProps.closable)
                return;
            Promise.resolve().then(() => {
                state.visible = true;
            });
        },
    }));
    return jsx(Modal, { ...mergedProps });
};

export { HookModal as default };
//# sourceMappingURL=hookModal.js.map
