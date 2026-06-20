import { jsx } from 'react/jsx-runtime';
import { createContext, useState, useCallback, useEffect, useContext } from 'react';
import List from '../list/list.js';
import Popup from '../popup/popup.js';
import Item from './item.js';

const DropdownContext = createContext({ close: () => { } });
const useDropdown = () => useContext(DropdownContext);
const Dropdown = (props) => {
    const { visible, width, content, children, ...restProps } = props;
    const [active, setActive] = useState(visible);
    if (!content) {
        return children;
    }
    const close = useCallback(() => setActive(false), []);
    const handleVisibleChange = useCallback((v) => {
        setActive(v);
        props.onVisibleChange?.(v);
    }, [props.onVisibleChange]);
    useEffect(() => {
        setActive(visible);
    }, [visible]);
    return (jsx(Popup, { trigger: "click", position: "bottom", border: true, content: jsx(DropdownContext.Provider, { value: { close, border: props.border }, children: jsx(List, { type: "option", className: "i-dropdown-content", style: { minWidth: width }, role: "menu", children: typeof content === "function" ? content(close) : content }) }), ...restProps, touchable: true, visible: active, onVisibleChange: handleVisibleChange, children: children }));
};
Dropdown.Item = Item;

export { DropdownContext, Dropdown as default, useDropdown };
