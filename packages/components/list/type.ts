import { ListProps } from "rc-virtual-list";
import { HTMLAttributes, ReactNode } from "react";

export interface IList extends HTMLAttributes<HTMLUListElement> {
	label?: ReactNode | ((i: number) => ReactNode);
	type?: "option" | "default";
}

export interface IListItem
	extends HTMLAttributes<HTMLLIElement>,
		Pick<IList, "type"> {
	active?: boolean;
	align?: string;
	disabled?: boolean;
	label?: ReactNode;
}

export interface IVirtual extends Omit<ListProps<any>, "children"> {
	renderItem: (item: any, i: number) => ReactNode;
}
