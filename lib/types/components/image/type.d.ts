import { FC, HTMLAttributes, ReactNode } from 'react';
import List from './list.js';

interface IImage extends HTMLAttributes<HTMLImageElement> {
    src?: string;
    alt?: string;
    round?: boolean;
    size?: string | number;
    initSize?: string | number;
    lazyload?: boolean;
    fallback?: ReactNode;
    fit?: any;
    cover?: ReactNode;
    coverClass?: string;
    usePreview?: boolean;
}
interface IImageList extends Omit<IImage, "src" | "alt"> {
    items: string[] | IImage[];
    gap?: number | string;
    columns?: number | string;
    wrap?: any;
    direction?: any;
}
interface CompositionImage extends FC<IImage> {
    List: typeof List;
}

export type { CompositionImage, IImage, IImageList };
