'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var ahooks = require('ahooks');
var hooks = require('../../js/hooks.js');

function Resize(props) {
    const { index, onWidthChange } = props;
    const state = ahooks.useReactive({
        resizing: false,
        x: 0,
        width: 0,
    });
    const handleMouseDown = (e) => {
        const tar = e.target;
        const width = tar.offsetParent.offsetWidth;
        Object.assign(state, {
            x: e.pageX,
            resizing: true,
            width,
        });
    };
    const handleMouseMove = (e) => {
        if (!state.resizing)
            return;
        e.preventDefault();
        const after = state.width + e.pageX - state.x;
        if (after <= 24)
            return;
        onWidthChange(index, after);
    };
    const handleMouseUp = () => {
        if (!state.resizing)
            return;
        state.resizing = false;
    };
    hooks.useMouseMove(handleMouseMove);
    hooks.useMouseUp(handleMouseUp);
    return (jsxRuntime.jsx("i", { className: 'i-datagrid-resizor', onMouseDown: handleMouseDown, onClick: (e) => e.stopPropagation() }));
}

exports.default = Resize;
//# sourceMappingURL=resize.js.map
