import { FC, HTMLAttributes, ReactNode } from 'react';
import { IPreview } from '../../js/usePreview/type.js';
import List from './list.js';

interface IImage extends HTMLAttributes<HTMLImageElement> {
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
    usePreview?: boolean | IPreview;
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
