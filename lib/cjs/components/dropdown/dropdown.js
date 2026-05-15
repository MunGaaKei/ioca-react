'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var list = require('../list/list.js');
var popup = require('../popup/popup.js');
var item = require('./item.js');

const DropdownCloseCtx = react.createContext(null);
const Dropdown = (props) => {
    const { visible, width, content, children, ...restProps } = props;
    const [active, setActive] = react.useState(visible);
    if (!content) {
        return children;
    }
    const close = () => setActive(false);
    const handleVisibleChange = (v) => {
        setActive(v);
        if (props.onVisibleChange) {
            props.onVisibleChange(v);
        }
    };
    react.useEffect(() => {
        setActive(visible);
    }, [visible]);
    return (jsxRuntime.jsx(popup.default, { trigger: 'click', position: 'bottom', content: jsxRuntime.jsx(DropdownCloseCtx.Provider, { value: close, children: jsxRuntime.jsx(list.default, { className: 'i-dropdown-content', style: { minWidth: width }, children: typeof content === "function"
                    ? content(close)
                    : content }) }), ...restProps, touchable: true, visible: active, onVisibleChange: handleVisibleChange, children: children }));
};
Dropdown.Item = item.default;

exports.DropdownCloseCtx = DropdownCloseCtx;
exports.default = Dropdown;
//# sourceMappingURL=dropdown.js.map
