import { jsx } from 'react/jsx-runtime';
import { createContext, useState, useEffect } from 'react';
import List from '../list/list.js';
import Popup from '../popup/popup.js';
import Item from './item.js';

const DropdownCloseCtx = createContext(null);
const Dropdown = (props) => {
    const { visible, width, content, children, ...restProps } = props;
    const [active, setActive] = useState(visible);
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
    useEffect(() => {
        setActive(visible);
    }, [visible]);
    return (jsx(Popup, { trigger: 'click', position: 'bottom', content: jsx(DropdownCloseCtx.Provider, { value: close, children: jsx(List, { className: 'i-dropdown-content', style: { minWidth: width }, children: typeof content === "function"
                    ? content(close)
                    : content }) }), ...restProps, touchable: true, visible: active, onVisibleChange: handleVisibleChange, children: children }));
};
Dropdown.Item = Item;

export { DropdownCloseCtx, Dropdown as default };
