import { HTMLAttributes, ReactNode } from 'react';

interface IPagination extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    page?: number;
    total?: number;
    sibling?: number;
    size?: number;
    sizeOptions?: number[];
    prev?: ReactNode;
    next?: ReactNode;
    simple?: boolean;
    jumper?: boolean;
    renderPage?: (i: number) => ReactNode;
    renderEllipsis?: () => ReactNode;
    onChange?: (page: number) => Promise<void> | void;
}

export type { IPagination };
