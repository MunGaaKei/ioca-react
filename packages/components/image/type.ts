import { FC, HTMLAttributes, ReactNode } from "react";
import List from "./list";

export interface IImage extends HTMLAttributes<HTMLImageElement> {
	src?: string;
	alt?: string;
	round?: boolean;
	size?: string | number;
	initSize?: string | number;
	lazyload?: boolean;
	fallback?: ReactNode;
	fit?: any;
	usePreview?: boolean;
}

export interface IImageList extends Omit<IImage, "src" | "alt"> {
	items: string[] | IImage[];
	gap?: number | string;
	columns?: number | string;
	wrap?: any;
	direction?: any;
}

export interface CompositionImage extends FC<IImage> {
	List: typeof List;
}
