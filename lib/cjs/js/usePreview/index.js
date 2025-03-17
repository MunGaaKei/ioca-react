'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hookModal = require('../../components/modal/hookModal.js');
var utils = require('../utils.js');
var content = require('./content.js');

function usePreview() {
    const ref = react.useRef(null);
    const preview = (config) => {
        const { items, modalProps, onClose, ...restProps } = config;
        const handleClose = () => {
            onClose?.();
            unMount?.();
        };
        const unMount = utils.renderNode(jsxRuntime.jsx(hookModal.default, { ref: ref, visible: true, className: 'i-preview', customized: true, hideShadow: true, ...modalProps, children: jsxRuntime.jsx(content.default, { ...restProps, items: items, onClose: () => {
                    ref.current?.update({ visible: false });
                } }), fixed: true, onClose: handleClose }));
    };
    return preview;
}

exports.default = usePreview;
//# sourceMappingURL=index.js.map
