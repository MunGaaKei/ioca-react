/// <reference types="react" />

import { ReactNode } from 'react';
import { IListItem } from '../list/type.js';
import { IPopup } from '../popup/type.js';

interface IDropdown extends IPopup {
    width?: string | number;
}
interface IDropItem extends IListItem {
    more?: ReactNode;
    moreProps?: IDropdown;
}

export type { IDropItem, IDropdown };
