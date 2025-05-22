import { jsx } from 'react/jsx-runtime';
import List from '../list/list.js';
import Popup from '../popup/popup.js';

const { Item: ListItem } = List;
const Item = (props) => {
    const { more, moreProps, onClick, ...restProps } = props;
    const Li = (jsx(ListItem, { onClick: (e) => {
            e.stopPropagation();
            onClick?.(e);
        }, ...restProps }));
    if (!more)
        return Li;
    return (jsx(Popup, { position: 'right', touchable: true, arrow: false, align: 'start', offset: 10, hideDelay: 240, ...moreProps, content: jsx(List, { className: 'i-dropdown-content', onClick: (e) => e.stopPropagation(), children: more }), children: Li }));
};

export { Item as default };
//# sourceMappingURL=item.js.map
