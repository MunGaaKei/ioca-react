import { jsx } from 'react/jsx-runtime';
import { useContext, useRef, useState } from 'react';
import List from '../list/list.js';
import Popup from '../popup/popup.js';
import { DropdownCloseCtx } from './dropdown.js';

const { Item: ListItem } = List;
const Item = (props) => {
    const { more, moreProps, onClick, ref: itemRef, children, ...restProps } = props;
    const close = useContext(DropdownCloseCtx);
    const liRef = useRef(null);
    const [position, setPosition] = useState("right");
    const { position: morePosition, onVisibleChange: moreOnVisibleChange, width: moreWidth, ...restMoreProps } = moreProps ?? {};
    const effectivePosition = morePosition ?? position;
    const handleVisibleChange = (v) => {
        if (v && liRef.current) {
            const rect = liRef.current.getBoundingClientRect();
            setPosition(rect.left > window.innerWidth / 2 ? "left" : "right");
        }
        moreOnVisibleChange?.(v);
    };
    const Li = (jsx(ListItem, { ref: itemRef ?? liRef, onClick: (e) => {
            e.stopPropagation();
            if (!more)
                close?.();
            onClick?.(e);
        }, ...restProps, children: children }));
    if (!more)
        return Li;
    return (jsx(Popup, { ...restMoreProps, position: effectivePosition, touchable: true, arrow: false, align: "start", offset: 11, hideDelay: 240, onVisibleChange: handleVisibleChange, content: jsx(List, { className: "i-dropdown-content", style: { minWidth: moreWidth }, onClick: (e) => e.stopPropagation(), children: more }), children: Li }));
};

export { Item as default };
//# sourceMappingURL=item.js.map
