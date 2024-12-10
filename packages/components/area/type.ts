import {
	ForwardRefExoticComponent,
	HTMLAttributes,
	RefAttributes,
} from "react";
import { ScrollbarProps } from "react-custom-scrollbars-2";
import Item from "./item";

export interface IArea extends ScrollbarProps {
	layout?: "ltcb" | "tlrb";
}

export interface IAreaItem extends HTMLAttributes<HTMLElement> {
	name?: string;
}

export interface CompositionArea
	extends ForwardRefExoticComponent<IArea & RefAttributes<HTMLDivElement>> {
	Item: typeof Item;
}
