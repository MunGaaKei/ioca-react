import { HTMLAttributes, ReactNode } from "react";

export interface IPagination
	extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	page?: number;
	total?: number;
	sibling?: number;
	size?: number;
	sizeOptions?: number[];
	prev?: ReactNode;
	next?: ReactNode;
	simple?: boolean;
	jumper?: boolean;
	renderPage?: (i: number) => ReactNode;
	renderEllipsis?: () => ReactNode;
	onChange?: (page: number) => Promise<void> | void;
}

export interface IPageItem extends Pick<IPagination, "children" | "onChange"> {
	active?: boolean;
	disabled?: boolean;
	page: number;
}
