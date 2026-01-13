import { ReactNode } from 'react';
import { IListItem } from '../list/type.js';
import { IPopup } from '../popup/type.js';

interface IDropdown extends Omit<IPopup, "content"> {
    width?: string | number;
    content?: ReactNode | ((close: () => void) => ReactNode);
}
interface IDropItem extends IListItem {
    more?: ReactNode;
    moreProps?: IDropdown;
}

export type { IDropItem, IDropdown };
