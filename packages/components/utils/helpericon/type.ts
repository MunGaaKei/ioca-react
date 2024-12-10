import { CSSProperties, MouseEvent, ReactNode } from "react";

export interface IHelperIcon {
	as?: string;
	active?: boolean;
	loading?: boolean;
	icon?: ReactNode;
	className?: string;
	style?: CSSProperties;
	onClick?: (e: MouseEvent) => void;
	onMouseUp?: (e: MouseEvent) => void;
}
