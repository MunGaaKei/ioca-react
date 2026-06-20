import { jsx } from 'react/jsx-runtime';
import { useRef, useState, useMemo } from 'react';
import List from '../list/list.js';
import Popup from '../popup/popup.js';
import { useDropdown } from './dropdown.js';

const { Item: ListItem } = List;
const Item = (props) => {
    const { more, moreProps, onClick, ref: itemRef, type = "option", children, ...restProps } = props;
    const { close, border = true } = useDropdown();
    const liRef = useRef(null);
    const [position, setPosition] = useState("right");
    const { position: morePosition, onVisibleChange: moreOnVisibleChange, width: moreWidth, ...restMoreProps } = moreProps ?? {};
    const effectivePosition = morePosition ?? position;
    const rafRef = useRef(0);
    const handleVisibleChange = (v) => {
        if (v && liRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                if (!liRef.current)
                    return;
                const rect = liRef.current.getBoundingClientRect();
                setPosition(rect.left > window.innerWidth / 2 ? "left" : "right");
            });
        }
        moreOnVisibleChange?.(v);
    };
    const Li = useMemo(() => (jsx(ListItem, { ref: itemRef ?? liRef, role: "menuitem", "aria-haspopup": more ? "menu" : undefined, onClick: (e) => {
            e.stopPropagation();
            if (!more)
                close?.();
            onClick?.(e);
        }, type: type, ...restProps, children: children })), [itemRef, liRef, more, close, onClick, type, restProps, children]);
    if (!more)
        return Li;
    return (jsx(Popup, { border: border, ...restMoreProps, position: effectivePosition, touchable: true, arrow: false, align: "start", offset: 8, hideDelay: 240, onVisibleChange: handleVisibleChange, content: jsx(List, { type: "option", padding: 4, className: "i-dropdown-content", style: { minWidth: moreWidth }, onClick: (e) => e.stopPropagation(), children: more }), children: Li }));
};

export { Item as default };
