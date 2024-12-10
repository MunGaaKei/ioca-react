import { ReactNode } from "react";
import { IListItem } from "../list/type";
import type { IPopup } from "../popup/type";

export interface IDropdown extends IPopup {
	width?: string | number;
}

export interface IDropItem extends IListItem {
	more?: ReactNode;
	moreProps?: IDropdown;
}
