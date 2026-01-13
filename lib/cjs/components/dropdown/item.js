'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var list = require('../list/list.js');
var popup = require('../popup/popup.js');

const { Item: ListItem } = list.default;
const Item = (props) => {
    const { more, moreProps, onClick, ...restProps } = props;
    const Li = (jsxRuntime.jsx(ListItem, { onClick: (e) => {
            e.stopPropagation();
            onClick?.(e);
        }, ...restProps }));
    if (!more)
        return Li;
    return (jsxRuntime.jsx(popup.default, { position: 'right', touchable: true, arrow: false, align: 'start', offset: 10, hideDelay: 240, ...moreProps, content: jsxRuntime.jsx(list.default, { className: 'i-dropdown-content', onClick: (e) => e.stopPropagation(), children: more }), children: Li }));
};

exports.default = Item;
//# sourceMappingURL=item.js.map
