import type { RefObject } from "react";
import { useImperativeHandle } from "react";
import { useReactive } from "../../js/hooks";
import Modal from "./modal";
import type { IModal, RefHookModal } from "./type";

const HookModal = (
    props: IModal & { ref?: RefObject<RefHookModal | null> },
) => {
    const { ref, ...restProps } = props;
    const state = useReactive<IModal>({});

    const mergedProps = Object.assign({}, restProps, state);

    useImperativeHandle(ref, () => ({
        update: (config: IModal = {}) => {
            Object.assign(state, config);
        },

        close: () => {
            state.visible = false;

            const canClose = typeof mergedProps.closable === 'function'
                ? mergedProps.closable()
                : (mergedProps.closable ?? true);

            if (canClose instanceof Promise) {
                canClose.then((result) => {
                    if (!result) state.visible = true;
                });
                return;
            }

            if (canClose) return;

            Promise.resolve().then(() => {
                state.visible = true;
            });
        },
    }));

    return <Modal {...mergedProps} />;
};

export default HookModal;
