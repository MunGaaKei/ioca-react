/// <reference types="react" />

import { FC, JSX, CSSProperties, ReactNode } from 'react';
import HighLight from './highlight.js';
import Number from './number.js';
import Number$1 from './time.js';

interface IText {
    as?: keyof JSX.IntrinsicElements;
    size?: string | number;
    decoration?: string;
    weight?: string | number;
    gradient?: string[];
    wave?: boolean;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
}
interface ITextNumber extends IText {
    count?: number;
    to?: number;
    decimal?: number;
    thousand?: string;
    duration?: number;
    easing?: (x: number) => number;
}
interface ITextTime extends IText {
    seconds?: number;
    zero?: boolean;
    units?: string[];
}
interface ITextHighLight extends IText {
    keyword: string | string[];
    text: string;
    caseSensitive?: boolean;
    escape?: boolean;
    renderWord?: (word: string) => ReactNode;
}
interface CompositionText extends FC<IText> {
    Number: typeof Number;
    Time: typeof Number$1;
    HighLight: typeof HighLight;
}

export type { CompositionText, IText, ITextHighLight, ITextNumber, ITextTime };
