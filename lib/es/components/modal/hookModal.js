import { jsx } from 'react/jsx-runtime';
import { useImperativeHandle } from 'react';
import { useReactive } from '../../js/hooks.js';
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
            const canClose = typeof mergedProps.closable === 'function'
                ? mergedProps.closable()
                : (mergedProps.closable ?? true);
            if (canClose instanceof Promise) {
                canClose.then((result) => {
                    if (!result)
                        state.visible = true;
                });
                return;
            }
            if (canClose)
                return;
            Promise.resolve().then(() => {
                state.visible = true;
            });
        },
    }));
    return jsx(Modal, { ...mergedProps });
};

export { HookModal as default };
