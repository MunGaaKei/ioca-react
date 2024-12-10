import { CSSProperties, HTMLAttributes, ReactNode } from "react";

export interface IIcon extends HTMLAttributes<HTMLElement> {
	icon: ReactNode;
	size?: string;
	rotate?: number;
	style?: CSSProperties;
	className?: string;
}
