import { ReactNode } from "react";
import { IButton } from "../button/type";
import { IPopup } from "../popup/type";

export interface IPopconfirm extends IPopup {
	icon?: ReactNode;
	okButtonProps?: IButton;
	cancelButtonProps?: IButton;
	extra?: ReactNode;
	onOk?: () => Promise<void> | void;
	onClose?: () => Promise<void> | void;
}
