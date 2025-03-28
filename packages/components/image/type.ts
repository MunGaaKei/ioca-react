import { FC, HTMLAttributes, ReactNode } from "react";
import type { TPreviewItem } from "../../js/usePreview/type";
import List from "./list";

export interface IImage extends HTMLAttributes<HTMLImageElement> {
	src?: string;
	thumb?: string;
	alt?: string;
	round?: boolean;
	size?: string | number;
	initSize?: string | number;
	width?: string | number;
	height?: string | number;
	lazyload?: boolean;
	fallback?: ReactNode;
	fit?: any;
	ratio?: number;
	cover?: ReactNode;
	coverClass?: string;
	usePreview?: boolean | TPreviewItem;
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
