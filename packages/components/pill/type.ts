import { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import type { ITag } from "../tag/type";

export interface IPill
	extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "value"> {
	value?: any[];
	onChange?: (value: any[]) => void;
	tagProps?: Partial<ITag>;
	max?: number;
	icon?: ReactNode;
	editable?: boolean;
	readonly?: boolean;
	label?: ReactNode;
	labelInline?: boolean;
	validator?: (value: any) => boolean | Promise<boolean>;
	format?: (value: any) => any;
	onUpdate?: (newValue: any, oldValue: any, type: "delete" | "create" | "update") => void | Promise<boolean>;
	renderItem?: (context: {
		value: any;
		index: number;
		editing: boolean;
		loading: boolean;
		readonly: boolean;
		remove: () => void;
	}) => ReactNode;
}

export interface ITagItemProps {
	item: any;
	index: number;
	isEditing: boolean;
	isLoading: boolean;
	tagProps?: Record<string, any>;
	editable?: boolean;
	readonly?: boolean;
	onClose: (index: number) => void;
	onClick: (e: React.MouseEvent, index: number) => void;
	onBlur: (index: number) => void;
	onKeyDown: (e: KeyboardEvent<HTMLSpanElement>, index: number) => void;
	renderItem?: IPill["renderItem"];
}

export interface ICreateTagProps {
	isEditing: boolean;
	isLoading: boolean;
	createTagProps?: Record<string, any>;
	tagProps?: Record<string, any>;
	onBlur: (index: number) => void;
	onKeyDown: (e: KeyboardEvent<HTMLSpanElement>, index: number) => void;
	onStartCreate: () => void;
}
