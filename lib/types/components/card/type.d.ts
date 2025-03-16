import { HTMLAttributes, CSSProperties, ReactNode } from 'react';

interface ICard extends HTMLAttributes<HTMLDivElement> {
    hideShadow?: boolean;
    border?: boolean;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
}

export type { ICard };
