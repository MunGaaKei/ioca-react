import { CSSProperties, HTMLAttributes, ReactNode, RefObject } from "react";

export interface IIcon extends HTMLAttributes<HTMLElement> {
	icon: ReactNode;
	ref?: RefObject<HTMLOrSVGElement | null>;
	size?: string;
	rotate?: number;
	style?: CSSProperties;
	className?: string;
}
