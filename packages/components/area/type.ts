import {
	ForwardRefExoticComponent,
	HTMLAttributes,
	RefAttributes,
} from "react";
import Item from "./item";

export interface IArea extends HTMLAttributes<HTMLDivElement> {
	layout?: "ltcb" | "tlrb";
}

export interface IAreaItem extends HTMLAttributes<HTMLDivElement> {
	name?: string;
	ref?: React.Ref<HTMLDivElement>;
}

export interface CompositionArea
	extends ForwardRefExoticComponent<IArea & RefAttributes<HTMLDivElement>> {
	Item: typeof Item;
}
