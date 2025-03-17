'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var list = require('../list/list.js');
var popup = require('../popup/popup.js');
var item = require('./item.js');

const Dropdown = (props) => {
    const { width, content, children, ...restProps } = props;
    return (jsxRuntime.jsx(popup.default, { trigger: 'click', position: 'bottom', touchable: true, content: jsxRuntime.jsx(list.default, { className: 'i-dropdown-content', style: { minWidth: width }, children: content }), ...restProps, children: children }));
};
Dropdown.Item = item.default;

exports.default = Dropdown;
//# sourceMappingURL=dropdown.js.map
