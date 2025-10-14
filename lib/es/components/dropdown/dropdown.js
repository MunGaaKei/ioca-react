import { jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import List from '../list/list.js';
import Popup from '../popup/popup.js';
import Item from './item.js';

const Dropdown = (props) => {
    const { visible, width, content, children, ...restProps } = props;
    const [active, setActive] = useState(visible);
    if (!content) {
        return children;
    }
    return (jsx(Popup, { trigger: 'click', position: 'bottom', content: jsx(List, { className: 'i-dropdown-content', style: { minWidth: width }, children: typeof content === "function"
                ? content(() => setActive(false))
                : content }), ...restProps, touchable: true, visible: active, onVisibleChange: setActive, children: children }));
};
Dropdown.Item = Item;

export { Dropdown as default };
//# sourceMappingURL=dropdown.js.map
