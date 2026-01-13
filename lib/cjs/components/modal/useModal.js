'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var utils = require('../../js/utils.js');
var hookModal = require('./hookModal.js');

function useModal() {
    const ref = react.useRef(null);
    const handleOpen = (props) => {
        const unMount = utils.renderNode(jsxRuntime.jsx(hookModal.default, { ref: ref, visible: true, ...props, onClose: () => {
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

exports.default = useModal;
//# sourceMappingURL=useModal.js.map
