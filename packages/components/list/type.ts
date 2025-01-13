import { ListProps } from "rc-virtual-list";
import { HTMLAttributes, ReactNode, RefObject } from "react";

export interface IList extends HTMLAttributes<HTMLUListElement> {
	label?: ReactNode | ((i: number) => ReactNode);
	type?: "option" | "default";
}

export interface IListItem
	extends HTMLAttributes<HTMLLIElement>,
		Pick<IList, "type"> {
	ref?: RefObject<HTMLLIElement | null>;
	active?: boolean;
	align?: string;
	disabled?: boolean;
	label?: ReactNode;
}

export interface IVirtual extends Omit<ListProps<any>, "children"> {
	renderItem: (item: any, i: number) => ReactNode;
}
