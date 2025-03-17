import { jsx } from 'react/jsx-runtime';
import { useRef } from 'react';
import HookModal from '../../components/modal/hookModal.js';
import { renderNode } from '../utils.js';
import Content from './content.js';

function usePreview() {
    const ref = useRef(null);
    const preview = (config) => {
        const { items, modalProps, onClose, ...restProps } = config;
        const handleClose = () => {
            onClose?.();
            unMount?.();
        };
        const unMount = renderNode(jsx(HookModal, { ref: ref, visible: true, className: 'i-preview', customized: true, hideShadow: true, ...modalProps, children: jsx(Content, { ...restProps, items: items, onClose: () => {
                    ref.current?.update({ visible: false });
                } }), fixed: true, onClose: handleClose }));
    };
    return preview;
}

export { usePreview as default };
//# sourceMappingURL=index.js.map
