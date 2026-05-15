'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var list = require('../list/list.js');
var popup = require('../popup/popup.js');
var dropdown = require('./dropdown.js');

const { Item: ListItem } = list.default;
const Item = (props) => {
    const { more, moreProps, onClick, ref: itemRef, children, ...restProps } = props;
    const close = react.useContext(dropdown.DropdownCloseCtx);
    const liRef = react.useRef(null);
    const [position, setPosition] = react.useState("right");
    const { position: morePosition, onVisibleChange: moreOnVisibleChange, width: moreWidth, ...restMoreProps } = moreProps ?? {};
    const effectivePosition = morePosition ?? position;
    const handleVisibleChange = (v) => {
        if (v && liRef.current) {
            const rect = liRef.current.getBoundingClientRect();
            setPosition(rect.left > window.innerWidth / 2 ? "left" : "right");
        }
        moreOnVisibleChange?.(v);
    };
    const Li = (jsxRuntime.jsx(ListItem, { ref: itemRef ?? liRef, onClick: (e) => {
            e.stopPropagation();
            if (!more)
                close?.();
            onClick?.(e);
        }, ...restProps, children: children }));
    if (!more)
        return Li;
    return (jsxRuntime.jsx(popup.default, { ...restMoreProps, position: effectivePosition, touchable: true, arrow: false, align: "start", offset: 11, hideDelay: 240, onVisibleChange: handleVisibleChange, content: jsxRuntime.jsx(list.default, { className: "i-dropdown-content", style: { minWidth: moreWidth }, onClick: (e) => e.stopPropagation(), children: more }), children: Li }));
};

exports.default = Item;
//# sourceMappingURL=item.js.map
