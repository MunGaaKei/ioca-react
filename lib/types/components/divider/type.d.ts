import { HTMLAttributes, ReactNode } from 'react';

interface IDivider extends HTMLAttributes<HTMLLIElement> {
    children?: ReactNode;
    color?: string;
    width?: number | string;
}

export type { IDivider };
