/// <reference types="react" />

import { HTMLAttributes } from 'react';

interface IAffix extends HTMLAttributes<HTMLElement> {
    position?: "fixed" | "absolute" | "sticky" | "static";
    left?: string | number;
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    offset?: number;
    getContainer?: () => HTMLElement | null;
}

export type { IAffix };
