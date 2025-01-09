import { HTMLAttributes, ReactNode } from "react";

export interface IDrawer extends HTMLAttributes<HTMLDivElement> {
	visible?: boolean;
	position?: "top" | "left" | "right" | "bottom";
	header?: ReactNode;
	footer?: ReactNode;
	hideCloseButton?: boolean;
	backdropClosable?: boolean;
	keepDOM?: boolean;
	onVisibleChange?: (visible: boolean) => void;
	onClose?: () => void;
}
