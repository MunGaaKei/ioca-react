/// <reference types="react" />

import { HTMLAttributes, ReactNode } from 'react';

interface ILoading extends HTMLAttributes<HTMLDivElement> {
    icon?: ReactNode;
    text?: ReactNode;
    size?: number | string;
    absolute?: boolean;
}

export type { ILoading };
