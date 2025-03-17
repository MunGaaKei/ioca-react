/// <reference types="react" />

import { HTMLAttributes, JSX } from 'react';

interface IFlex extends HTMLAttributes<HTMLElement> {
    as?: keyof JSX.IntrinsicElements;
    align?: string;
    justify?: string;
    gap?: string | number;
    direction?: any;
    wrap?: any;
    columns?: string | number;
}

export type { IFlex };
