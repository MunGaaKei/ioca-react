import { ReactNode } from "react";
import { IListItem } from "../list/type";
import type { IPopup } from "../popup/type";

export interface IDropdown extends Omit<IPopup, "content"> {
	width?: string | number;
	content?: ReactNode | ((close: () => void) => ReactNode);
}

export interface IDropItem extends IListItem {
	more?: ReactNode;
	moreProps?: IDropdown;
}
