import { jsx } from 'react/jsx-runtime';
import { useRef } from 'react';
import { renderNode } from '../../js/utils.js';
import HookModal from './hookModal.js';

function useModal() {
    const ref = useRef(null);
    const handleOpen = (props) => {
        const unMount = renderNode(jsx(HookModal, { ref: ref, visible: true, ...props, onClose: () => {
                props.onClose?.();
                unMount?.();
            } }));
    };
    const handleUpdate = (props) => {
        if (!ref.current)
            return;
        const { update } = ref.current;
        update(props);
    };
    const handleClose = () => {
        if (!ref.current)
            return;
        const { close } = ref.current;
        close();
    };
    return {
        open: handleOpen,
        update: handleUpdate,
        close: handleClose,
    };
}

export { useModal as default };
//# sourceMappingURL=useModal.js.map
