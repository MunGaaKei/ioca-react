import { HTMLAttributes } from "react";

export interface IAffix extends HTMLAttributes<HTMLElement> {
	position?: "fixed" | "absolute" | "sticky" | "static";
	left?: string | number;
	top?: string | number;
	right?: string | number;
	bottom?: string | number;
	offset?: number;
	getContainer?: () => HTMLElement | null;
}
