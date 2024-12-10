import { CSSProperties, ReactNode } from "react";

export interface IBadge {
	content?: ReactNode;
	contentClass?: string;
	dot?: boolean;
	dotSize?: string | number;
	round?: boolean;
	disabled?: boolean;
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
}
