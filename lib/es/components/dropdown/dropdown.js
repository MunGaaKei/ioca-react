import { jsx } from 'react/jsx-runtime';
import List from '../list/list.js';
import Popup from '../popup/popup.js';
import Item from './item.js';

const Dropdown = (props) => {
    const { width, content, children, ...restProps } = props;
    return (jsx(Popup, { trigger: 'click', position: 'bottom', touchable: true, content: jsx(List, { className: 'i-dropdown-content', style: { minWidth: width }, children: content }), ...restProps, children: children }));
};
Dropdown.Item = Item;

export { Dropdown as default };
//# sourceMappingURL=dropdown.js.map
