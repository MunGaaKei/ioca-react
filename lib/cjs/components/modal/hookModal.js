'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ahooks = require('ahooks');
var react = require('react');
var modal = require('./modal.js');

const HookModal = (props) => {
    const { ref, ...restProps } = props;
    const state = ahooks.useReactive({});
    const mergedProps = Object.assign({}, restProps, state);
    react.useImperativeHandle(ref, () => ({
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
    return jsxRuntime.jsx(modal.default, { ...mergedProps });
};

exports.default = HookModal;
//# sourceMappingURL=hookModal.js.map
