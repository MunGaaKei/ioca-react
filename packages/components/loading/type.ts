import { HTMLAttributes, ReactNode } from "react";

export interface ILoading extends HTMLAttributes<HTMLDivElement> {
	icon?: ReactNode;
	text?: ReactNode;
	size?: number | string;
}
